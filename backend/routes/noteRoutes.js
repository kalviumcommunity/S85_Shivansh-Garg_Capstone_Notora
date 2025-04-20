const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../utils/cloudinary");
const upload = multer({ storage });

const { getAllNotes, uploadNote, updateNote, getNoteById, deleteNote } = require("../controllers/noteController");


router.get("/notes/:id", getNoteById);

router.get("/notes", getAllNotes);

router.post("/notes/upload", upload.single("file"), uploadNote);

router.put("/notes/update/:id", upload.single("file"), updateNote);

router.delete("/notes/delete/:id", deleteNote);


module.exports = router;