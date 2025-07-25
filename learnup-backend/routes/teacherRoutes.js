const express = require("express");
const router = express.Router();

const {
  registerTeacher,
  loginTeacher,
  getStudentsWhoDidRappel, // ✅ nouvelle fonction
} = require("../controllers/teacherController");

const Teacher = require("../models/Teacher");

// 🛡️ Middleware de sécurité
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// 🔐 Auth routes
router.post("/register", registerTeacher);
router.post("/login", loginTeacher);

// ✅ GET profil par email
router.get("/profile", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email requis" });

  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(404).json({ error: "Professeur non trouvé" });
    res.json(teacher);
  } catch (err) {
    console.error("Erreur GET /profile:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ PUT mise à jour du profil
router.put("/", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email requis pour mise à jour" });

  try {
    const updated = await Teacher.findOneAndUpdate({ email }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Professeur non trouvé" });
    res.json(updated);
  } catch (err) {
    console.error("Erreur PUT /teachers:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🧑‍🏫 Dashboard sécurisé pour les teachers
router.get("/dashboard", protect, authorizeRoles("teacher"), (req, res) => {
  res.json({ message: "Bienvenue teacher!" });
});

// ✅ NOUVELLE ROUTE : Voir les étudiants ayant fait un rappel
router.get("/rappels/:id/etudiants", protect, authorizeRoles("teacher"), getStudentsWhoDidRappel);

module.exports = router;
