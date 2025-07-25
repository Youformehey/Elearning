const express = require("express");
const router = express.Router();

const {
  registerStudent,
  loginStudent,
  getStudentProfile,
  getStudentCourses,
  getStudentRappels,
  getStudentPlanning,
  markRappelFait,
  getChapitresWithCourses,
} = require("../controllers/studentController");

const {
  getAbsencesEtudiantParMatiere,
} = require("../controllers/absenceController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Routes publiques (inscription, login)
router.post("/register", registerStudent);
router.post("/login", loginStudent);

// Middleware : protection et vérification rôle étudiant
router.use(protect, authorizeRoles("student"));

// Profil de l’étudiant connecté
router.get("/me", getStudentProfile);

// Exemple dashboard simple
router.get("/dashboard", (req, res) => {
  res.json({ message: `Bienvenue étudiant ${req.user.name} !` });
});

// Liste des cours de la classe de l’étudiant
router.get("/cours", getStudentCourses);

// Liste des rappels (devoirs, tâches, etc.) de la classe
router.get("/rappels", getStudentRappels);

// Marquer un rappel comme fait (étudiant)
router.put("/rappels/:id/mark", markRappelFait);

// Planning complet (cours + séances) de l’étudiant
router.get("/planning", getStudentPlanning);

// Absences par matière (heures + dépassement)
router.get("/absences/matieres", getAbsencesEtudiantParMatiere);

// Chapitres et cours liés pour l’étudiant
router.get("/chapitres-cours", getChapitresWithCourses);

module.exports = router;
