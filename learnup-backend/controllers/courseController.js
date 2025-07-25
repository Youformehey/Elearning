/**
 * controllers/courseController.js
 * Refonte complète en préservant toutes les fonctionnalités existantes
 * et intégrant la prise en charge des chapitres, quiz, forums, progression,
 * ressources multimédias et autres.
 */

const mongoose = require("mongoose");
const Course = require("../models/Course");
const Chapitre = require("../models/Chapitre");
const Quiz = require("../models/Quiz");
const ForumMessage = require("../models/ForumMessage");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Matiere = require("../models/Matiere");
const Absence = require("../models/Absence");
const Homework = require("../models/Homework");
const HomeworkSubmission = require("../models/HomeworkSubmission");
const Seance = require("../models/Seance");

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
  const heures = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${heures}h${minutes}`;
};

/** CREATE COURSE + SEANCE */
exports.createCourse = async (req, res) => {
  try {
    const {
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

    const teacherId = req.user?.id || req.body.teacher;
    if (!teacherId) return res.status(400).json({ message: "Aucun professeur identifié." });
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: "Professeur introuvable." });
    const matiereObj = await Matiere.findById(matiere);
    if (!matiereObj) return res.status(404).json({ message: "Matière introuvable." });

    const course = new Course({
      matiere: matiereObj._id,
      classe,
      semestre,
      horaire,
      date,
      salle,
      groupe: groupe || classe,
      duree,
      teacher: teacher._id,
      etudiants,
      chapitres: []
    });

    const savedCourse = await course.save();
    // Créer séance associée
    const heureFin = calculerHeureFin(horaire, duree);
    const seance = new Seance({
      date,
      heureDebut: horaire,
      heureFin,
      course: savedCourse._id,
      professeur: teacher._id,
      salle,
      groupe: groupe || classe,
      classe
    });
    await seance.save();

    const populatedCourse = await Course.findById(savedCourse._id)
      .populate("teacher", "name email")
      .populate("matiere", "nom")
      .populate("etudiants", "name email")
      .populate({ path: "chapitres", options: { sort: { order: 1 } } });

    res.status(201).json(populatedCourse);
  } catch (err) {
    console.error("Erreur création cours :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

/** GET ALL COURSES (with pagination, search, role filter) */
exports.getAllCourses = async (req, res) => {
  try {
    const user = req.user;
    const { page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;
    let query = {};
    if (search) {
      query.$or = [
        { classe: new RegExp(search, "i") },
        { semestre: new RegExp(search, "i") }
      ];
    }
    if (user.role === "teacher" || user.role === "prof") query.teacher = user._id;
    else if (user.role === "student") query.etudiants = user._id;

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate("teacher", "name email")
      .populate("etudiants", "name email")
      .populate("matiere", "nom")
      .populate({ path: "chapitres", options: { sort: { order: 1 } } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ total, page, totalPages: Math.ceil(total / limit), courses });
  } catch (err) {
    console.error("Erreur getAllCourses :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/** GET COURSE BY ID */
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("teacher", "name email")
      .populate("etudiants", "name email")
      .populate("matiere", "nom")
      .populate({ path: "chapitres", options: { sort: { order: 1 } } });
    if (!course) return res.status(404).json({ message: "Cours introuvable" });
    res.json(course);
  } catch (err) {
    console.error("Erreur getCourseById :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/** UPDATE COURSE */
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Cours introuvable" });
    if ((req.user.role === "teacher" || req.user.role === "prof") &&
      course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }
    // Ajout d'un chapitre au tableau chapitres si req.body.chapitre est présent
    if (req.body.chapitre) {
      if (!course.chapitres.includes(req.body.chapitre)) {
        course.chapitres.push(req.body.chapitre);
      }
      delete req.body.chapitre; // Pour ne pas écraser le reste
    }
    Object.assign(course, req.body);
    await course.save();
    const updated = await Course.findById(course._id)
      .populate("teacher", "name email")
      .populate("etudiants", "name email")
      .populate("matiere", "nom")
      .populate({ path: "chapitres", options: { sort: { order: 1 } } });
    res.json(updated);
  } catch (err) {
    console.error("Erreur updateCourse :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/** DELETE COURSE + cleanup chapitres, seances, absences, homeworks, forum */
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Cours introuvable" });
    if ((req.user.role === "teacher" || req.user.role === "prof") &&
      course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }
    // Supprimer chapitres
    await Chapitre.deleteMany({ _id: { $in: course.chapitres } });
    // Supprimer séances
    await Seance.deleteMany({ course: course._id });
    // Supprimer absences
    await Absence.deleteMany({ course: course._id });
    // Supprimer devoirs et soumissions
    await Homework.deleteMany({ course: course._id });
    await HomeworkSubmission.deleteMany({ homework: { $in: course.devoirs.map(d => d._id) } });
    // Supprimer messages forum
    await ForumMessage.deleteMany({ courseId: course._id });
    await course.deleteOne();
    res.json({ message: "Cours supprimé" });
  } catch (err) {
    console.error("Erreur deleteCourse :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/** ENROLL / LEAVE STUDENT */
exports.enrollStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentEmail } = req.body;
    const student = await Student.findOne({ email: studentEmail });
    if (!student) return res.status(404).json({ message: "Étudiant introuvable" });
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Cours introuvable" });
    if (!course.etudiants.includes(student._id)) {
      course.etudiants.push(student._id);
      await course.save();
    }
    res.json(course);
  } catch (err) {
    console.error("Erreur enrollStudent :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.leaveCourse = async (req, res) => {
  try {
    const studentId = req.user._id;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Cours introuvable" });
    course.etudiants = course.etudiants.filter(id => id.toString() !== studentId.toString());
    await course.save();
    res.json({ message: "Étudiant retiré" });
  } catch (err) {
    console.error("Erreur leaveCourse :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/** GET TODAY COURSES */
exports.getTodayCourses = async (req, res) => {
  try {
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);
    const courses = await Course.find({
      teacher: req.user._id,
      date: { $gte: todayStart, $lte: todayEnd }
    }).populate("etudiants", "name email");
    res.json(courses);
  } catch (err) {
    console.error("Erreur getTodayCourses :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/** GET ABSENCE STATS */
exports.getStatsForCourse = async (req, res) => {
  try {
    const absences = await Absence.find({ course: req.params.id }).populate("student", "name");
    res.json({ absences });
  } catch (err) {
    console.error("Erreur getStatsForCourse :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/** HOMEWORK UPLOAD & SUBMISSIONS */
exports.uploadHomework = async (req, res) => {
  const { titre } = req.body;
  const file = req.file;
  if (!titre) return res.status(400).json({ message: "Titre requis" });
  if (!file) return res.status(400).json({ message: "Fichier manquant" });
  try {
    const hw = new Homework({ course: req.params.id, title: titre, fileUrl: `/uploads/homeworks/${file.filename}` });
    await hw.save();
    res.status(201).json(hw);
  } catch (err) {
    console.error("Erreur uploadHomework :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getHomeworkSubmissions = async (req, res) => {
  try {
    const subs = await HomeworkSubmission.find({ homework: req.params.id }).populate("student", "name email");
    res.json(subs);
  } catch (err) {
    console.error("Erreur getHomeworkSubmissions :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/** UPDATE NOTE FOR STUDENT */
exports.updateNoteForStudent = async (req, res) => {
  try {
    const { id: courseId, studentId } = req.params;
    const { ds, dm, projet } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Cours introuvable" });
    if (!course.notes) course.notes = {};
    course.notes[studentId] = {...course.notes[studentId], ds, dm, projet};
    await course.save();
    res.json({ notes: course.notes[studentId] });
  } catch (err) {
    console.error("Erreur updateNoteForStudent :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/** CHAPITRE MANAGEMENT */
exports.addChapitreToCourse = async (req, res) => {
  try {
    const { titre, description, order, ressources } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Cours introuvable" });
    const chap = new Chapitre({ titre, description, order, ressources, course: course._id });
    await chap.save();
    course.chapitres.push(chap._id);
    await course.save();
    res.status(201).json(chap);
  } catch (err) {
    console.error("Erreur addChapitreToCourse :", err);
    res.status(400).json({ message: "Données invalides" });
  }
};

exports.updateChapitre = async (req, res) => {
  try {
    const chap = await Chapitre.findByIdAndUpdate(req.params.chapId, req.body, { new: true });
    if (!chap) return res.status(404).json({ message: "Chapitre introuvable" });
    res.json(chap);
  } catch (err) {
    console.error("Erreur updateChapitre :", err);
    res.status(400).json({ message: "Données invalides" });
  }
};

exports.removeChapitre = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Cours introuvable" });
    course.chapitres.pull(req.params.chapId);
    await course.save();
    await Chapitre.findByIdAndDelete(req.params.chapId);
    res.json({ message: "Chapitre supprimé" });
  } catch (err) {
    console.error("Erreur removeChapitre :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/** QUIZ MANAGEMENT */
exports.createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz({ chapitreId: req.params.chapId, questions: req.body.questions });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    console.error("Erreur createQuiz :", err);
    res.status(400).json({ message: "Données invalides" });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ chapitreId: req.params.chapId });
    res.json(quizzes);
  } catch (err) {
    console.error("Erreur getQuizzes :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, { new: true });
    res.json(quiz);
  } catch (err) {
    console.error("Erreur updateQuiz :", err);
    res.status(400).json({ message: "Données invalides" });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.quizId);
    res.json({ message: "Quiz supprimé" });
  } catch (err) {
    console.error("Erreur deleteQuiz :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/** FORUM MESSAGES */
exports.postMessage = async (req, res) => {
  try {
    const { content, parentId } = req.body;
    const courseId = req.params.id;
    const chapId = req.params.chapId || null;
    const msg = new ForumMessage({
      courseId,
      chapitreId: chapId,
      author: req.user.id,
      authorModel: req.user.role === 'teacher' ? 'Teacher' : 'Student',
      content,
      parentId: parentId || null
    });
    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    console.error("Erreur postMessage :", err);
    res.status(400).json({ message: "Données invalides" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const filter = { courseId: req.params.id };
    if (req.params.chapId) filter.chapitreId = req.params.chapId;
    const msgs = await ForumMessage.find(filter).sort('createdAt');
    res.json(msgs);
  } catch (err) {
    console.error("Erreur getMessages :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
