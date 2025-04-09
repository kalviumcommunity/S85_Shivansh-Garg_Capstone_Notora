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
    const { title, description, subject, uploadedBy } = req.body;

    // Basic validations
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return res.status(400).json({ error: "Title is required and should be at least 3 characters long." });
    }

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return res.status(400).json({ error: "Description is required and should be at least 10 characters long." });
    }

    if (!subject || typeof subject !== 'string') {
      return res.status(400).json({ error: "Subject is required and must be a string." });
    }

    if (!uploadedBy || typeof uploadedBy !== 'string') {
      return res.status(400).json({ error: "uploadedBy (user ID) is required and must be a string." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const newNote = new Note({
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim().toLowerCase(),
      uploadedBy,
      fileUrl: req.file.path,
    });

    await newNote.save();

    res.status(201).json({ message: "Note uploaded successfully", note: newNote });

  } catch (err) {
    console.error("UPLOAD ERROR >>>", err);
    res.status(500).json({ error: err.message || "Failed to upload note" });
  }
};



module.exports = { getAllNotes, uploadNote };