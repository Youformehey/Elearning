const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Route accessible uniquement aux enseignants et admins
router.get("/teacher-area", protect, authorizeRoles("teacher", "admin"), (req, res) => {
  res.send(`Bienvenue Professeur ${req.user.name}`);
});

// Route accessible uniquement aux étudiants
router.get("/student-area", protect, authorizeRoles("student"), (req, res) => {
  res.send(`Bienvenue Étudiant ${req.user.name}`);
});

module.exports = router;
