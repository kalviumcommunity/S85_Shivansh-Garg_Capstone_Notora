const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  password: { 
    type: String, 
    required: true 
  },

  isPremium: { 
    type: Boolean, 
    default: false 
  },

  notes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Note" 
  }],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
