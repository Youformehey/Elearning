const express = require("express");
const router = express.Router();

const {
  getChapitresByTeacher,
  createChapitre,
  updateChapitre,
  addCourseToChapitre,
  deleteChapitre,
} = require("../controllers/chapitreController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Récupérer chapitres du prof connecté (GET)
router.get("/", protect, authorizeRoles("teacher", "prof"), getChapitresByTeacher);

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
