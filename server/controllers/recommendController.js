// Simple placeholder logic for crop recommendation.
// In production this should call ML model or proper algorithm.

const axios = require("axios");
const CROP_RECOMMENDATION_API_URL =
  process.env.CROP_RECOMMENDATION_API_URL || "http://127.0.0.1:5001";

exports.cropSuitability = async (req, res, next) => {
  try {
    const body = req.body;
    console.log("Crop recommendation request payload:", body);
    // Call the ML recommendation service. Await the promise and return its data.
    const axiosRes = await axios.post(
      `${CROP_RECOMMENDATION_API_URL}/cropRotation`,
      body,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Crop recommendation response:", axiosRes.data);
    return res.json(axiosRes.data);
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

    // Network or connection error (e.g. ECONNREFUSED, ETIMEDOUT)
    if (err.code) {
      // Provide a 502 Bad Gateway for upstream service failures
      return res.status(502).json({
        error: "Upstream ML service unavailable",
        details: err.message,
        code: err.code,
      });
    }

    // Unknown error: pass to global error handler
    next(err);
  }
};
