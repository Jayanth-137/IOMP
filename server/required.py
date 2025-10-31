import pandas as pd
from datetime import datetime, timedelta
import os
import requests
import pickle
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from joblib import load
# -------------------------
# Flask Setup
# -------------------------
app = Flask(__name__)
CORS(app)

# Load model and encoders once at startup
MODEL_PATH = "models/current_model.pkl"
ENCODER_PATH = "label_encoder.pkl"

# Define features (must match training features)
FEATURES = [
    "district", "market", "variety", "grade",
    "day", "month", "day_of_week",
    "min_price_lag_1", "min_price_lag_2", "min_price_lag_3",
    "max_price_lag_1", "max_price_lag_2", "max_price_lag_3",
    "modal_price_lag_1", "modal_price_lag_2", "modal_price_lag_3"
]


if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"❌ Model not found at {MODEL_PATH}")
if not os.path.exists(ENCODER_PATH):
    raise FileNotFoundError(f"❌ Encoder not found at {ENCODER_PATH}")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

with open(ENCODER_PATH, "rb") as f:
    encoders = pickle.load(f)

# -------------------------
# Helper Functions
# -------------------------

def safe_parse_date(x):
    """Safely parse mixed-format dates."""
    try:
        return pd.to_datetime(x, dayfirst=True, errors="coerce")
    except Exception:
        return pd.NaT


def load_or_create_encoders(df):
    if os.path.exists("label_encoder.pkl"):
        with open("label_encoder.pkl", "rb") as f:
            encoders = pickle.load(f)
    else:
        encoders = {}

    for col in ["district", "market", "variety", "grade"]:
        le = encoders.get(col, LabelEncoder())
        if hasattr(le, "classes_"):
            unseen = set(df[col]) - set(le.classes_)
            if unseen:
                le.classes_ = np.concatenate([le.classes_, list(unseen)])
        df[col] = le.fit_transform(df[col]) if not hasattr(le, "classes_") else le.transform(df[col])
        encoders[col] = le

    with open("label_encoder.pkl", "wb") as f:
        pickle.dump(encoders, f)

    return encoders



def train_multioutput_model(csv_path):
    """Train MultiOutput GradientBoostingRegressor model with given CSV data."""
    df = pd.read_csv(csv_path)
    df = df.drop(columns=['commodity', 'sl_no'], errors="ignore")
    df["price_date"] = df["price_date"].apply(safe_parse_date)
    df = df.dropna(subset=["price_date"])
    df = df.sort_values(by=["district", "market", "variety", "price_date"])

    group_cols = ["district", "market", "variety", "grade"]
    filled_dfs = []

    for key, group in df.groupby(group_cols):
        group = group.sort_values("price_date").drop_duplicates(subset=["price_date"], keep="last")
        full_dates = pd.date_range(start=group["price_date"].min(), end=group["price_date"].max(), freq="D")

        group = group.set_index("price_date").reindex(full_dates)
        group.index.name = "price_date"

        # Fill missing prices
        group[["min_price", "max_price", "modal_price"]] = group[["min_price", "max_price", "modal_price"]].ffill()

        for col, val in zip(group_cols, key):
            group[col] = val

        filled_dfs.append(group.reset_index())

    df_filled = pd.concat(filled_dfs).sort_values(by=["district", "market", "variety", "price_date"])
    df = df_filled.copy()

    # Target creation
    for col in ["min_price", "max_price", "modal_price"]:
        df[f"target_{col}"] = df.groupby(["district", "market", "variety"])[col].shift(-1)

    df = df.dropna(subset=["target_min_price", "target_max_price", "target_modal_price"])

    # Feature engineering
    df["day"] = df["price_date"].dt.day
    df["month"] = df["price_date"].dt.month
    df["day_of_week"] = df["price_date"].dt.dayofweek

    for col in ["min_price", "max_price", "modal_price"]:
        for lag in [1, 2, 3]:
            df[f"{col}_lag_{lag}"] = df.groupby(["district", "market", "variety"])[col].shift(lag)

    df = df.dropna(subset=["min_price_lag_3", "max_price_lag_3", "modal_price_lag_3"])

    # Label encoding
    encoders = load_or_create_encoders(df)

    features = [
        "district", "market", "variety", "grade",
        "day", "month", "day_of_week",
        "min_price_lag_1", "min_price_lag_2", "min_price_lag_3",
        "max_price_lag_1", "max_price_lag_2", "max_price_lag_3",
        "modal_price_lag_1", "modal_price_lag_2", "modal_price_lag_3"
    ]
    targets = ["target_min_price", "target_max_price", "target_modal_price"]

    X = df[features]
    y = df[targets]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

    gb = GradientBoostingRegressor(random_state=42)
    model = MultiOutputRegressor(gb)
    model.fit(X_train, y_train)

    with open("models/current_model.pkl", "wb") as f:
        pickle.dump(model, f)

    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    rmse = mean_squared_error(y_test, preds, squared=False)
    r2 = r2_score(y_test, preds)
    print(f"✅ Model retrained! MAE={mae:.2f}, RMSE={rmse:.2f}, R²={r2:.2f}")

    return model, encoders, df


