const express = require("express");
const router = express.Router();

const {
  getChapitresByTeacher,
  getChapitreById,
  createChapitre,
  updateChapitre,
  addCourseToChapitre,
  deleteChapitre,
} = require("../controllers/chapitreController");

const Chapitre = require("../models/Chapitre");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Récupérer chapitres du prof connecté (GET)
router.get("/", protect, authorizeRoles("teacher", "prof"), getChapitresByTeacher);

// Récupérer un chapitre par ID (GET)
router.get("/:chapitreId", protect, getChapitreById);

// Route spéciale pour les étudiants (sans vérification d'inscription)
router.get("/student/:chapitreId", protect, authorizeRoles("student", "etudiant"), async (req, res) => {
  try {
    const { chapitreId } = req.params;
    const chapitre = await Chapitre.findById(chapitreId).populate({
      path: "course",
      populate: ["matiere", "teacher"]
    });

    if (!chapitre) {
      return res.status(404).json({ message: "Chapitre introuvable" });
    }

    res.json(chapitre);
  } catch (err) {
    console.error("❌ Erreur route étudiant:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// (optionnel) aussi garder la route /teacher
router.get("/teacher", protect, authorizeRoles("teacher", "prof"), getChapitresByTeacher);

// Créer un nouveau chapitre (POST)
router.post("/", protect, authorizeRoles("teacher", "prof", "admin"), createChapitre);

// Modifier un chapitre (PUT)
router.put("/:chapitreId", protect, authorizeRoles("teacher", "prof", "admin"), updateChapitre);

// Ajouter un cours à un chapitre existant (PUT)
router.put("/:chapitreId/add-course/:courseId", protect, authorizeRoles("teacher", "prof", "admin"), addCourseToChapitre);

// Supprimer un chapitre (DELETE)
router.delete("/:chapitreId", protect, authorizeRoles("teacher", "prof", "admin"), deleteChapitre);

module.exports = router;
