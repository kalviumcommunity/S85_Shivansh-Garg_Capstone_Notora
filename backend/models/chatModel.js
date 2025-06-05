const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true,
    enum: ["general", "doubt", "kalvium", "reviews"],
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => {
      // If room is 'reviews', set expiration to a far future date (effectively permanent)
      if (this.room === 'reviews') {
        return new Date('2100-01-01');
      }
      // For other rooms, set expiration to 7 days from now
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    }
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
messageSchema.index({ room: 1, timestamp: -1 });
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message; 