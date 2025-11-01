// Price prediction controller - forwards request to ML Flask service and returns model output.
const axios = require("axios");

// Use ML service URL from env or default to a host likely running the Flask app.
// Set ML_SERVICE_URL in your environment if the service is at a different IP (e.g. 172.20.10.4).
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://172.20.10.4:9550";

exports.pricePrediction = async (req, res, next) => {
  try {
    console.log("Received price prediction request");
    const data = req.body;
    console.log(data);
    const payload = {
      district: data.district || "",
      market: data.market || "",
      variety: data.variety || "",
      grade: data.grade || "",
      day: data.day ? Number(data.day) : undefined,
      month: data.month ? Number(data.month) : undefined,
      day_of_week: data.day_of_week ? Number(data.day_of_week) : undefined,
      // // include any lag features if provided
      // min_price_lag_1: data.min_price_lag_1,
      // min_price_lag_2: data.min_price_lag_2,
      // min_price_lag_3: data.min_price_lag_3,
      // max_price_lag_1: data.max_price_lag_1,
      // max_price_lag_2: data.max_price_lag_2,
      // max_price_lag_3: data.max_price_lag_3,
      // modal_price_lag_1: data.modal_price_lag_1,
      // modal_price_lag_2: data.modal_price_lag_2,
      // modal_price_lag_3: data.modal_price_lag_3,
    };

    // Remove undefined keys so the ML service uses its defaults
    // Object.keys(payload).forEach(
    //   (k) => payload[k] === undefined && delete payload[k]
    // );

    const url = `${ML_SERVICE_URL}/predict`;
    // console.log(payload);
    const mlRes = await axios.post(url, data, {
      headers: { "Content-Type": "application/json" },
      timeout: 10_000,
    });

    // Expecting fields like predicted_min_price, predicted_max_price, predicted_modal_price
    const mlData = mlRes.data || {};

    // Sanity check: if the model returned inconsistent values (min > max), add a warning note
    const note = [];
    if (
      typeof mlData.predicted_min_price === "number" &&
      typeof mlData.predicted_max_price === "number" &&
      mlData.predicted_min_price > mlData.predicted_max_price
    ) {
      note.push(
        "Model returned predicted_min_price > predicted_max_price — verify model outputs."
      );
    }

    res.json({
      requested: {
        district: payload.district,
        market: payload.market,
        variety: payload.variety,
        grade: payload.grade
      },
      model: mlData,
      note: note.length ? note.join(" ") : undefined,
    });
  } catch (err) {
    // If the ML service responded with an error, forward a helpful message
    if (err.response) {
      const status = err.response.status || 500;
      const msg =
        err.response.data || err.response.statusText || "ML service error";
      return res
        .status(status)
        .json({ error: "ML service error", details: msg });
    }

    // Network/timeout/other errors
    next(err);
  }
};
