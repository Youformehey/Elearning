const Student = require("../models/Student");
const Seance = require("../models/Seance");
const Rappel = require("../models/Rappel");
const Course = require("../models/Course");
const Chapitre = require("../models/Chapitre");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Inscription étudiant
const registerStudent = async (req, res) => {
  try {
    const { name, email, password, classe } = req.body;
    if (!name || !email || !password || !classe) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({ name, email, password: hashedPassword, classe, role: "Student" });
    await newStudent.save();

    const token = jwt.sign(
      { _id: newStudent._id, email: newStudent.email, role: newStudent.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      _id: newStudent._id,
      name: newStudent.name,
      email: newStudent.email,
      classe: newStudent.classe,
      token,
    });
  } catch (err) {
    console.error("Erreur registerStudent:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Connexion étudiant
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
    const token = jwt.sign(
      { _id: student._id, email: student.email, role: "Student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      classe: student.classe,
      token,
    });
  } catch (err) {
    console.error("Erreur loginStudent:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Profil étudiant connecté
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select("-password");
    if (!student) return res.status(404).json({ message: "Étudiant non trouvé" });
    res.json(student);
  } catch (err) {
    console.error("Erreur getStudentProfile:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer les cours de la classe de l'étudiant
const getStudentCourses = async (req, res) => {
  try {
    const classe = req.user.classe;
    if (!classe) return res.status(400).json({ message: "Classe manquante" });
    const courses = await Course.find({ classe })
      .populate("matiere")
      .populate("teacher", "name email");
    res.json(courses);
  } catch (err) {
    console.error("Erreur getStudentCourses:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer tous les rappels de tous les professeurs (avec infos prof)
const getStudentRappels = async (req, res) => {
  try {
    const rappels = await Rappel.find({})
      .populate("professeur", "name email")
      .sort({ date: 1 });
    res.json(rappels);
  } catch (err) {
    console.error("Erreur getStudentRappels:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Marquer un rappel comme fait (côté étudiant)
const markRappelFait = async (req, res) => {
  try {
    const rappelId = req.params.id;
    const studentId = req.user._id;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Étudiant non trouvé" });
    if (!student.rappelsFaits) student.rappelsFaits = [];
    if (!student.rappelsFaits.includes(rappelId)) {
      student.rappelsFaits.push(rappelId);
      await student.save();
    }
    res.json({ message: "Rappel marqué comme fait" });
  } catch (err) {
    console.error("Erreur markRappelFait:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer le planning complet de l'étudiant (séances de sa classe)
const getStudentPlanning = async (req, res) => {
  try {
    const classe = req.user.classe?.trim();
    if (!classe) return res.status(400).json({ message: "Classe manquante" });
    const seances = await Seance.find({ classe })
      .populate({
        path: "course",
        populate: { path: "matiere" },
      })
      .populate("teacher", "name email")
      .sort({ date: 1, heureDebut: 1 });

    const formatted = seances.map((s) => ({
      _id: s._id,
      date: s.date,
      classe: s.classe || s.course?.classe || "--",
      heureDebut: s.heureDebut || "Inconnue",
      heureFin: s.heureFin || "Inconnue",
      matiere: s.course?.matiere?.nom || "Inconnue",
      groupe: s.groupe || "Inconnu",
      salle: s.salle || "Inconnue",
      professeur: s.teacher?.name || "Inconnu",
      emailProfesseur: s.teacher?.email || "Inconnu",
      fait: s.fait || false,
    }));
    res.json(formatted);
  } catch (err) {
    console.error("Erreur getStudentPlanning:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer chapitres avec leurs cours liés
const getChapitresWithCourses = async (req, res) => {
  try {
    const chapitres = await Chapitre.find({})
      .populate({
        path: "cours",
        populate: [
          { path: "matiere" },
          { path: "teacher", select: "name email" },
        ],
      });
    res.json(chapitres);
  } catch (err) {
    console.error("Erreur getChapitresWithCourses:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  getStudentProfile,
  getStudentCourses,
  getStudentRappels,
  markRappelFait,
  getStudentPlanning,
  getChapitresWithCourses,
};
