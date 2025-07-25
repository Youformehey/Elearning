// controllers/courseController.js
const mongoose             = require("mongoose");
const Course               = require("../models/Course");
const Chapitre             = require("../models/Chapitre");
const Quiz                 = require("../models/Quiz");
const ForumMessage         = require("../models/ForumMessage");
const Teacher              = require("../models/Teacher");
const Student              = require("../models/Student");
const Matiere              = require("../models/Matiere");
const Absence              = require("../models/Absence");
const Homework             = require("../models/Homework");
const HomeworkSubmission   = require("../models/HomeworkSubmission");
const Seance               = require("../models/Seance");

// Utilitaire pour calculer heure de fin à partir de l'heure de début et durée (en minutes)
const calculerHeureFin = (heureDebut, duree) => {
  if (!heureDebut || !duree) return null;
  let hd = heureDebut.replace("h", "");
  const [h, m = 0] = hd.includes(":")
    ? hd.split(":").map(Number)
    : [parseInt(hd), 0];
  if (isNaN(h) || isNaN(m)) return null;
  const date = new Date();
  date.setHours(h);
  date.setMinutes(m + parseInt(duree));
  const heures  = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${heures}h${minutes}`;
};

/** CREATE COURSE (+ séance associée) */
exports.createCourse = async (req, res) => {
  try {
    const {
      nom,            // <–– on récupère maintenant le nom
      matiere,
      classe,
      semestre,
      horaire,
      date,
      salle = "Salle A",
      groupe,
      duree = 120,
      etudiants = []
    } = req.body;

    if (!nom || !nom.trim()) {
      return res.status(400).json({ message: "Le nom du cours est requis." });
    }

    const teacherId = req.user?.id || req.body.teacher;
    if (!teacherId)
      return res.status(400).json({ message: "Aucun professeur identifié." });

    const [teacher, matiereObj] = await Promise.all([
      Teacher.findById(teacherId),
      Matiere.findById(matiere)
    ]);
    if (!teacher)    return res.status(404).json({ message: "Professeur introuvable." });
    if (!matiereObj) return res.status(404).json({ message: "Matière introuvable." });

    const course = new Course({
      nom,              // <–– on assigne nom ici
      matiere:   matiereObj._id,
      classe,
      semestre,
      horaire,
      date,
      salle,
      groupe:    groupe || classe,
      duree,
      teacher:   teacher._id,
      etudiants
    });

    const savedCourse = await course.save();

    // Créer la séance liée
    const heureFin = calculerHeureFin(horaire, duree);
    await Seance.create({
      date,
      heureDebut:  horaire,
      heureFin,
      course:      savedCourse._id,
      professeur:  teacher._id,
      salle,
      groupe:      groupe || classe,
      classe
    });

    const populated = await Course.findById(savedCourse._id)
      .populate("teacher",   "name email")
      .populate("matiere",   "nom")
      .populate("etudiants", "name email")
      .populate({ path: "chapitres", options: { sort: { order: 1 } } });

    res.status(201).json(populated);
  } catch (err) {
    console.error("Erreur createCourse :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

/** GET ALL COURSES (pagination, filtre selon rôle, recherche) */
exports.getAllCourses = async (req, res) => {
  try {
    const user  = req.user;
    const { page = 1, limit = 20, search } = req.query;
    const skip  = (page - 1) * limit;

    let query = {};
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { classe: regex },
        { semestre: regex },
        { nom: regex }            // <–– on peut aussi rechercher par nom
      ];
    }
    if (user.role === "teacher" || user.role === "prof") {
      query.teacher = user._id;
    } else if (user.role === "student") {
      query.etudiants = user._id;
    }

    const [ total, courses ] = await Promise.all([
      Course.countDocuments(query),
      Course.find(query)
        .populate("teacher",   "name email")
        .populate("matiere",   "nom")
        .populate("etudiants", "name email")
        .populate({ path: "chapitres", options: { sort: { order: 1 } } })
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit))
    ]);

    res.json({
      total,
      page:        parseInt(page),
      totalPages:  Math.ceil(total / limit),
      courses
    });
  } catch (err) {
    console.error("Erreur getAllCourses :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/** GET COURSE BY ID (avec chapitres) */
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("teacher",   "name email")
      .populate("matiere",   "nom")
      .populate("etudiants", "name email")
      .populate({ path: "chapitres", options: { sort: { order: 1 } } });

    if (!course) return res.status(404).json({ message: "Cours introuvable" });
    res.json(course);
  } catch (err) {
    console.error("Erreur getCourseById :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/** UPDATE COURSE (hors gestion des chapitres) */
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Cours introuvable" });

    if (
      (req.user.role === "teacher" || req.user.role === "prof") &&
      course.teacher.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    // On autorise maintenant la mise à jour de `nom`
    const updatable = ["nom", "classe", "semestre", "horaire", "date", "salle", "groupe", "duree"];
    updatable.forEach(field => {
      if (req.body[field] !== undefined) course[field] = req.body[field];
    });
    if (req.body.matiere) course.matiere = req.body.matiere;
    if (req.body.etudiants) course.etudiants = req.body.etudiants;

    await course.save();

    const updated = await Course.findById(course._id)
      .populate("teacher",   "name email")
      .populate("matiere",   "nom")
      .populate("etudiants", "name email")
      .populate({ path: "chapitres", options: { sort: { order: 1 } } });

    res.json(updated);
  } catch (err) {
    console.error("Erreur updateCourse :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/** DELETE COURSE + nettoyage des chapitres et des entités liées */
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Cours introuvable" });

    if (
      (req.user.role === "teacher" || req.user.role === "prof") &&
      course.teacher.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    // Supprimer tous les chapitres liés
    await Chapitre.deleteMany({ course: course._id });
    // Supprimer séances, absences, devoirs, soumissions, messages de forum
    await Promise.all([
      Seance.deleteMany({ course: course._id }),
      Absence.deleteMany({ course: course._id }),
      Homework.deleteMany({ course: course._id }),
      HomeworkSubmission.deleteMany({ homework: { $in: course.devoirs.map(d => d._id) } }),
      ForumMessage.deleteMany({ courseId: course._id })
    ]);
    await course.deleteOne();

    res.json({ message: "Cours supprimé" });
  } catch (err) {
    console.error("Erreur deleteCourse :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/** ENROLL / LEAVE STUDENT */
exports.enrollStudent = async (req, res) => { /* inchangé */ };
exports.leaveCourse  = async (req, res) => { /* inchangé */ };

/** GET TODAY COURSES */
exports.getTodayCourses  = async (req, res) => { /* inchangé */ };

/** GET ABSENCE STATS */
exports.getStatsForCourse = async (req, res) => { /* inchangé */ };

/** HOMEWORK & SUBMISSIONS */
exports.uploadHomework        = async (req, res) => { /* inchangé */ };
exports.getHomeworkSubmissions = async (req, res) => { /* inchangé */ };

/** UPDATE NOTE FOR STUDENT */
exports.updateNoteForStudent = async (req, res) => { /* inchangé */ };

/** ▶ CHAPITRE MANAGEMENT ▶ **/
exports.addChapitreToCourse = async (req, res) => { /* inchangé */ };
exports.updateChapitre      = async (req, res) => { /* inchangé */ };
exports.removeChapitre      = async (req, res) => { /* inchangé */ };

/** ▶ QUIZ MANAGEMENT ▶ **/
exports.createQuiz  = async (req, res) => { /* inchangé */ };
exports.getQuizzes  = async (req, res) => { /* inchangé */ };
exports.updateQuiz  = async (req, res) => { /* inchangé */ };
exports.deleteQuiz  = async (req, res) => { /* inchangé */ };

/** ▶ FORUM MESSAGES ▶ **/
exports.postMessage = async (req, res) => { /* inchangé */ };
exports.getMessages = async (req, res) => { /* inchangé */ };
