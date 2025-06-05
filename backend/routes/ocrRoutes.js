const express = require('express');
const router = express.Router();
const { performOCR, upload } = require('../controllers/ocrController');

// Route for OCR processing
router.post('/process', upload.single('image'), performOCR);

module.exports = router; 