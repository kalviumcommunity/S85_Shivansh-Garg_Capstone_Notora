const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Log the incoming file details for debugging
        console.log("Incoming file details:", {
            mimetype: file.mimetype,
            originalname: file.originalname,
            fieldname: file.fieldname
        });

        // Check if the file is an image
        if (!file.mimetype.startsWith('image/')) {
            console.log("Invalid file type:", file.mimetype);
            return cb(new Error("Only image files are allowed"));
        }

        // Accept common image formats
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            console.log("Unsupported image type:", file.mimetype);
            cb(new Error(`Unsupported image type. Allowed types: ${allowedTypes.join(', ')}`));
        }
    }
});

const performOCR = async (req, res) => {
    try {
        console.log("OCR request received");
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);
        
        if (!req.file) {
            console.log("No file in request");
            return res.status(400).json({ error: "No image file provided" });
        }

        console.log("Processing image with OCR.space API...");
        console.log("File details:", {
            mimetype: req.file.mimetype,
            size: req.file.size,
            buffer: req.file.buffer ? "Buffer present" : "No buffer"
        });

        // Create form data for OCR.space API
        const formData = new FormData();
        formData.append('apikey', process.env.OCR_SPACE_API_KEY);
        formData.append('language', 'eng');
        formData.append('isOverlayRequired', 'false');
        formData.append('OCREngine', '2'); // Use OCR Engine 2 for better handwriting recognition
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });

        // Make request to OCR.space API
        const response = await axios.post('https://api.ocr.space/parse/image', formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        console.log("OCR.space API response:", response.data);

        if (response.data.IsErroredOnProcessing) {
            throw new Error(response.data.ErrorMessage || 'OCR processing failed');
        }

        if (!response.data.ParsedResults || response.data.ParsedResults.length === 0) {
            return res.status(400).json({
                error: "No text detected in image",
                details: "The image might be unclear or contain no readable text"
            });
        }

        // Extract text and confidence from the first result
        const result = response.data.ParsedResults[0];
        const text = result.ParsedText.trim();
        const confidence = result.TextOverlay ? result.TextOverlay.MeanConfidence : null;

        if (!text || text.length < 2) {
            return res.status(400).json({
                error: "No valid text detected in image",
                details: "The image might be unclear or contain no readable text"
            });
        }

        console.log("OCR Results:", text);
        console.log("Confidence:", confidence);

        res.json({
            text: text,
            confidence: confidence,
            language: 'eng',
            warning: confidence && confidence < 30 ? "Low confidence in text recognition" : undefined
        });

    } catch (error) {
        console.error("OCR processing error:", error);
        console.error("Error stack:", error.stack);
        
        // Send a more detailed error response
        res.status(500).json({
            error: "Failed to process image",
            details: error.message || "Unknown error occurred",
            type: error.name,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

module.exports = {
    upload,
    performOCR,
}; 