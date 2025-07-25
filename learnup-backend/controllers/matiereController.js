// controllers/matiereController.js

const Matiere = require("../models/Matiere");

// GET /api/matieres → Liste des matières
const getAllMatieres = async (req, res) => {
  try {
    const matieres = await Matiere.find().sort({ nom: 1 });
    res.status(200).json(matieres);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// POST /api/matieres → Ajouter une matière
const createMatiere = async (req, res) => {
  const { nom, code } = req.body;

  if (!nom || !code) {
    return res.status(400).json({ message: "Champs requis manquants." });
  }

  try {
    const alreadyExists = await Matiere.findOne({ code });
    if (alreadyExists) {
      return res.status(400).json({ message: "Code déjà utilisé." });
    }

    const matiere = new Matiere({ nom, code });
    await matiere.save();
    res.status(201).json(matiere);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout" });
  }
};

module.exports = {
  getAllMatieres,
  createMatiere,
};
