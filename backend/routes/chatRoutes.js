const express = require('express');
const Message = require('../models/chatModel');
const router = express.Router();

// GET /api/chat/:room/messages - get last 5 days of messages for a room
router.get('/:room/messages', async (req, res) => {
  const { room } = req.params;
  const since = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
  try {
    const messages = await Message.find({
      room,
      createdAt: { $gte: since }
    }).sort({ createdAt: 1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router; 