/**
 * routes/courseRoutes.js
 * Routes for courses, chapitres, quizzes, homework, forum, etc.
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Controllers
const courseController = require('../controllers/courseController');
// Middleware
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Multer config for homework uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/homeworks'),
  filename: (req, file, cb) =>
    cb(
      null,
      Date.now() +
        '-' +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    )
});
const upload = multer({ storage });

// ----- COURSE ROUTES -----

// 1) Récupérer **uniquement** les cours du prof connecté
router.get(
  '/teacher',
  protect,
  authorizeRoles('teacher', 'prof'),
  courseController.getAllCourses
);

// 2) CRUD standard sur les cours
router.post(
  '/',
  protect,
  authorizeRoles('teacher', 'prof', 'admin'),
  courseController.createCourse
);
router.get('/', protect, courseController.getAllCourses);
router.get('/:id', protect, courseController.getCourseById);
router.put(
  '/:id',
  protect,
  authorizeRoles('teacher', 'prof'),
  courseController.updateCourse
);
router.delete(
  '/:id',
  protect,
  authorizeRoles('teacher', 'prof'),
  courseController.deleteCourse
);

// 3) Inscription / désinscription d’étudiant
router.post(
  '/:id/enroll',
  protect,
  authorizeRoles('teacher', 'prof'),
  courseController.enrollStudent
);
router.post(
  '/:id/leave',
  protect,
  authorizeRoles('student'),
  courseController.leaveCourse
);

// 4) Cours du jour & stats
router.get(
  '/today',
  protect,
  authorizeRoles('teacher', 'prof'),
  courseController.getTodayCourses
);
router.get(
  '/:id/stats',
  protect,
  authorizeRoles('teacher', 'prof'),
  courseController.getStatsForCourse
);

// 5) Devoirs
router.post(
  '/:id/homework',
  protect,
  authorizeRoles('teacher', 'prof'),
  upload.single('file'),
  courseController.uploadHomework
);
router.get(
  '/:id/homework/submissions',
  protect,
  authorizeRoles('teacher', 'prof'),
  courseController.getHomeworkSubmissions
);

// 6) Notes
router.put(
  '/:id/notes/:studentId',
  protect,
  authorizeRoles('teacher', 'prof'),
  courseController.updateNoteForStudent
);

// ----- CHAPITRE ROUTES -----
router.post(
  '/:id/chapitres',
  protect,
  authorizeRoles('teacher', 'prof'),
  courseController.addChapitreToCourse
);
router.put(
  '/:id/chapitres/:chapId',
  protect,
  authorizeRoles('teacher', 'prof'),
  courseController.updateChapitre
);
router.delete(
  '/:id/chapitres/:chapId',
  protect,
  authorizeRoles('teacher', 'prof'),
  courseController.removeChapitre
);

// ----- QUIZ ROUTES -----
router.post(
  '/:id/chapitres/:chapId/quiz',
  protect,
  authorizeRoles('teacher', 'prof'),
  courseController.createQuiz
);
router.get(
  '/:id/chapitres/:chapId/quiz',
  protect,
  courseController.getQuizzes
);
router.put(
  '/:id/chapitres/:chapId/quiz/:quizId',
  protect,
  authorizeRoles('teacher', 'prof'),
  courseController.updateQuiz
);
router.delete(
  '/:id/chapitres/:chapId/quiz/:quizId',
  protect,
  authorizeRoles('teacher', 'prof'),
  courseController.deleteQuiz
);

// ----- FORUM ROUTES -----
// Forum cours
router.post(
  '/:id/forum',
  protect,
  courseController.postMessage
);
router.get(
  '/:id/forum',
  protect,
  courseController.getMessages
);
// Forum chapitre
router.post(
  '/:id/chapitres/:chapId/forum',
  protect,
  courseController.postMessage
);
router.get(
  '/:id/chapitres/:chapId/forum',
  protect,
  courseController.getMessages
);

module.exports = router;
