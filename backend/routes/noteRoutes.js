const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../utils/cloudinary");
const upload = multer({ storage });

const { getAllNotes, uploadNote } = require("../controllers/noteController");

router.get("/notes", getAllNotes);

router.post("/notes/upload", (req, res, next) => {
    upload.single("file")(req, res, function (err) {
      if (err) {
        console.error("Multer Error:", err);
        return res.status(400).json({ error: err.message });
      }
      uploadNote(req, res);
    });
  });
  

module.exports = router;