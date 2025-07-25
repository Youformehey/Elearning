const mongoose = require("mongoose");
const Document = require("../models/Document");
const User = require("../models/User");

// ✅ POST - Ajouter un document (upload fichier)
exports.uploadDocument = async (req, res) => {
  const { course, message } = req.body;

  if (!req.file || !course) {
    return res.status(400).json({ error: "Fichier ou courseId manquant." });
  }

  try {
    const newDoc = await Document.create({
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`, // chemin local ou URL cloud
      course: course,
      message: message || "",
      teacher: req.user._id,
    });

    res.status(201).json(newDoc);
  } catch (error) {
    console.error("Erreur uploadDocument:", error);
    res.status(500).json({ error: "Erreur serveur lors de l'envoi du document." });
  }
};

// ✅ POST - Ajouter une URL vidéo externe (YouTube...)
exports.uploadVideoUrl = async (req, res) => {
  const { courseId, fileUrl, fileName, message } = req.body;

  if (!courseId || !fileUrl) {
    return res.status(400).json({ message: "courseId et fileUrl sont requis." });
  }

  try {
    const newDoc = await Document.create({
      course: courseId,
      fileUrl,
      fileName: fileName || "Vidéo externe",
      message: message || "",
      teacher: req.user._id,
    });

    res.status(201).json(newDoc);
  } catch (error) {
    console.error("Erreur uploadVideoUrl:", error);
    res.status(500).json({ message: "Erreur serveur lors de l'ajout de l'URL vidéo." });
  }
};

// ✅ GET - Récupérer tous les documents d'un cours
exports.getDocumentsByCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const docs = await Document.find({ course: new mongoose.Types.ObjectId(id) })
      .sort({ createdAt: -1 })
      .populate("course", "classe semestre horaire")
      .populate("teacher", "name email");

    res.status(200).json(docs);
  } catch (error) {
    console.error("Erreur getDocumentsByCourse:", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération." });
  }
};

// ✅ GET - Récupérer tous les documents du prof connecté
exports.getDocumentsByTeacher = async (req, res) => {
  try {
    const docs = await Document.find({ teacher: req.user._id })
      .sort({ createdAt: -1 })
      .populate("course", "classe semestre horaire")
      .populate("teacher", "name email");

    res.status(200).json(docs);
  } catch (error) {
    console.error("Erreur getDocumentsByTeacher:", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};
