const express = require("express");
const router = express.Router();

const {
  getFormations,
  getFormationsAchetees,
  acheterFormation,
  verifierAcces,
  creerFormation,
  modifierFormation,
  supprimerFormation
} = require("../controllers/formationController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Routes pour les étudiants
router.get("/", protect, authorizeRoles("student"), getFormations);
router.get("/achetees", protect, authorizeRoles("student"), getFormationsAchetees);
router.post("/:formationId/acheter", protect, authorizeRoles("student"), acheterFormation);
router.get("/:formationId/acces", protect, authorizeRoles("student"), verifierAcces);

// Routes pour les profs/admins
router.post("/", protect, authorizeRoles("teacher", "admin"), creerFormation);
router.put("/:formationId", protect, authorizeRoles("teacher", "admin"), modifierFormation);
router.delete("/:formationId", protect, authorizeRoles("teacher", "admin"), supprimerFormation);

module.exports = router; 