const mongoose = require("mongoose");
const Rappel = require("../models/Rappel");
const RappelEtudiant = require("../models/RappelEtudiant");
const Student = require("../models/Student");

// 📌 Obtenir tous les rappels du professeur connecté
const getRappels = async (req, res) => {
  try {
    const rappels = await Rappel.find({ professeur: req.user.id });
    res.status(200).json(rappels);
  } catch (error) {
    console.error("Erreur getRappels:", error.message);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des rappels." });
  }
};

// ➕ Créer un nouveau rappel
const createRappel = async (req, res) => {
  const { texte, date, type, classe } = req.body;

  if (!texte || !date || !classe) {
    return res.status(400).json({ message: "Le texte, la date et la classe sont requis." });
  }

  try {
    const nouveau = await Rappel.create({
      texte,
      date,
      type,
      professeur: req.user.id,
      classe,
    });

    const etudiants = await Student.find({ classe });

    const suivis = etudiants.map((etudiant) => ({
      rappel: nouveau._id,
      etudiant: etudiant._id,
      fait: false,
    }));

    await RappelEtudiant.insertMany(suivis);

    res.status(201).json(nouveau);
  } catch (error) {
    console.error("❌ Erreur createRappel:", error.message);
    res.status(500).json({ message: "Erreur serveur lors de la création du rappel." });
  }
};

// ❌ Supprimer un rappel
const deleteRappel = async (req, res) => {
  try {
    const rappel = await Rappel.findById(req.params.id);

    if (!rappel) {
      return res.status(404).json({ message: "Rappel non trouvé." });
    }

    if (rappel.professeur.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé à supprimer ce rappel." });
    }

    await rappel.deleteOne();
    res.status(200).json({ message: "Rappel supprimé avec succès." });
  } catch (error) {
    console.error("Erreur deleteRappel:", error.message);
    res.status(500).json({ message: "Erreur serveur lors de la suppression du rappel." });
  }
};

// 📚 Rappels par classe (côté étudiant)
const getRappelsByClasse = async (req, res) => {
  try {
    const { classe } = req.params;
    const rappels = await Rappel.find({ classe }).sort({ date: -1 });
    res.json(rappels);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✏️ Modifier un rappel
const updateRappel = async (req, res) => {
  try {
    const rappel = await Rappel.findById(req.params.id);

    if (!rappel) {
      return res.status(404).json({ message: "Rappel non trouvé." });
    }

    if (rappel.professeur.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé à modifier ce rappel." });
    }

    const { texte, date, type, classe } = req.body;

    rappel.texte = texte || rappel.texte;
    rappel.date = date || rappel.date;
    rappel.type = type || rappel.type;
    rappel.classe = classe || rappel.classe;

    const updatedRappel = await rappel.save();
    res.status(200).json(updatedRappel);
  } catch (error) {
    console.error("Erreur updateRappel:", error.message);
    res.status(500).json({ message: "Erreur serveur lors de la modification du rappel." });
  }
};

const getEtudiantsAyantFaitRappel = async (req, res) => {
  try {
    const rappelId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(rappelId)) {
      return res.status(400).json({ message: "ID de rappel invalide." });
    }

    const faits = await RappelEtudiant.find({ rappel: rappelId, fait: true }).populate("etudiant");

    const etudiants = faits
      .filter(f => f.etudiant)
      .map(f => ({
        _id: f.etudiant._id,
        name: f.etudiant.name,
        email: f.etudiant.email,
        classe: f.etudiant.classe,
      }));

    res.status(200).json(etudiants);
  } catch (error) {
    console.error("Erreur getEtudiantsAyantFaitRappel:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des étudiants." });
  }
};

module.exports = {
  getRappels,
  createRappel,
  deleteRappel,
  getRappelsByClasse,
  updateRappel,
  getEtudiantsAyantFaitRappel, // ✅ EXPORT ICI
};
