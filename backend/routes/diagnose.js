const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const diagnoseController = require("../controllers/diagnoseController");

const uploadDir = process.env.UPLOAD_DIR || "uploads";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post(
  "/image_upload",
  upload.single("image"),
  diagnoseController.uploadImage
);

module.exports = router;
