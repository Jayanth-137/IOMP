const express = require("express");
const router = express.Router();
const analysisController = require("../controllers/analysisController");

router.post("/price_prediction", analysisController.pricePrediction);

module.exports = router;
