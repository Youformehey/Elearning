const Note = require("../models/Note");
const Course = require("../models/Course");
const Student = require("../models/Student");

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

// 🔹 Obtenir les notes d'un cours (prof uniquement)
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

// 🔹 Obtenir les notes de l'étudiant connecté (filtrées par classe)
exports.getNotesForStudent = async (req, res) => {
  try {
    const etudiantId = req.user._id;
    
    // Récupérer l'étudiant pour connaître sa classe
    const student = await Student.findById(etudiantId);
    if (!student) {
      return res.status(404).json({ error: "Étudiant non trouvé" });
    }

    // Récupérer tous les cours de la classe de l'étudiant
    const coursesDeLaClasse = await Course.find({ classe: student.classe });
    const courseIds = coursesDeLaClasse.map(course => course._id);

    // Récupérer les notes de l'étudiant uniquement pour les cours de sa classe
    const notes = await Note.find({ 
      etudiant: etudiantId,
      cours: { $in: courseIds }
    })
      .populate({
        path: "cours",
        select: "matiere classe",
        populate: {
          path: "matiere",
          select: "nom"
        }
      })
      .populate("enseignant", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (err) {
    console.error("Erreur récupération notes étudiant:", err);
    res.status(500).json({ error: "Erreur serveur : " + err.message });
  }
};
