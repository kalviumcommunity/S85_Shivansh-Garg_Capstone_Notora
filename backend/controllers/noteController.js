const Note = require("../models/Note");
const cloudinary = require("cloudinary").v2;
const User = require("../models/User");
const streamifier = require('streamifier');

// Define allowed subjects (same as in Note model)
const ALLOWED_SUBJECTS = [
  "Java",
  "C++",
  "Web Development",
  "Python",
  "Data Structures",
  "Algorithms"
];

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
    let filter = { status: 'approved' }; // Only show approved notes

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
    console.log("Upload request received:", {
      body: req.body,
      file: req.file,
      user: req.user
    });

    const { title, description, subject, isPremium } = req.body;
    const uploadedBy = req.user._id;

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

    // Validate subject against allowed subjects (case-insensitive)
    const normalizedSubject = subject.trim();
    const isValidSubject = ALLOWED_SUBJECTS.some(
      allowedSubject => allowedSubject.toLowerCase() === normalizedSubject.toLowerCase()
    );

    if (!isValidSubject) {
      return res.status(400).json({ 
        error: `Invalid subject. Allowed subjects are: ${ALLOWED_SUBJECTS.join(', ')}` 
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Get file extension from original filename
    const fileExtension = req.file.originalname.split('.').pop();
    
    // Clean the title for use in filename
    const cleanTitle = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace special chars and spaces with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    
    // Create a unique identifier (last 6 chars of timestamp)
    const uniqueId = Date.now().toString().slice(-6);
    
    // Combine title and unique ID for the filename
    const publicId = `${cleanTitle}-${uniqueId}`;

    // Upload to Cloudinary using stream
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "notora",
          resource_type: "raw",
          public_id: publicId,
          format: fileExtension, // Preserve original file format
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    const cloudinaryResult = await uploadPromise;
    console.log("File uploaded to Cloudinary:", cloudinaryResult);

    // Create new note
    const newNote = new Note({
      title: title.trim(),
      content: description.trim(),
      subject: normalizedSubject,
      uploadedBy,
      fileUrl: cloudinaryResult.secure_url,
      cloudinaryId: cloudinaryResult.public_id,
      isPremium: isPremium === 'true',
      status: 'pending'
    });

    // Save note to database
    const savedNote = await newNote.save();
    console.log("Note saved successfully:", savedNote);

    // Update user's notes array
    await User.findByIdAndUpdate(uploadedBy, {
      $push: { notes: savedNote._id }
    });
    console.log("User's notes array updated");

    res.status(201).json({ 
      message: "Note uploaded successfully", 
      note: savedNote 
    });

  } catch (err) {
    console.error("UPLOAD ERROR >>>", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });

    res.status(500).json({ 
      error: err.message || "Failed to upload note. Please try again.",
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
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

    const existingNote = await Note.findById(id);
    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    // If a new file is uploaded, delete the old one and update
    if (req.file) {
      if (existingNote.cloudinaryId) {
        await cloudinary.uploader.destroy(existingNote.cloudinaryId);
      }
      updateData.fileUrl = req.file.path;
      updateData.cloudinaryId = req.file.filename;
    }

    const updatedNote = await Note.findByIdAndUpdate(id, updateData, { new: true });

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

    // Delete note from database
    await Note.findByIdAndDelete(id);

    // Remove note from user's notes array
    await User.findByIdAndUpdate(note.uploadedBy, {
      $pull: { notes: id }
    });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR >>>", err);
    res.status(500).json({ error: err.message || "Failed to delete note" });
  }
};

const getPendingNotes = async (req, res) => {
  try {
    const notes = await Note.find({ status: 'pending' })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    console.error("GET PENDING NOTES ERROR >>>", err);
    res.status(500).json({ error: "Failed to fetch pending notes" });
  }
};

const reviewNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { status, feedback } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be 'approved' or 'rejected'" });
    }

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (status === 'rejected') {
      try {
        // Delete file from Cloudinary with detailed logging
        if (note.cloudinaryId) {
          console.log('Attempting to delete from Cloudinary:', note.cloudinaryId);
          const cloudinaryResult = await cloudinary.uploader.destroy(note.cloudinaryId, {
            resource_type: "raw",
            invalidate: true
          });
          console.log('Cloudinary deletion result:', cloudinaryResult);
          
          if (cloudinaryResult.result !== 'ok') {
            throw new Error(`Cloudinary deletion failed: ${cloudinaryResult.result}`);
          }
        } else {
          console.warn('No cloudinaryId found for note:', noteId);
        }

        // Remove note from user's notes array
        await User.findByIdAndUpdate(note.uploadedBy, {
          $pull: { notes: noteId }
        });

        // Delete note from database
        await Note.findByIdAndDelete(noteId);

        return res.status(200).json({ 
          message: "Note rejected and deleted successfully",
          feedback: feedback || "Note was rejected and removed from the system."
        });
      } catch (cloudinaryError) {
        console.error('Error during note rejection:', cloudinaryError);
        // Even if Cloudinary deletion fails, we should still remove from MongoDB
        await User.findByIdAndUpdate(note.uploadedBy, {
          $pull: { notes: noteId }
        });
        await Note.findByIdAndDelete(noteId);
        
        return res.status(200).json({ 
          message: "Note rejected and removed from database. Cloudinary cleanup may need manual intervention.",
          feedback: feedback || "Note was rejected and removed from the system.",
          cloudinaryError: cloudinaryError.message
        });
      }
    }

    // If approved, update the note
    note.status = status;
    if (feedback) {
      note.feedback = feedback;
    }
    note.reviewedAt = new Date();
    note.reviewedBy = req.user._id;

    await note.save();

    res.status(200).json({ message: `Note ${status} successfully`, note });
  } catch (err) {
    console.error("REVIEW NOTE ERROR >>>", err);
    res.status(500).json({ error: "Failed to review note" });
  }
};

const getAllNotesAdmin = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    console.error("GET ALL NOTES ADMIN ERROR >>>", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

module.exports = {
  getNoteById,
  getAllNotes,
  uploadNote,
  updateNote,
  deleteNote,
  getPendingNotes,
  reviewNote,
  getAllNotesAdmin
};