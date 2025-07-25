const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const controller = require("../controllers/rappelsEtudiant.controller");

// Met à jour le marquage fait/non fait d'un rappel
router.put("/:rappelId", protect, authorizeRoles("student"), controller.marquerFait);

// Récupère tous les rappels avec l'état fait/remarque de l'étudiant
router.get("/", protect, authorizeRoles("student"), controller.getRappelsEtudiant);

module.exports = router;
