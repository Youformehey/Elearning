const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Admin = require("../models/Admin");

// Fonction utilitaire pour créer un token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Inscription Étudiant (exemple)
router.post("/students/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Tous les champs sont obligatoires." });

  try {
    let userExists = await Student.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email déjà utilisé." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Student({ name, email, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
  }
});

// Connexion (login) générique (Étudiant, Professeur, Admin)
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role)
    return res.status(400).json({ message: "Email, mot de passe et rôle sont obligatoires." });

  const Model = { student: Student, teacher: Teacher, admin: Admin }[role];
  if (!Model) return res.status(400).json({ message: "Rôle invalide." });

  try {
    const user = await Model.findOne({ email });
    if (!user) return res.status(401).json({ message: "Utilisateur non trouvé." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect." });

    const token = generateToken(user);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
});

// Récupérer le profil utilisateur (route protégée à utiliser avec middleware protect)
router.get("/profile", protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
