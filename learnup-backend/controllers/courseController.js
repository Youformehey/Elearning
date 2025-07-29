const mongoose           = require("mongoose");
const Course             = require("../models/Course");
const Chapitre           = require("../models/Chapitre");
const Seance             = require("../models/Seance");
const Teacher            = require("../models/Teacher");
const Matiere            = require("../models/Matiere");
const Absence            = require("../models/Absence");
const Homework           = require("../models/Homework");
const HomeworkSubmission = require("../models/HomeworkSubmission");
const ForumMessage       = require("../models/ForumMessage");
const Student            = require("../models/Student");

// Calcul heure de fin à partir heure début et durée (en minutes)
const calculerHeureFin = (heureDebut, duree) => {
  if (!heureDebut || !duree) return null;
  let hd = heureDebut.replace("h", "");
  const [h, m = 0] = hd.includes(":") ? hd.split(":").map(Number) : [parseInt(hd), 0];
  if (isNaN(h) || isNaN(m)) return null;
  const date = new Date();
  date.setHours(h);
  date.setMinutes(m + parseInt(duree));
  return `${String(date.getHours()).padStart(2,"0")}h${String(date.getMinutes()).padStart(2,"0")}`;
};

// === CRUD COURS ===

// CREATE COURSE + séance associée
exports.createCourse = async (req, res) => {
  try {
    const { nom, matiere, classe, semestre, horaire, date, salle = "Salle A", groupe, duree = 120, etudiants = [] } = req.body;

    if (!nom || !nom.trim()) return res.status(400).json({ message: "Le nom du cours est requis." });

    const teacherId = req.user?.id || req.body.teacher;
    if (!teacherId) return res.status(400).json({ message: "Aucun professeur identifié." });

    const [teacher, matiereObj] = await Promise.all([
      Teacher.findById(teacherId),
      Matiere.findById(matiere)
    ]);
    if (!teacher) return res.status(404).json({ message: "Professeur introuvable." });
    if (!matiereObj) return res.status(404).json({ message: "Matière introuvable." });

    const course = new Course({
      nom,
      matiere: matiereObj._id,
      classe,
      semestre,
      horaire,
      date,
      salle,
      groupe: groupe || classe,
      duree,
      teacher: teacher._id,
      etudiants
    });

    const savedCourse = await course.save();

    // Créer séance liée
    const heureFin = calculerHeureFin(horaire, duree);
    await Seance.create({
      date,
      heureDebut: horaire,
      heureFin,
      course: savedCourse._id,
      professeur: teacher._id,
      salle,
      groupe: groupe || classe,
      classe
    });

    const populated = await Course.findById(savedCourse._id)
      .populate("teacher", "name email")
      .populate("matiere", "nom")
      .populate("etudiants", "name email")
      .populate({ path: "chapitres", options: { sort: { order: 1 } } });

    res.status(201).json(populated);
  } catch (err) {
    console.error("Erreur createCourse:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// GET ALL COURSES (pagination, filtre, recherche)
exports.getAllCourses = async (req, res) => {
  try {
    const user = req.user;
    const { page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { classe: regex },
        { semestre: regex },
        { nom: regex }
      ];
    }
    if (["teacher", "prof"].includes(user.role)) {
      query.teacher = user._id;
    } else if (user.role === "student") {
      query.etudiants = user._id;
    }

    const [total, courses] = await Promise.all([
      Course.countDocuments(query),
      Course.find(query)
        .populate("teacher", "name email")
        .populate("matiere", "nom")
        .populate("etudiants", "name email classe")
        .populate({ path: "chapitres", options: { sort: { order: 1 } } })
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit))
    ]);

    // Nettoyage automatique des élèves mal inscrits
    const Note = require("../models/Note");
    const Absence = require("../models/Absence");
    for (const course of courses) {
      const incorrectStudents = course.etudiants.filter(e => e.classe !== course.classe);
      if (incorrectStudents.length > 0) {
        for (const student of incorrectStudents) {
          // Supprimer notes et absences pour ce cours
          await Note.deleteMany({ etudiant: student._id, cours: course._id });
          await Absence.deleteMany({ etudiant: student._id, cours: course._id });
        }
        // Retirer les élèves du cours
        course.etudiants = course.etudiants.filter(e => e.classe === course.classe);
        await course.save();
      }
    }

    res.json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      courses
    });
  } catch (err) {
    console.error("Erreur getAllCourses:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET COURSE BY ID
exports.getCourseById = async (req, res) => {
  try {
    const Note = require("../models/Note");
    const Absence = require("../models/Absence");
    const course = await Course.findById(req.params.id)
      .populate("teacher", "name email")
      .populate("matiere", "nom")
      .populate("etudiants", "name email classe")
      .populate({ path: "chapitres", options: { sort: { order: 1 } } });

    if (!course) return res.status(404).json({ message: "Cours introuvable" });

    // Nettoyage automatique des élèves mal inscrits
    const incorrectStudents = course.etudiants.filter(e => e.classe !== course.classe);
    if (incorrectStudents.length > 0) {
      for (const student of incorrectStudents) {
        await Note.deleteMany({ etudiant: student._id, cours: course._id });
        await Absence.deleteMany({ etudiant: student._id, cours: course._id });
      }
      course.etudiants = course.etudiants.filter(e => e.classe === course.classe);
      await course.save();
    }

    res.json(course);
  } catch (err) {
    console.error("Erreur getCourseById:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// UPDATE COURSE + gestion chapitres
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Cours introuvable" });

    if (["teacher","prof"].includes(req.user.role) &&
        course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    const updatable = ["nom","classe","semestre","horaire","date","salle","groupe","duree"];
    updatable.forEach(f => {
      if (req.body[f] !== undefined) course[f] = req.body[f];
    });

    if (Array.isArray(req.body.chapitres)) {
      const validChapitres = await Chapitre.find({ _id: { $in: req.body.chapitres } });
      if (validChapitres.length !== req.body.chapitres.length) {
        return res.status(400).json({ message: "Chapitre(s) invalide(s)" });
      }
      course.chapitres = req.body.chapitres;
    }

    if (req.body.matiere)   course.matiere   = req.body.matiere;
    if (req.body.etudiants) course.etudiants = req.body.etudiants;

    await course.save();

    const updated = await Course.findById(course._id)
      .populate("teacher", "name email")
      .populate("matiere", "nom")
      .populate("etudiants", "name email")
      .populate({ path: "chapitres", options: { sort: { order: 1 } } });

    res.json(updated);
  } catch (err) {
    console.error("Erreur updateCourse:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// DELETE COURSE + suppression liée des chapitres, séances, absences, devoirs, forum...
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Cours introuvable" });

    if (["teacher","prof"].includes(req.user.role) &&
        course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await Chapitre.deleteMany({ course: course._id });

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
    console.error("Erreur deleteCourse:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// === CHAPITRES ===

// ADD CHAPITRE to course
exports.addChapitreToCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { titre, description = "", order = 0 } = req.body;

    if (!titre || !titre.trim()) {
      return res.status(400).json({ message: "Le titre du chapitre est requis." });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Cours introuvable." });

    const chapitre = new Chapitre({
      titre,
      description,
      order,
      course: course._id
    });

    const savedChapitre = await chapitre.save();

    course.chapitres.push(savedChapitre._id);
    await course.save();

    res.status(201).json(savedChapitre);
  } catch (error) {
    console.error("Erreur addChapitreToCourse:", error);
    res.status(500).json({ message: "Erreur serveur lors de l'ajout du chapitre" });
  }
};

// UPDATE CHAPITRE
exports.updateChapitre = async (req, res) => {
  try {
    const { chapId } = req.params;
    const { titre, description, order } = req.body;

    const chapitre = await Chapitre.findById(chapId);
    if (!chapitre) return res.status(404).json({ message: "Chapitre introuvable" });

    if (titre !== undefined) chapitre.titre = titre;
    if (description !== undefined) chapitre.description = description;
    if (order !== undefined) chapitre.order = order;

    await chapitre.save();

    res.json(chapitre);
  } catch (error) {
    console.error("Erreur updateChapitre:", error);
    res.status(500).json({ message: "Erreur serveur lors mise à jour chapitre" });
  }
};

// REMOVE CHAPITRE (peut être doublon avec deleteChapitreFromCourse)
exports.removeChapitre = async (req, res) => {
  try {
    const { id, chapId } = req.params;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Cours introuvable" });

    await Chapitre.findByIdAndDelete(chapId);

    course.chapitres = course.chapitres.filter(id => id.toString() !== chapId);
    await course.save();

    res.json({ message: "Chapitre supprimé" });
  } catch (error) {
    console.error("Erreur removeChapitre:", error);
    res.status(500).json({ message: "Erreur serveur lors suppression chapitre" });
  }
};

// DELETE CHAPITRE isolément et mise à jour du cours
exports.deleteChapitreFromCourse = async (req, res) => {
  try {
    const { courseId, chapitreId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Cours introuvable" });

    if (["teacher","prof"].includes(req.user.role) &&
        course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await Chapitre.findByIdAndDelete(chapitreId);

    course.chapitres = course.chapitres.filter(id => id.toString() !== chapitreId);
    await course.save();

    res.json({ message: "Chapitre supprimé du cours" });
  } catch (err) {
    console.error("Erreur deleteChapitreFromCourse:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// === FONCTIONNALITÉS SUPPLÉMENTAIRES ===

// Inscrire un étudiant à un cours
exports.enrollStudent = async (req, res) => {
  try {
    const courseId = req.params.id;
    let { studentId, email } = req.body;

    // Si pas d'ID, on cherche par email
    if (!studentId && email) {
      const student = await Student.findOne({ email: email.trim().toLowerCase() });
      if (!student) {
        return res.status(404).json({ message: "Aucun étudiant trouvé avec cet email." });
      }
      studentId = student._id;
    }

    if (!studentId) {
      return res.status(400).json({ message: "L'ID de l'étudiant est requis." });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Cours introuvable." });

    // Vérifie que le professeur est bien le propriétaire du cours
    if (["teacher", "prof"].includes(req.user.role) &&
        course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé." });
    }

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Étudiant introuvable." });

    // 🔒 VÉRIFICATION CLASSE : L'étudiant doit être de la même classe que le cours
    if (student.classe !== course.classe) {
      return res.status(400).json({ 
        message: `Impossible d'inscrire ${student.name} (classe ${student.classe}) dans un cours de classe ${course.classe}.` 
      });
    }

    if (course.etudiants.some(e => e.toString() === studentId)) {
      return res.status(400).json({ message: "Étudiant déjà inscrit à ce cours." });
    }

    course.etudiants.push(studentId);
    await course.save();

    const populatedCourse = await Course.findById(courseId)
      .populate("etudiants", "name email");

    res.json({ message: "Étudiant inscrit avec succès.", course: populatedCourse });
  } catch (err) {
    console.error("Erreur enrollStudent:", err);
    res.status(500).json({ message: "Erreur serveur.", error: err.message });
  }
};

// Fonction pour qu'un étudiant quitte un cours (ou qu'un prof retire un étudiant)
exports.leaveCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { studentId } = req.body;
    const userId = req.user._id.toString();
    const userRole = req.user.role;

    if (!studentId) {
      return res.status(400).json({ message: "L'ID de l'étudiant est requis." });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Cours introuvable." });

    // Vérification d'autorisation
    if (userRole === "student") {
      // Un étudiant peut uniquement se désinscrire lui-même
      if (studentId !== userId) {
        return res.status(403).json({ message: "Non autorisé." });
      }
    } else if (["teacher", "prof"].includes(userRole)) {
      // Un prof doit être le propriétaire du cours pour désinscrire un étudiant
      if (course.teacher.toString() !== userId) {
        return res.status(403).json({ message: "Non autorisé." });
      }
    } else {
      // Autres rôles non autorisés
      return res.status(403).json({ message: "Non autorisé." });
    }

    // Suppression de l'étudiant dans la liste
    course.etudiants = course.etudiants.filter(id => id.toString() !== studentId);
    await course.save();

    res.json({ message: "Étudiant désinscrit du cours avec succès." });
  } catch (err) {
    console.error("Erreur leaveCourse:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Récupérer les stats du cours (ex: absences par étudiant)
exports.getStatsForCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId).populate("etudiants", "name email");

    if (!course) return res.status(404).json({ message: "Cours introuvable." });

    // Vérifie que le professeur est bien le propriétaire du cours
    if (["teacher", "prof"].includes(req.user.role) &&
        course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé." });
    }

    const absences = await Absence.find({ course: courseId });

    const absenceStats = course.etudiants.map(student => {
      const absencesForStudent = absences.filter(a => a.student.toString() === student._id.toString());
      const totalAbsences = absencesForStudent.reduce((sum, a) => sum + (a.duration || 0), 0);
      return {
        studentId: student._id,
        name: student.name,
        email: student.email,
        totalAbsences,
        absencesDetails: absencesForStudent
      };
    });

    res.json({
      course: {
        _id: course._id,
        nom: course.nom,
        classe: course.classe,
      },
      absenceStats
    });
  } catch (err) {
    console.error("Erreur getStatsForCourse:", err);
    res.status(500).json({ message: "Erreur serveur.", error: err.message });
  }
};

// --- FONCTIONNALITÉS NON IMPLÉMENTÉES ---

exports.getTodayCourses = async (req, res) => {
  res.status(501).json({ message: "Fonction getTodayCourses non implémentée" });
};

exports.uploadHomework = async (req, res) => {
  res.status(501).json({ message: "Fonction uploadHomework non implémentée" });
};

exports.getHomeworkSubmissions = async (req, res) => {
  res.status(501).json({ message: "Fonction getHomeworkSubmissions non implémentée" });
};

exports.updateNoteForStudent = async (req, res) => {
  res.status(501).json({ message: "Fonction updateNoteForStudent non implémentée" });
};

exports.createQuiz = async (req, res) => {
  res.status(501).json({ message: "Fonction createQuiz non implémentée" });
};

exports.getQuizzes = async (req, res) => {
  res.status(501).json({ message: "Fonction getQuizzes non implémentée" });
};

exports.updateQuiz = async (req, res) => {
  res.status(501).json({ message: "Fonction updateQuiz non implémentée" });
};

exports.deleteQuiz = async (req, res) => {
  res.status(501).json({ message: "Fonction deleteQuiz non implémentée" });
};

exports.postMessage = async (req, res) => {
  res.status(501).json({ message: "Fonction postMessage non implémentée" });
};

exports.getMessages = async (req, res) => {
  res.status(501).json({ message: "Fonction getMessages non implémentée" });
};

// --- NOUVELLE FONCTION AJOUTÉE ---

// Récupérer la liste des étudiants inscrits à un cours (pour interface prof par ex)
exports.getStudentsForCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId).populate("etudiants", "name email");
    if (!course) return res.status(404).json({ message: "Cours introuvable" });

    // Contrôle d'accès : 
    // Seulement prof, teacher, admin ou étudiant inscrit peuvent voir la liste
    const userRole = req.user.role;
    const userId = req.user._id.toString();

    if (["teacher", "prof", "admin"].includes(userRole)) {
      // si prof ou admin, vérifier qu'il est bien prof du cours (sauf admin)
      if (userRole !== "admin" && course.teacher.toString() !== userId) {
        return res.status(403).json({ message: "Non autorisé" });
      }
    } else if (userRole === "student") {
      // étudiant ne peut voir que s'il est inscrit
      if (!course.etudiants.some(e => e._id.toString() === userId)) {
        return res.status(403).json({ message: "Non autorisé" });
      }
    } else {
      // autres rôles non autorisés
      return res.status(403).json({ message: "Non autorisé" });
    }

    res.json(course.etudiants);
  } catch (err) {
    console.error("Erreur getStudentsForCourse:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// GET ALL COURSES FOR STUDENTS (tous les cours disponibles)
exports.getAllCoursesForStudents = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, classe } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Filtre par classe si spécifié
    if (classe) {
      query.classe = classe;
    }
    
    // Recherche
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { classe: regex },
        { semestre: regex },
        { nom: regex }
      ];
    }

    const [total, courses] = await Promise.all([
      Course.countDocuments(query),
      Course.find(query)
        .populate("teacher", "name email")
        .populate("matiere", "nom")
        .populate("etudiants", "name email")
        .populate({ path: "chapitres", options: { sort: { order: 1 } } })
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit))
    ]);

    res.json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      courses
    });
  } catch (err) {
    console.error("Erreur getAllCoursesForStudents:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET COURSES BY STUDENT CLASS (cours pour la classe de l'étudiant)
exports.getCoursesByStudentClass = async (req, res) => {
  try {
    const classe = req.user.classe?.trim();
    if (!classe) {
      return res.status(400).json({ message: "Classe de l'étudiant manquante" });
    }

    const { page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;

    let query = { classe };
    
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { nom: regex },
        { semestre: regex }
      ];
    }

    const [total, courses] = await Promise.all([
      Course.countDocuments(query),
      Course.find(query)
        .populate("teacher", "name email")
        .populate("matiere", "nom")
        .populate("etudiants", "name email")
        .populate({ path: "chapitres", options: { sort: { order: 1 } } })
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit))
    ]);

    res.json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      courses
    });
  } catch (err) {
    console.error("Erreur getCoursesByStudentClass:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET CHAPITRES D'UN COURS (pour les étudiants)
exports.getChapitresByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    if (!courseId) {
      return res.status(400).json({ message: "ID du cours requis" });
    }

    // Vérifier que le cours existe
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }

    // Récupérer les chapitres du cours
    const chapitres = await Chapitre.find({ course: courseId })
      .sort({ ordre: 1 })
      .populate('course', 'nom classe');

    res.json(chapitres);
  } catch (err) {
    console.error("Erreur getChapitresByCourse:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// === GESTION DEVOIRS ===

// Récupérer les devoirs d'un cours
exports.getDevoirsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate('teacher', 'name');
    
    if (!course) {
      return res.status(404).json({ message: "Cours introuvable" });
    }

    // Vérifier que l'étudiant est inscrit dans ce cours
    if (req.user.role === 'student') {
      const isEnrolled = course.etudiants.includes(req.user.id);
      if (!isEnrolled) {
        return res.status(403).json({ message: "Vous n'êtes pas inscrit dans ce cours" });
      }
    }

    res.json(course.devoirs || []);
  } catch (err) {
    console.error("Erreur getDevoirsByCourse:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Uploader un devoir pour un cours
exports.uploadDevoir = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Aucun fichier fourni" });
    }

    if (!title) {
      return res.status(400).json({ message: "Titre du devoir requis" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Cours introuvable" });
    }

    // Vérifier que le professeur est le propriétaire du cours
    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce cours" });
    }

    const devoir = {
      fileName: title,
      fileUrl: `/uploads/homeworks/${file.filename}`,
      dateEnvoi: new Date()
    };

    course.devoirs.push(devoir);
    await course.save();

    res.status(201).json({
      message: "Devoir uploadé avec succès",
      devoir
    });
  } catch (err) {
    console.error("Erreur uploadDevoir:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Soumettre un devoir (étudiant)
exports.submitDevoir = async (req, res) => {
  try {
    const { courseId, devoirId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Aucun fichier fourni" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Cours introuvable" });
    }

    // Vérifier que l'étudiant est inscrit dans ce cours
    const isEnrolled = course.etudiants.includes(req.user.id);
    if (!isEnrolled) {
      return res.status(403).json({ message: "Vous n'êtes pas inscrit dans ce cours" });
    }

    // Vérifier que le devoir existe
    const devoir = course.devoirs.id(devoirId);
    if (!devoir) {
      return res.status(404).json({ message: "Devoir introuvable" });
    }

    // Vérifier si l'étudiant a déjà soumis ce devoir
    const existingSubmission = course.soumissions.find(
      sub => sub.student.toString() === req.user.id && sub.devoirId === devoirId
    );

    if (existingSubmission) {
      return res.status(400).json({ message: "Vous avez déjà soumis ce devoir" });
    }

    const soumission = {
      student: req.user.id,
      fileName: file.originalname,
      fileUrl: `/uploads/homeworks/${file.filename}`,
      dateSoumission: new Date(),
      devoirId: devoirId
    };

    course.soumissions.push(soumission);
    await course.save();

    res.status(201).json({
      message: "Devoir soumis avec succès",
      soumission
    });
  } catch (err) {
    console.error("Erreur submitDevoir:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Récupérer les soumissions d'un devoir
exports.getDevoirSubmissions = async (req, res) => {
  try {
    const { courseId, devoirId } = req.params;

    const course = await Course.findById(courseId)
      .populate('soumissions.student', 'name email')
      .populate('teacher', 'name');

    if (!course) {
      return res.status(404).json({ message: "Cours introuvable" });
    }

    // Vérifier que le professeur est le propriétaire du cours
    if (course.teacher._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à voir les soumissions de ce cours" });
    }

    // Vérifier que le devoir existe
    const devoir = course.devoirs.id(devoirId);
    if (!devoir) {
      return res.status(404).json({ message: "Devoir introuvable" });
    }

    // Filtrer les soumissions pour ce devoir spécifique
    const submissions = course.soumissions.filter(
      sub => sub.devoirId === devoirId
    );

    res.json({
      devoir,
      submissions
    });
  } catch (err) {
    console.error("Erreur getDevoirSubmissions:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Noter une soumission
exports.gradeSubmission = async (req, res) => {
  try {
    const { courseId, devoirId, submissionId } = req.params;
    const { grade, comment } = req.body;

    if (!grade) {
      return res.status(400).json({ message: "Note requise" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Cours introuvable" });
    }

    // Vérifier que le professeur est le propriétaire du cours
    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à noter ce cours" });
    }

    // Trouver la soumission
    const soumission = course.soumissions.id(submissionId);
    if (!soumission) {
      return res.status(404).json({ message: "Soumission introuvable" });
    }

    // Vérifier que la soumission correspond au bon devoir
    if (soumission.devoirId !== devoirId) {
      return res.status(400).json({ message: "Soumission ne correspond pas au devoir" });
    }

    // Ajouter la note
    soumission.grade = grade;
    soumission.comment = comment;
    soumission.dateNotation = new Date();

    await course.save();

    res.json({
      message: "Note ajoutée avec succès",
      soumission
    });
  } catch (err) {
    console.error("Erreur gradeSubmission:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Upload global de devoir pour tous les cours du prof
exports.uploadGlobalDevoir = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Aucun fichier fourni" });
    }

    if (!title) {
      return res.status(400).json({ message: "Titre du devoir requis" });
    }

    // Récupérer tous les cours du professeur
    const courses = await Course.find({ teacher: req.user.id });
    
    if (courses.length === 0) {
      return res.status(404).json({ message: "Aucun cours trouvé pour ce professeur" });
    }

    const devoir = {
      fileName: title,
      fileUrl: `/uploads/homeworks/${file.filename}`,
      dateEnvoi: new Date()
    };

    // Ajouter le devoir à tous les cours du professeur
    const updatePromises = courses.map(course => {
      course.devoirs.push(devoir);
      return course.save();
    });

    await Promise.all(updatePromises);

    res.status(201).json({
      message: `Devoir uploadé avec succès pour ${courses.length} cours`,
      devoir,
      coursesCount: courses.length
    });
  } catch (err) {
    console.error("Erreur uploadGlobalDevoir:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
