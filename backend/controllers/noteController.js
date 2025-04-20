const Note = require("../models/Note");
const cloudinary = require("cloudinary").v2;

const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findById(id).populate("uploadedBy", "name email");

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json(note);
  } catch (err) {
    console.error("GET NOTE ERROR >>>", err);
    res.status(500).json({ error: err.message || "Failed to fetch note" });
  }
};


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

    if (!description || typeof description !== 'string' || description.trim().length < 5) {
      return res.status(400).json({ error: "Description is required and should be at least 5 characters long." });
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
      cloudinaryId: req.file.filename,
    });

    await newNote.save();

    res.status(201).json({ message: "Note uploaded successfully", note: newNote });

  } catch (err) {
    console.error("UPLOAD ERROR >>>", err);
    res.status(500).json({ error: err.message || "Failed to upload note" });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, subject } = req.body;

    const updateData = {};

    if (title && typeof title === 'string' && title.trim().length >= 3) {
      updateData.title = title.trim();
    }

    if (description && typeof description === 'string' && description.trim().length >= 5) {
      updateData.description = description.trim();
    }

    if (subject && typeof subject === 'string') {
      updateData.subject = subject.trim().toLowerCase();
    }

    // If a new file is uploaded, update the fileUrl too
    if (req.file) {
      updateData.fileUrl = req.file.path;
    }

    const updatedNote = await Note.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({ message: "Note updated successfully", note: updatedNote });

  } catch (err) {
    console.error("UPDATE ERROR >>>", err);
    res.status(500).json({ error: err.message || "Failed to update note" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Delete file from Cloudinary
    if (note.cloudinaryId) {
      await cloudinary.uploader.destroy(note.cloudinaryId);
    }

    // Delete note from DB
    await note.deleteOne();

    res.status(200).json({ message: "Note deleted successfully", note });
  } catch (err) {
    console.error("DELETE ERROR >>>", err);
    res.status(500).json({ error: err.message || "Failed to delete note" });
  }
};


module.exports = { getNoteById, getAllNotes, uploadNote, updateNote, deleteNote };