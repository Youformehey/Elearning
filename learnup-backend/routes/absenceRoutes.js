// routes/absenceRoutes.js

const express = require("express");
const router = express.Router();

const {
  enregistrerAbsences,
  marquerAbsence,
  getAbsencesParCours,
  getAbsencesByCourseId,
  getAbsencesEtudiantParMatiere,
} = require("../controllers/absenceController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const Absence = require("../models/Absence");

// ✅ POST /api/absences → enregistrement groupé (par un prof)
router.post(
  "/",
  protect,
  authorizeRoles("teacher"),
  enregistrerAbsences
);

// ✅ POST /api/absences/marquer → marquer ou retirer une absence
router.post(
  "/marquer",
  protect,
  authorizeRoles("teacher"),
  marquerAbsence
);

// ✅ GET /api/absences/cours/:coursId → toutes les absences d’un cours
router.get(
  "/cours/:coursId",
  protect,
  authorizeRoles("teacher", "admin"),
  getAbsencesParCours
);

// ✅ GET /api/absences/student/:id → historique d'absences d'un étudiant
//    (vue admin/prof/étudiant/parent)
router.get(
  "/student/:id",
  protect,
  authorizeRoles("teacher", "admin", "student", "parent"),
  async (req, res) => {
    try {
      const absences = await Absence.find({ student: req.params.id })
        .populate({
          path: "course",
          select: "nom matiere classe semestre",
          populate: {
            path: "matiere",
            select: "nom"
          }
        })
        .sort({ date: -1 });

      res.status(200).json(absences);
    } catch (err) {
      console.error(
        "❌ Erreur récupération absences étudiant :",
        err.message
      );
      res
        .status(500)
        .json({ message: "Erreur récupération absences étudiant" });
    }
  }
);

// ✅ GET /api/absences/etudiant → regroupe les absences
//    par matière pour l’étudiant connecté
router.get(
  "/etudiant",
  protect,
  authorizeRoles("student"),
  getAbsencesEtudiantParMatiere
);


// ✅ STATS : par matière / classe / prof
router.get(
  "/matiere/:matiere/:classe/:profId",
  protect,
  authorizeRoles("teacher", "admin"),
  async (req, res) => {
    const { matiere, classe, profId } = req.params;

    try {
      const absences = await Absence.find()
        .populate("student", "name email")
        .populate("course", "matiere classe teacher");

      // 👉 ICI tu remplaces le bloc du filter
      const filtered = absences.filter((abs) => {
        const course = abs.course;
        return (
          course?.matiere?.toString?.() === matiere &&
          course?.classe === classe &&
          course?.teacher?.toString?.() === profId
        );
      });

      const stats = {};
      filtered.forEach((abs) => {
        const id = abs.student?._id?.toString();
        if (!id) return;
        if (!stats[id]) {
          stats[id] = {
            name: abs.student.name,
            totalHours: 0,
          };
        }
        stats[id].totalHours += 2;
      });

      res.json({ absences: Object.values(stats) });
    } catch (err) {
      console.error("❌ erreur stats absences :", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);



// ✅ STATS : par courseId (utilisé dans MesCours.jsx)
router.get(
  "/stats/:courseId",
  protect,
  authorizeRoles("teacher"),
  getAbsencesByCourseId
);

// ✅ DELETE /api/absences/:id → supprimer une absence spécifique
router.delete(
  "/:id",
  protect,
  authorizeRoles("teacher", "admin"),
  async (req, res) => {
    try {
      const absence = await Absence.findById(req.params.id);
      
      if (!absence) {
        return res.status(404).json({ message: "Absence non trouvée" });
      }
      
      await absence.deleteOne();
      
      res.status(200).json({ message: "Absence supprimée avec succès" });
    } catch (err) {
      console.error("❌ Erreur suppression absence:", err.message);
      res.status(500).json({ message: "Erreur lors de la suppression de l'absence" });
    }
  }
);

module.exports = router;
