const express = require('express');
const router = express.Router();

// Health check endpoint

router.get('/', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router; 
