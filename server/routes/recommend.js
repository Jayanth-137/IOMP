const express = require("express");
const router = express.Router();
const recommendController = require("../controllers/recommendController");

router.post("/crop_suitability", recommendController.cropSuitability);

module.exports = router;
