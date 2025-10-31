require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");

const connectDB = require("./config/db");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const recommendRoutes = require("./routes/recommend");
const forecastRoutes = require("./routes/forecast");
const analysisRoutes = require("./routes/analysis");
const diagnoseRoutes = require("./routes/diagnose");

const PORT = process.env.PORT || 5000;
const app = express();

// Ensure upload dir exists
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Serve uploads
app.use("/uploads", express.static(uploadDir));

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/recommend", recommendRoutes);
app.use("/api/v1/forecast", forecastRoutes);
app.use("/api/v1/analysis", analysisRoutes);
app.use("/api/v1/diagnose", diagnoseRoutes);

// health
app.get("/api/v1/health", (req, res) => res.json({ status: "ok" }));

// Error handler
app.use(errorHandler);

const start = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/iomp";
    await connectDB(mongoUri);
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (err) {
    logger.error("Failed to start server", err);
    process.exit(1);
  }
};

start();
