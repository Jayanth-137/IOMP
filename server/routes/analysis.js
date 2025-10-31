const express = require("express");
const router = express.Router();
const analysisController = require("../controllers/analysisController");

router.post("/profitability", analysisController.profitability);

module.exports = router;
