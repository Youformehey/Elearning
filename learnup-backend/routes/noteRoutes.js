const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// ✅ Ajouter ou mettre à jour une note
router.post("/", protect, authorizeRoles("teacher"), async (req, res) => {
  const { etudiant, cours, devoir, note, enseignant } = req.body;

  if (!etudiant || !cours || !devoir || note == null || !enseignant) {
    return res.status(400).json({ error: "Champs requis manquants" });
  }

  try {
    const existante = await Note.findOne({ etudiant, cours, devoir });

    if (existante) {
      existante.note = note;
      await existante.save();
      return res.status(200).json({ message: "✅ Note mise à jour", note: existante });
    }

    const nouvelleNote = new Note({ etudiant, cours, devoir, note, enseignant });
    await nouvelleNote.save();
    res.status(201).json({ message: "✅ Note ajoutée", note: nouvelleNote });
  } catch (err) {
    console.error("💥 Erreur serveur :", err.message);
    res.status(500).json({ error: "Erreur serveur : " + err.message });
  }
});

// ✅ Récupérer les notes d'un étudiant spécifique
router.get("/student/:studentId", protect, authorizeRoles("teacher", "admin", "parent"), async (req, res) => {
  try {
    const notes = await Note.find({ etudiant: req.params.studentId })
      .populate("cours", "nom")
      .populate("enseignant", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (err) {
    console.error("Erreur récupération notes étudiant:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 📦 Obtenir les notes par cours
router.get("/cours/:id", protect, authorizeRoles("teacher", "prof"), async (req, res) => {
  try {
    const notes = await Note.find({ cours: req.params.id })
      .populate("etudiant", "name email")
      .populate("enseignant", "name");

    res.status(200).json(notes);
  } catch (err) {
    console.error("Erreur récupération notes par cours:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ Obtenir toutes les notes (admin/prof)
router.get("/", protect, authorizeRoles("teacher", "admin"), async (req, res) => {
  try {
    const notes = await Note.find()
      .populate("etudiant", "name email")
      .populate("cours", "titre")
      .populate("enseignant", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (err) {
    console.error("Erreur récupération toutes les notes:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ Supprimer une note
router.delete("/:id", protect, authorizeRoles("teacher", "admin"), async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note non trouvée" });
    }
    res.status(200).json({ message: "Note supprimée avec succès" });
  } catch (err) {
    console.error("Erreur suppression note:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
