const express = require("express");
const router = express.Router();

const {
  getRappels,
  createRappel,
  deleteRappel,
  getRappelsByClasse,
  updateRappel,
  getEtudiantsAyantFaitRappel,
} = require("../controllers/rappelController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// 📌 Tous les rappels (professeur) — protégé + rôle teacher
router.get("/", protect, authorizeRoles("teacher"), getRappels);

// ➕ Créer un nouveau rappel (professeur) — protégé + rôle teacher
router.post("/", protect, authorizeRoles("teacher"), createRappel);

// ❌ Supprimer un rappel (professeur) — protégé + rôle teacher
router.delete("/:id", protect, authorizeRoles("teacher"), deleteRappel);

// ♻️ Modifier un rappel (professeur) — protégé + rôle teacher
router.put("/:id", protect, authorizeRoles("teacher"), updateRappel);

// 📚 Rappels pour une classe donnée (étudiant) — protégé + rôle student
router.get("/classe/:classe", protect, authorizeRoles("student"), getRappelsByClasse);

// 👨‍🎓 Voir les étudiants qui ont marqué un rappel comme fait (professeur)
router.get("/:id/etudiants", protect, authorizeRoles("teacher"), getEtudiantsAyantFaitRappel);

module.exports = router;
