const express = require("express");
const router = express.Router();
const Seance = require("../models/Seance");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { 
  getSeancesByStudent, 
  getAllSeancesForStudents,
  getSeancesByEmail, 
  createSeance,
  marquerSeanceFaite,
  deleteSeance
} = require("../controllers/seanceController");

// GET toutes les séances d'un professeur
router.get("/professeur", protect, authorizeRoles("teacher", "admin"), getSeancesByEmail);

// GET toutes les séances d'un étudiant (par classe)
router.get("/etudiant", protect, authorizeRoles("student", "admin"), getSeancesByStudent);

// GET toutes les séances (pour les étudiants - toutes les séances disponibles)
router.get("/etudiant/all", protect, authorizeRoles("student", "admin"), getAllSeancesForStudents);

// POST création séance (professeur, admin)
router.post("/", protect, authorizeRoles("teacher", "prof", "admin"), createSeance);

// PUT mise à jour statut 'fait' d'une séance
router.put("/:id/mark", protect, authorizeRoles("teacher", "prof", "admin"), marquerSeanceFaite);

// DELETE suppression séance
router.delete("/:id", protect, authorizeRoles("teacher", "prof", "admin"), deleteSeance);

module.exports = router;
