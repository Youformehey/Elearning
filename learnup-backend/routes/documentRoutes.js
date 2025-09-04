const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  uploadDocument,
  getDocumentsByCourse,
  getDocumentsByTeacher,
  uploadVideoUrl,
  deleteDocument,
} = require("../controllers/documentController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Configuration Multer (stockage local)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, uniqueName);
  },
});

// Filtrage fichiers autorisés
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ".pdf", ".doc", ".docx", ".ppt", ".pptx",
    ".jpg", ".jpeg", ".png",
    ".mp4", ".avi", ".webm",
    ".zip", ".rar"
  ];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) cb(null, true);
  else cb(new Error("Type de fichier non autorisé"), false);
};

// Init Multer avec limite 10 Mo
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Middleware upload avec gestion erreur
const uploadFile = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

// Routes

// Upload d’un document (professeur uniquement)
router.post("/", protect, authorizeRoles("teacher"), uploadFile, uploadDocument);

// Ajouter une URL vidéo (professeur uniquement)
router.post("/url", protect, authorizeRoles("teacher"), uploadVideoUrl);

// Récupérer les documents d’un cours
router.get("/course/:id", protect, getDocumentsByCourse);

// Récupérer tous les documents du professeur connecté
router.get("/me", protect, authorizeRoles("teacher"), getDocumentsByTeacher);

// Supprimer un document
router.delete("/:id", protect, authorizeRoles("teacher"), deleteDocument);

module.exports = router;
