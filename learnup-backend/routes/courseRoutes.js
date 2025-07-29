const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const courseController = require('../controllers/courseController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const Seance = require('../models/Seance');

// Configuration Multer pour upload des devoirs
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/homeworks'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
});
const upload = multer({ storage });

// ----------- ROUTES ÉTUDIANTS -----------

// Récupérer tous les cours disponibles pour les étudiants
router.get('/student/all', protect, authorizeRoles('student'), courseController.getAllCoursesForStudents);

// Récupérer les cours pour la classe de l'étudiant
router.get('/student/class', protect, authorizeRoles('student'), courseController.getCoursesByStudentClass);

// Récupérer les chapitres d'un cours (pour les étudiants)
router.get('/:courseId/chapitres', protect, courseController.getChapitresByCourse);

// Récupérer la liste des étudiants d'un cours (pour interface prof par ex)
router.get('/:id/students', protect, courseController.getStudentsForCourse);

// ----------- ROUTES COURS -----------

// Récupérer tous les cours (prof, teacher) ou selon rôle
router.get('/teacher', protect, authorizeRoles('teacher', 'prof'), courseController.getAllCourses);
router.get('/', protect, courseController.getAllCourses);

// Créer un cours (prof, teacher, admin)
router.post('/', protect, authorizeRoles('teacher', 'prof', 'admin'), courseController.createCourse);

// Récupérer un cours par ID
router.get('/:id', protect, courseController.getCourseById);

// Mettre à jour un cours (prof, teacher)
router.put('/:id', protect, authorizeRoles('teacher', 'prof'), courseController.updateCourse);

// Supprimer un cours (prof, teacher)
router.delete('/:id', protect, authorizeRoles('teacher', 'prof'), courseController.deleteCourse);

// Inscription / désinscription d'un étudiant à un cours
// Étudiant se désinscrit lui-même
router.post('/:id/leave', protect, authorizeRoles('student'), courseController.leaveCourse);

// Prof/teacher supprime un étudiant du cours (droit réservé)
// Prof/teacher supprime un étudiant du cours (droit réservé)
router.post('/:id/leave-student', protect, authorizeRoles('teacher', 'prof'), courseController.leaveCourse);


// Inscrire un étudiant (prof, teacher)
router.post('/:id/enroll', protect, authorizeRoles('teacher', 'prof'), courseController.enrollStudent);

// Statistiques absences pour un cours
router.get('/:id/absences', protect, authorizeRoles('teacher', 'prof'), courseController.getStatsForCourse);
router.get('/:id/stats', protect, authorizeRoles('teacher', 'prof'), courseController.getStatsForCourse);

// Cours du jour (prof, teacher)
router.get('/today', protect, authorizeRoles('teacher', 'prof'), courseController.getTodayCourses);

// Gestion des devoirs (upload, soumissions)
router.post('/:id/homework', protect, authorizeRoles('teacher', 'prof'), upload.single('file'), courseController.uploadHomework);
router.get('/:id/homework/submissions', protect, authorizeRoles('teacher', 'prof'), courseController.getHomeworkSubmissions);

// Notes des étudiants sur un cours
router.put('/:id/notes/:studentId', protect, authorizeRoles('teacher', 'prof'), courseController.updateNoteForStudent);

// ----------- ROUTES CHAPITRES -----------

// Ajouter un chapitre à un cours
router.post('/:id/chapitres', protect, authorizeRoles('teacher', 'prof'), courseController.addChapitreToCourse);

// Mettre à jour un chapitre
router.put('/:id/chapitres/:chapId', protect, authorizeRoles('teacher', 'prof'), courseController.updateChapitre);

// Supprimer un chapitre du cours (simple)
router.delete('/:id/chapitres/:chapId', protect, authorizeRoles('teacher', 'prof'), courseController.removeChapitre);

// Supprimer un chapitre (route spécialisée)
router.delete('/:courseId/chapitres/:chapitreId', protect, authorizeRoles('teacher', 'prof'), courseController.deleteChapitreFromCourse);

// ----------- ROUTES DEVOIRS -----------

// Upload global de devoir (pour tous les cours du prof)
router.post('/devoirs/global', protect, authorizeRoles('teacher', 'prof'), upload.single('file'), courseController.uploadGlobalDevoir);

// Récupérer les devoirs d'un cours (pour les étudiants)
router.get('/:courseId/devoirs', protect, courseController.getDevoirsByCourse);

// Uploader un devoir pour un cours (professeur)
router.post('/:courseId/devoirs', protect, authorizeRoles('teacher', 'prof'), upload.single('file'), courseController.uploadDevoir);

// Soumettre un devoir (étudiant)
router.post('/:courseId/devoirs/:devoirId/submit', protect, authorizeRoles('student'), upload.single('file'), courseController.submitDevoir);

// Récupérer les soumissions d'un devoir (professeur)
router.get('/:courseId/devoirs/:devoirId/submissions', protect, authorizeRoles('teacher', 'prof'), courseController.getDevoirSubmissions);

// Noter une soumission (professeur)
router.post('/:courseId/devoirs/:devoirId/submissions/:submissionId/grade', protect, authorizeRoles('teacher', 'prof'), courseController.gradeSubmission);

// ----------- ROUTES QUIZ -----------

// Créer un quiz pour un chapitre
router.post('/:id/chapitres/:chapId/quiz', protect, authorizeRoles('teacher', 'prof'), courseController.createQuiz);

