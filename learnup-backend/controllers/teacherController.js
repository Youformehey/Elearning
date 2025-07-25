const Teacher = require("../models/Teacher");
const RappelFait = require("../models/RappelFait");
const jwt = require("jsonwebtoken");

// 🎟️ Générer un token avec le rôle "teacher" forcé
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ✅ POST /api/teachers/register
const registerTeacher = async (req, res) => {
  const { name, email, password } = req.body;

  const teacherExists = await Teacher.findOne({ email });
  if (teacherExists) {
    return res.status(400).json({ message: "Teacher already exists" });
  }

  const teacher = await Teacher.create({ name, email, password });

  if (teacher) {
    res.status(201).json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      role: "teacher", // rôle forcé
      token: generateToken(teacher._id, "teacher"), // rôle forcé
    });
  } else {
    res.status(400).json({ message: "Invalid teacher data" });
  }
};

// ✅ POST /api/teachers/login
const loginTeacher = async (req, res) => {
  const { email, password } = req.body;
  const teacher = await Teacher.findOne({ email });

  if (teacher && (await teacher.matchPassword(password))) {
    res.json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      role: "teacher", // rôle forcé
      token: generateToken(teacher._id, "teacher"), // rôle forcé
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

// ✅ GET /api/rappels/:id/etudiants → Voir les étudiants qui ont fait le rappel
const getStudentsWhoDidRappel = async (req, res) => {
  try {
    const rappelId = req.params.id;

    const faits = await RappelFait.find({ rappel: rappelId }).populate(
      "student",
      "name email classe"
    );

    res.json(faits);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

module.exports = {
  registerTeacher,
  loginTeacher,
  getStudentsWhoDidRappel, // ✅ export ajouté
};
