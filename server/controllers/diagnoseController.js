const axios = require('axios');
const path = require("path");
// Include 'fs' and 'form-data' libraries for sending files in Node.js
const fs = require('fs'); 
const FormData = require('form-data');

const PREDICTION_API_URL = process.env.FLASK_API_URL+"/predict-disease";

// Define the class labels here, matching the Python model's output
const CLASS_NAMES = {
    0: 'Bacterial Leaf Blight',
    1: 'Bacterial Leaf Streak',
    2: 'Bacterial Panicle Blight',
    3: 'Blast',
    4: 'Brown Spot',
    5: 'Dead Heart',
    6: 'Downy Mildew',
    7: 'Hispa',
    8: 'Normal',
    9: 'Tungro'
};

exports.uploadImage = async (req, res, next) => {
    try {
        // 1. Check for file upload (handled by Multer)
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
            req.file.filename
        }`;
        
        // 2. Prepare the file for the external API call
        // The file is stored in req.file after Multer processes it.
        const filePath = req.file.path; // Get the temporary path where Multer stored the file.

        // Create a new FormData instance
        const formData = new FormData();
        // Append the file stream. The key 'file' must match what the Python API expects.
        formData.append('file', fs.createReadStream(filePath));

        // 3. Call the external prediction API
        const predictionResponse = await axios.post(
            PREDICTION_API_URL, 
            formData, 
            {
                // This is crucial: set the Content-Type header from formData
                headers: formData.getHeaders(),
            }
        );
        
        // 4. Clean up the temporarily stored file (optional but recommended)
        // Ensure you remove the file after it's been sent to the prediction service.
        fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting temp file:", err);
        });
        // 5. Enhance the prediction response with the file URL and return
        const finalResult = {
          ...predictionResponse.data, // Take all data from the Python API response
          image_url: fileUrl,        // Add the public URL of the image
        };
        finalResult.predicted_class_name = CLASS_NAMES[finalResult.predicted_class_index] || 'Unknown';

        res.json(finalResult);

    } catch (err) {
        // Handle Axios errors (like API being down or 500 status from the model)
        if (axios.isAxiosError(err) && err.response) {
            // Forward the model API's error status and message
            return res.status(err.response.status).json(err.response.data);
        }
        
        next(err); // Pass other errors to the Express error handler
    }
};