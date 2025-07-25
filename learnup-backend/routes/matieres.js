// routes/matieres.js
const express = require("express");
const router = express.Router();
const Matiere = require("../models/Matiere");

// ✅ Juste "/"
router.get("/", async (req, res) => {
  try {
    const matieres = await Matiere.find();
    res.json(matieres);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
