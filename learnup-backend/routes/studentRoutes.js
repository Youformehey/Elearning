const express = require('express');
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  getStudentProfile,
  getStudentCourses,
  getStudentRappels,
  markRappelFait,
  getStudentPlanning,
  getChapitresWithCourses,
  updateStudentProfile,
  getStudentNotes,
  getStudentAbsences,
  getStudentDashboard,
  getStudentFormations
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

// Routes publiques (pas besoin d'authentification)
router.post('/register', registerStudent);
router.post('/login', loginStudent);

// Routes protégées (nécessitent un token JWT valide)
router.get('/profile', protect, getStudentProfile);
router.get('/me', protect, getStudentProfile); // Alias pour /me
router.get('/dashboard', protect, getStudentDashboard); // Ajout de la route dashboard
router.get('/courses', protect, getStudentCourses);
router.get('/notes', protect, getStudentNotes);
router.get('/absences', protect, getStudentAbsences);
router.get('/rappels', protect, getStudentRappels);
router.put('/rappels/:rappelId/fait', protect, markRappelFait);
router.get('/planning', protect, getStudentPlanning);
router.get('/chapitres', protect, getChapitresWithCourses);
router.get('/formations', protect, getStudentFormations); // Ajout de la route formations
router.put('/profile', protect, updateStudentProfile);
router.put('/me', protect, updateStudentProfile); // Alias pour /me

module.exports = router;
