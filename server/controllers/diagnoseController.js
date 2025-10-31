const path = require("path");

exports.uploadImage = async (req, res, next) => {
  try {
    // multer will populate req.file
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // In a real app, call ML model or external service here. Return a stubbed response.
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    const fakeResult = {
      detected_disease: "Leaf Blight",
      disease: "Leaf Blight",
      confidence: 0.86,
      description:
        "A common fungal disease affecting leaves. Causes spots and reduced yield.",
      symptoms: ["Brown spots", "Yellowing", "Leaf curling"],
      treatment: [
        "Remove affected leaves",
        "Apply recommended fungicide",
        "Improve drainage",
      ],
      prevention: [
        "Crop rotation",
        "Use resistant varieties",
        "Avoid overhead irrigation",
      ],
      image_url: fileUrl,
    };

    res.json(fakeResult);
  } catch (err) {
    next(err);
  }
};
