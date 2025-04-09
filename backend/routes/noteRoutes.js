const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../utils/cloudinary");
const upload = multer({ storage });

const { getAllNotes, uploadNote } = require("../controllers/noteController");

router.get("/notes", getAllNotes);
// router.post("/notes/upload", upload.single("file"), uploadNote);


module.exports = router;