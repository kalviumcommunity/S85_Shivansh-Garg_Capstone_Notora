const express = require("express");
const router = express.Router();
const { upload, handleMulterError } = require("../middlewares/upload");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { adminMiddleware } = require("../middlewares/adminMiddleware");

const {
  getAllNotes,
  uploadNote,
  updateNote,
  getNoteById,
  deleteNote,
  getPendingNotes,
  reviewNote,
  getAllNotesAdmin
} = require("../controllers/noteController");

// Regular user routes
router.get("/", getAllNotes);
router.post("/", authMiddleware, upload, handleMulterError, uploadNote);
router.get("/:id", authMiddleware, getNoteById);
router.put("/:id", authMiddleware, upload, handleMulterError, updateNote);
router.delete("/:id", authMiddleware, deleteNote);

// Admin routes
router.get("/admin/all", authMiddleware, adminMiddleware, getAllNotesAdmin);
router.get("/admin/pending", authMiddleware, adminMiddleware, getPendingNotes);
router.post("/admin/review/:noteId", authMiddleware, adminMiddleware, reviewNote);

module.exports = router;