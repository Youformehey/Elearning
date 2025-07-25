const Note = require("../models/Note");
const Course = require("../models/Course");

// 🔹 Ajouter ou mettre à jour une note
exports.ajouterOuModifierNote = async (req, res) => {
  const { etudiant, cours, devoir, note, enseignant } = req.body;

  if (!etudiant || !cours || !devoir || note == null || !enseignant) {
    return res.status(400).json({ error: "Champs requis manquants" });
  }

  try {
    const course = await Course.findById(cours);
    if (!course) return res.status(404).json({ error: "Cours introuvable" });

    // 🔐 Sécurité : seul le prof du cours peut modifier les notes
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Non autorisé à modifier ce cours" });
    }

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
};

// 🔹 Obtenir les notes d’un cours (prof uniquement)
exports.getNotesParCours = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Cours introuvable" });

    // 🔐 Sécurité : seul le prof du cours peut voir les notes
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Non autorisé à voir ces notes" });
    }

    const notes = await Note.find({ cours: req.params.id })
      .populate("etudiant", "name")
      .populate("enseignant", "name");

    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur : " + err.message });
  }
};
