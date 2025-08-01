const Seance = require("../models/Seance");
const Teacher = require("../models/Teacher");
const Course = require("../models/Course");

// Fonction utilitaire pour calculer heureFin à partir de l'heure de début et de la durée
function calculerHeureFin(heureDebut, duree) {
  if (!heureDebut || !duree) return null;

  let hd = heureDebut.replace("h", "");

  const [h, m = 0] = hd.includes(":")
    ? hd.split(":").map(Number)
    : [parseInt(hd), 0];

  if (isNaN(h) || isNaN(m)) return null;

  const date = new Date();
  date.setHours(h);
  date.setMinutes(m + parseInt(duree));

  const heures = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${heures}h${minutes}`;
}

// GET /api/seances/etudiant - Séances par classe de l'étudiant
const getSeancesByStudent = async (req, res) => {
  try {
    const classe = req.user.classe?.trim();
    if (!classe) return res.status(400).json({ message: "Classe de l'étudiant manquante" });

    const seances = await Seance.find({ classe })
      .populate({
        path: "course",
        populate: { path: "matiere" },
      })
      .populate("professeur", "name email")
      .sort({ date: 1, heureDebut: 1 });

    const formatted = seances.map((s) => ({
      _id: s._id,
      date: s.date,
      classe: s.classe || s.course?.classe || "--",
      heureDebut: s.heureDebut || "Inconnue",
      heureFin: s.heureFin || calculerHeureFin(s.heureDebut, s.course?.duree) || "Inconnue",
      matiere: s.course?.matiere?.nom || s.course?.nom || "Inconnue",
      groupe: s.groupe || "Inconnu",
      salle: s.salle || "Inconnue",
      professeur: {
        name: s.professeur?.name || "Inconnu",
        email: s.professeur?.email || "Inconnu",
      },
      fait: s.fait || false,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Erreur getSeancesByStudent :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des séances" });
  }
};

// GET /api/seances/etudiant/all - TOUTES les séances pour les étudiants
const getAllSeancesForStudents = async (req, res) => {
  try {
    const seances = await Seance.find({})
      .populate({
        path: "course",
        populate: { path: "matiere" },
      })
      .populate("professeur", "name email")
      .sort({ date: 1, heureDebut: 1 });

    const formatted = seances.map((s) => ({
      _id: s._id,
      date: s.date,
      classe: s.classe || s.course?.classe || "--",
      heureDebut: s.heureDebut || "Inconnue",
      heureFin: s.heureFin || calculerHeureFin(s.heureDebut, s.course?.duree) || "Inconnue",
      matiere: s.course?.matiere?.nom || s.course?.nom || "Inconnue",
      groupe: s.groupe || "Inconnu",
      salle: s.salle || "Inconnue",
      professeur: {
        name: s.professeur?.name || "Inconnu",
        email: s.professeur?.email || "Inconnu",
      },
      fait: s.fait || false,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Erreur getAllSeancesForStudents :", err);
    res.status(500).json({ message: "Erreur lors de la récupération de toutes les séances" });
  }
};

// GET /api/seances/professeur
const getSeancesByEmail = async (req, res) => {
  try {
    const email = req.user.email;
    const prof = await Teacher.findOne({ email });
    if (!prof) return res.status(404).json({ message: "Professeur introuvable" });

    const seances = await Seance.find({ professeur: prof._id })
      .populate({
        path: "course",
        populate: { path: "matiere" },
      })
      .sort({ date: 1, heureDebut: 1 });

    const formatted = seances.map((s) => ({
      _id: s._id,
      date: s.date,
      classe: s.classe || s.course?.classe || "--",
      heureDebut: s.heureDebut || "Inconnue",
      heureFin: s.heureFin || calculerHeureFin(s.heureDebut, s.course?.duree) || "Inconnue",
      matiere: s.course?.matiere?.nom || "Inconnue",
      groupe: s.groupe || "Inconnu",
      salle: s.salle || "Inconnue",
      professeur: {
        name: prof.name,
        email: prof.email,
      },
      fait: s.fait || false,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Erreur getSeancesByEmail :", err);
    res.status(500).json({ message: "Erreur récupération des séances" });
  }
};

// POST /api/seances
const createSeance = async (req, res) => {
  try {
    const { date, heureDebut, classe, groupe, salle, course, professeur } = req.body;

    const courseData = await Course.findById(course);
    if (!courseData) return res.status(404).json({ message: "Cours introuvable" });

    const duree = courseData.duree || 120;
    const heureFinCalculee = calculerHeureFin(heureDebut, duree);

    const newSeance = new Seance({
      date,
      heureDebut,
      heureFin: heureFinCalculee,
      classe,
      groupe,
      salle,
      course,
      professeur,
    });

    await newSeance.save();
    res.status(201).json({ message: "Séance créée avec succès", seance: newSeance });
  } catch (err) {
    console.error("❌ Erreur création séance :", err);
    res.status(500).json({ message: "Erreur lors de la création de la séance" });
  }
};

// PUT /api/seances/:id/mark - Marquer une séance comme faite
const marquerSeanceFaite = async (req, res) => {
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
    console.error("❌ Erreur marquerSeanceFaite :", error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour de la séance" });
  }
};

// DELETE /api/seances/:id - Supprimer une séance
const deleteSeance = async (req, res) => {
  try {
    const seance = await Seance.findById(req.params.id);
    if (!seance) return res.status(404).json({ message: "Séance introuvable" });

    await seance.deleteOne();
    res.json({ message: "Séance supprimée avec succès" });
  } catch (error) {
    console.error("❌ Erreur deleteSeance :", error);
    res.status(500).json({ message: "Erreur serveur lors de la suppression" });
  }
};

module.exports = {
  getSeancesByStudent,
  getAllSeancesForStudents,
  getSeancesByEmail,
  createSeance,
  marquerSeanceFaite,
  deleteSeance,
};