def update_model_from_scrape():
    """Fetch new scraped data and retrain model."""
    print("🔄 Fetching new scraped data...")
    response = requests.get("http://127.0.0.1:8000/scrape")

    if response.status_code != 200:
        raise Exception("❌ Failed to fetch scrape data")

    today_data = pd.DataFrame(response.json())
    if today_data.empty:
        raise Exception("⚠️ No new data received from scrape API")

    historical_path = "data/agmarknet_data.csv"
    if os.path.exists(historical_path):
        historical_data = pd.read_csv(historical_path)
        updated_data = pd.concat([historical_data, today_data], ignore_index=True)
        updated_data = updated_data.drop_duplicates(
            subset=["district", "market", "variety", "grade", "price_date"], keep="last"
        )
    else:
        updated_data = today_data

    updated_data.to_csv(historical_path, index=False)
    print("📦 Data updated and saved to agmarknet_data.csv")

    return train_multioutput_model(historical_path)


def predict_tomorrow(model, encoders, district, market, variety, grade, df):
    """Predict next-day prices."""
    df = df[df["district"] == district]
    if df.empty:
        raise ValueError("No historical data for this district!")

    last_row = df.sort_values("price_date").iloc[-1]
    tomorrow = last_row["price_date"] + timedelta(days=1)

    

    input_data = pd.DataFrame([{
        "district": encoders["district"].transform([district])[0],
        "market": encoders["market"].transform([market])[0],
        "variety": encoders["variety"].transform([variety])[0],
        "grade": encoders["grade"].transform([grade])[0],
        "day": tomorrow.day,
        "month": tomorrow.month,
        "day_of_week": tomorrow.dayofweek,
        "min_price_lag_1": last_row["min_price"],
        "min_price_lag_2": last_row["min_price_lag_1"],
        "min_price_lag_3": last_row["min_price_lag_2"],
        "max_price_lag_1": last_row["max_price"],
        "max_price_lag_2": last_row["max_price_lag_1"],
        "max_price_lag_3": last_row["max_price_lag_2"],
        "modal_price_lag_1": last_row["modal_price"],
        "modal_price_lag_2": last_row["modal_price_lag_1"],
        "modal_price_lag_3": last_row["modal_price_lag_2"]
    }])

    preds = model.predict(input_data)[0]

    return {
        "date": tomorrow.strftime("%Y-%m-%d"),
        "min_price": round(preds[0], 2),
        "max_price": round(preds[1], 2),
        "modal_price": round(preds[2], 2)
    }


# -------------------------
# Flask Routes
# -------------------------
@app.route("/")
def home():
    return jsonify({"message": "🌾 Paddy Price Forecast API is live!"})


@app.route("/update_model", methods=["POST"])
def update_model():
    try:
        model, encoders, df = update_model_from_scrape()
        return jsonify({"message": "✅ Model updated successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        print("📥 Incoming data:", data)

        # Validate input
        for col in ["district", "market", "variety", "grade"]:
            if col not in data:
                # print("======>>>>")
                return jsonify({"error": f"Missing input field: {col}"}), 400

        # Encode categorical values using saved label encoders

        try:
            # print("======>>>>",encoders["district"].transform([data["district"]])[0])
            district_encoded = encoders["district"].transform([data["district"]])[0]
            market_encoded = encoders["market"].transform([data["market"]])[0]
            variety_encoded = encoders["variety"].transform([data["variety"]])[0]
            grade_encoded = encoders["grade"].transform([data["grade"]])[0]
        except ValueError as e:
            return jsonify({
                "error": f"Encoding failed: {e}. Ensure your input values match training categories."
            }), 400

        # Build input row
        input_row = {
            "district": district_encoded,
            "market": market_encoded,
            "variety": variety_encoded,
            "grade": grade_encoded,
            "day": data.get("day", 1),
            "month": data.get("month", 1),
            "day_of_week": data.get("day_of_week", 1),
            "min_price_lag_1": data.get("min_price_lag_1", 0),
            "min_price_lag_2": data.get("min_price_lag_2", 0),
            "min_price_lag_3": data.get("min_price_lag_3", 0),
            "max_price_lag_1": data.get("max_price_lag_1", 0),
            "max_price_lag_2": data.get("max_price_lag_2", 0),
            "max_price_lag_3": data.get("max_price_lag_3", 0),
            "modal_price_lag_1": data.get("modal_price_lag_1", 0),
            "modal_price_lag_2": data.get("modal_price_lag_2", 0),
            "modal_price_lag_3": data.get("modal_price_lag_3", 0)
        }

        # Convert to DataFrame
        X_input = pd.DataFrame([input_row])[FEATURES]

        # Predict
        preds = model.predict(X_input)[0]
        response = {
            "predicted_min_price": round(preds[0], 2),
            "predicted_max_price": round(preds[1], 2),
            "predicted_modal_price": round(preds[2], 2)
        }

        print("✅ Prediction output:", response)
        return jsonify(response)

    except Exception as e:
        print("❌ Error during prediction:", e)
        return jsonify({"error": str(e)}), 500
    




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9550, debug=True)