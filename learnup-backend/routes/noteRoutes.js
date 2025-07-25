const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// ➕ Ajouter ou modifier une note
router.post("/add", async (req, res) => {
  const { etudiant, cours, devoir, note, enseignant } = req.body;

  try {
    // Mettre à jour si existe déjà pour cet étudiant / devoir / cours
    const existing = await Note.findOne({ etudiant, cours, devoir });
    if (existing) {
      existing.note = note;
      await existing.save();
      return res.json({ message: "Note mise à jour", note: existing });
    }

    const newNote = new Note({ etudiant, cours, devoir, note, enseignant });
    await newNote.save();
    res.status(201).json({ message: "Note ajoutée", note: newNote });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📦 Obtenir les notes par cours
router.get("/cours/:id", async (req, res) => {
  try {
    const notes = await Note.find({ cours: req.params.id })
      .populate("etudiant", "name")
      .populate("enseignant", "name");
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
