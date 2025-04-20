const mongoose = require("mongoose");
const User = require("./User");

const noteSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    subject: String,
    fileUrl: String,
    cloudinaryId: {type: String, required: true},
    isPremium: {
      type: Boolean,
      default: false,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User
      required: true,
    },
    notes: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Note" 
    }]

  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
