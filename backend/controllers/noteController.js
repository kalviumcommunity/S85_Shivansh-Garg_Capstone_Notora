const Note = require("../models/Note");

const getAllNotes = async (req, res) => {
  try {
    const { subject } = req.query;
    let filter = {};

    if (subject) {
      filter.subject = subject.toLowerCase();
    }

    const notes = await Note.find(filter).populate("uploadedBy", "name email");
    res.status(200).json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

module.exports = { getAllNotes };