// Récupérer les quiz d’un chapitre
router.get('/:id/chapitres/:chapId/quiz', protect, courseController.getQuizzes);

// Mettre à jour un quiz
router.put('/:id/chapitres/:chapId/quiz/:quizId', protect, authorizeRoles('teacher', 'prof'), courseController.updateQuiz);

// Supprimer un quiz
router.delete('/:id/chapitres/:chapId/quiz/:quizId', protect, authorizeRoles('teacher', 'prof'), courseController.deleteQuiz);

// ----------- ROUTES FORUM -----------

// Poster un message dans le forum d'un cours
router.post('/:id/forum', protect, courseController.postMessage);

// Récupérer les messages du forum d'un cours
router.get('/:id/forum', protect, courseController.getMessages);

// Poster un message dans le forum d'un chapitre
router.post('/:id/chapitres/:chapId/forum', protect, courseController.postMessage);

// Récupérer les messages du forum d'un chapitre
router.get('/:id/chapitres/:chapId/forum', protect, courseController.getMessages);

// ----------- AUTRES -----------

// Route pour supprimer toutes les séances d'un cours
router.delete('/:courseId/seances', protect, authorizeRoles('teacher', 'prof'), async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // Vérifier que l'utilisateur est le professeur du cours
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Supprimer toutes les séances du cours
    const result = await Seance.deleteMany({ course: courseId });
    
    res.status(200).json({ 
      message: `${result.deletedCount} séance(s) supprimée(s) pour le cours ${course.nom}`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Erreur suppression séances:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression des séances',
      error: error.message 
    });
  }
});

// Route pour générer automatiquement les séances d'un cours
router.post('/:courseId/generate-seances', protect, authorizeRoles('teacher', 'prof'), async (req, res) => {
  try {
    console.log('Début génération séances pour courseId:', req.params.courseId);
    console.log('User ID:', req.user._id);
    
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId).populate('matiere');
    
    console.log('Course trouvé:', course ? 'Oui' : 'Non');
    if (course) {
      console.log('Course teacher:', course.teacher);
      console.log('Course details:', {
        nom: course.nom,
        classe: course.classe,
        horaire: course.horaire,
        duree: course.duree,
        salle: course.salle,
        groupe: course.groupe
      });
    }
    
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // Vérifier que l'utilisateur est le professeur du cours
    if (course.teacher.toString() !== req.user._id.toString()) {
      console.log('Accès refusé - Teacher mismatch');
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Vérifier si des séances existent déjà pour ce cours
    const existingSeances = await Seance.find({ course: courseId });
    if (existingSeances.length > 0) {
      return res.status(400).json({ 
        message: `Ce cours a déjà ${existingSeances.length} séance(s). Supprimez d'abord les séances existantes.` 
      });
    }

    // Générer 1 seule séance pour ce cours
    const seances = [];
    const startDate = new Date();
    startDate.setHours(8, 0, 0, 0); // Commencer à 8h du matin

    console.log('Génération de 1 séance pour le cours:', course.nom);

    // Éviter les weekends
    let seanceDate = new Date(startDate);
    while (seanceDate.getDay() === 0 || seanceDate.getDay() === 6) {
      seanceDate.setDate(seanceDate.getDate() + 1);
    }

    // Calculer l'heure de fin basée sur la durée
    const heureDebut = course.horaire || '08:00';
    const dureeMinutes = parseInt(course.duree || 120);
    
    // S'assurer que l'heure de début est valide
    let validHeureDebut = heureDebut;
    if (!heureDebut || heureDebut === 'Inval' || heureDebut === 'Invalid Date') {
      validHeureDebut = '08:00';
    }
    
    const heureDebutDate = new Date(`2000-01-01T${validHeureDebut}`);
    const heureFinDate = new Date(heureDebutDate.getTime() + (dureeMinutes * 60 * 1000));
    let heureFin = heureFinDate.toTimeString().slice(0, 5);
    
    // Vérifier que l'heure de fin est après l'heure de début
    if (heureFin <= validHeureDebut) {
      // Si l'heure de fin est avant l'heure de début, ajouter 2 heures
      const correctedEnd = new Date(heureDebutDate.getTime() + (2 * 60 * 60 * 1000));
      heureFin = correctedEnd.toTimeString().slice(0, 5);
    }

    const seanceData = {
      date: seanceDate,
      heureDebut: validHeureDebut,
      heureFin: heureFin,
      classe: course.classe || 'Classe non définie',
      course: courseId,
      professeur: req.user._id,
      salle: course.salle || 'Salle à définir',
      groupe: course.groupe || 'Groupe principal',
      fait: false
    };

    console.log('Séance générée:', seanceData);
    console.log('Heure début:', validHeureDebut);
    console.log('Heure fin calculée:', heureFin);
    console.log('Durée en minutes:', dureeMinutes);
    console.log('Course nom:', course.nom);
    console.log('Course classe:', course.classe);
    console.log('Course matiere:', course.matiere?.nom);
    console.log('Course ID:', courseId);
    seances.push(seanceData);

    console.log('Sauvegarde de', seances.length, 'séance...');
    
    // Sauvegarder la séance
    const savedSeances = await Seance.insertMany(seances);
    
    console.log('Séance sauvegardée:', savedSeances.length);

    res.status(201).json({ 
      message: `${seances.length} séance générée avec succès pour ${course.nom}`,
      seances: seances.length
    });

  } catch (error) {
    console.error('Erreur génération séances:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Erreur lors de la génération des séances',
      error: error.message 
    });
  }
});

module.exports = router;
