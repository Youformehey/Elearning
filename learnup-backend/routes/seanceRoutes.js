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
router.get("/professeur", protect, authorizeRoles("teacher"), getSeancesByEmail);

// GET toutes les séances d'un étudiant (par classe)
router.get("/etudiant", protect, authorizeRoles("student"), getSeancesByStudent);

// GET toutes les séances (pour les étudiants - toutes les séances disponibles)
router.get("/etudiant/all", protect, authorizeRoles("student"), getAllSeancesForStudents);

// POST création séance (professeur, admin)
router.post("/", protect, authorizeRoles("teacher", "prof", "admin"), createSeance);

// PUT mise à jour statut 'fait' d'une séance
router.put("/:id/mark", protect, authorizeRoles("teacher", "prof"), marquerSeanceFaite);

// DELETE suppression séance
router.delete("/:id", protect, authorizeRoles("teacher", "prof"), deleteSeance);

module.exports = router;
