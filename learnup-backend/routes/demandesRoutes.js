const express = require("express");
const router = express.Router();
const Demande = require("../models/Demande");

// 🔽 Obtenir toutes les demandes d’un professeur
router.get("/prof/:profId", async (req, res) => {
  try {
    const demandes = await Demande.find({ professeur: req.params.profId }).sort({ createdAt: -1 });
    res.json(demandes);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 📩 Créer une nouvelle demande
router.post("/", async (req, res) => {
  try {
    const nouvelleDemande = new Demande(req.body);
    const saved = await nouvelleDemande.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de l’envoi de la demande" });
  }
});

// 🔄 Modifier le statut d’une demande
router.put("/:id", async (req, res) => {
  try {
    const maj = await Demande.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(maj);
  } catch (err) {
    res.status(500).json({ error: "Erreur de mise à jour" });
  }
});

// 🔍 Détail d'une demande
router.get("/:id", async (req, res) => {
  try {
    const demande = await Demande.findById(req.params.id);
    if (!demande) return res.status(404).json({ error: "Demande introuvable" });
    res.json(demande);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
