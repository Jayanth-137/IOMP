const express = require("express");
const router = express.Router();
const forecastController = require("../controllers/forecastController");

router.get("/price_distribution", forecastController.priceDistribution);

module.exports = router;
