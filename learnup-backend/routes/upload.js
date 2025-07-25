const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configuration de stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Assure-toi que ce dossier existe
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Route POST pour l’upload
router.post("/", upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu." });

  // URL de l'image accessible publiquement (si tu sers /uploads en static)
  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ fileUrl });
});

module.exports = router;
