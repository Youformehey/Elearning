const express = require("express");
const router = express.Router();
const Seance = require("../models/Seance");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// GET toutes les séances d’un professeur
router.get("/professeur", protect, authorizeRoles("teacher"), async (req, res) => {
  try {
    const seances = await Seance.find({ professeur: req.user._id }) // clé 'professeur' ici
      .populate({
        path: "course",
        populate: { path: "matiere" },
      })
      .sort({ date: 1, heureDebut: 1 });
    res.json(seances);
  } catch (err) {
    console.error("Erreur récupération séances professeur :", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des séances" });
  }
});

// GET toutes les séances d’un étudiant (par classe)
router.get("/etudiant", protect, authorizeRoles("student"), async (req, res) => {
  try {
    const seances = await Seance.find({ classe: req.user.classe })
      .populate({
        path: "course",
        populate: { path: "matiere" },
      })
      .populate("professeur", "name email") // clé 'professeur' ici aussi
      .sort({ date: 1, heureDebut: 1 });
    res.json(seances);
  } catch (err) {
    console.error("Erreur récupération séances étudiant :", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des séances" });
  }
});

// POST création séance (professeur, admin)
router.post("/", protect, authorizeRoles("teacher", "prof", "admin"), async (req, res) => {
  try {
    const seance = new Seance(req.body);
    await seance.save();
    res.status(201).json(seance);
  } catch (err) {
    console.error("Erreur création séance :", err);
    res.status(500).json({ message: "Erreur serveur lors de la création de la séance" });
  }
});

// PUT mise à jour statut 'fait' d'une séance
router.put("/:id/mark", protect, authorizeRoles("teacher", "prof"), async (req, res) => {
  try {
    const { fait } = req.body;
    if (typeof fait !== "boolean") {
      return res.status(400).json({ message: "Le champ 'fait' doit être un booléen" });
    }
    const seance = await Seance.findById(req.params.id);
    if (!seance) return res.status(404).json({ message: "Séance introuvable" });

    seance.fait = fait;
    await seance.save();

    res.json({ message: "Statut de la séance mis à jour", seance });
  } catch (error) {
    console.error("Erreur mise à jour séance :", error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour de la séance" });
  }
});

// DELETE suppression séance
router.delete("/:id", protect, authorizeRoles("teacher", "prof"), async (req, res) => {
  try {
    const seance = await Seance.findById(req.params.id);
    if (!seance) return res.status(404).json({ message: "Séance introuvable" });

    await seance.deleteOne();
    res.json({ message: "Séance supprimée avec succès" });
  } catch (error) {
    console.error("Erreur suppression séance :", error);
    res.status(500).json({ message: "Erreur serveur lors de la suppression" });
  }
});

module.exports = router;
