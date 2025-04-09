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
const uploadNote = async (req, res) => {
  try {
    console.log("Request received:", req.body);
    console.log("Uploaded file info:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { title, description, subject, uploadedBy } = req.body;

    const newNote = new Note({
      title,
      description,
      subject: subject.toLowerCase(),
      uploadedBy,
      fileUrl: req.file.path, // This must be a valid Cloudinary response
    });

    await newNote.save();
    res.status(201).json({ message: "Note uploaded successfully", note: newNote });
  } catch (err) {
    console.error("UPLOAD ERROR >>>", err);
    res.status(500).json({ error: err.message || "Failed to upload note" });
  }
};


module.exports = { getAllNotes, uploadNote };