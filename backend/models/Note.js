const mongoose = require("mongoose");
const User = require("./User");

const noteSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    subject: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fileUrl: String,
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);