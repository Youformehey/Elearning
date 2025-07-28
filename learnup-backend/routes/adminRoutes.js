// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminCtrl    = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// ─── PUBLIC ───────────────────────────────────────────────────────────────────

// Créer un compte admin
// POST /api/admin/register
router.post('/register', adminCtrl.registerAdmin);

// Authentifier un admin
// POST /api/admin/login
router.post('/login', adminCtrl.loginAdmin);

// Profile Admin
// GET /api/admin/profile
router.get('/profile', protect, admin, adminCtrl.getAdminProfile);
// PUT /api/admin/profile
router.put('/profile', protect, admin, adminCtrl.updateAdminProfile);

// ─── PROTÉGÉ (nécessite token + rôle admin) ────────────────────────────────────

// ==== GESTION DES UTILISATEURS ====

// Étudiants
router.get   ('/students',            protect, admin, adminCtrl.getAllStudents);
router.get   ('/students/:id',        protect, admin, adminCtrl.getStudentById);
router.post  ('/students',            protect, admin, adminCtrl.createStudent);
router.put   ('/students/:id',        protect, admin, adminCtrl.updateStudent);
router.delete('/students/:id',        protect, admin, adminCtrl.deleteStudent);
router.post  ('/students/bulk',       protect, admin, adminCtrl.bulkActionStudents);

// Professeurs
router.get   ('/teachers',            protect, admin, adminCtrl.getAllTeachers);
router.get   ('/teachers/:id',        protect, admin, adminCtrl.getTeacherById);
router.post  ('/teachers',            protect, admin, adminCtrl.createTeacher);
router.put   ('/teachers/:id',        protect, admin, adminCtrl.updateTeacher);
router.delete('/teachers/:id',        protect, admin, adminCtrl.deleteTeacher);
router.post  ('/teachers/bulk',       protect, admin, adminCtrl.bulkActionTeachers);

// Parents
router.get   ('/parents',             protect, admin, adminCtrl.getAllParents);
router.get   ('/parents/:id',         protect, admin, adminCtrl.getParentById);
router.post  ('/parents',             protect, admin, adminCtrl.createParent);
router.put   ('/parents/:id',         protect, admin, adminCtrl.updateParent);
router.delete('/parents/:id',         protect, admin, adminCtrl.deleteParent);

// Administrateurs
router.get   ('/admins',              protect, admin, adminCtrl.getAllAdmins);
router.get   ('/admins/:id',          protect, admin, adminCtrl.getAdminById);
router.put   ('/admins/:id',          protect, admin, adminCtrl.updateAdmin);
router.delete('/admins/:id',          protect, admin, adminCtrl.deleteAdmin);

// ==== GESTION ACADÉMIQUE ====

// Classes
router.get   ('/classes',             protect, admin, adminCtrl.getAllClasses);
router.get   ('/classes/:id',         protect, admin, adminCtrl.getClassById);
router.post  ('/classes',             protect, admin, adminCtrl.createClass);
router.put   ('/classes/:id',         protect, admin, adminCtrl.updateClass);
router.delete('/classes/:id',         protect, admin, adminCtrl.deleteClass);
router.post  ('/classes/:id/students',protect, admin, adminCtrl.addStudentsToClass);
router.delete('/classes/:id/students',protect, admin, adminCtrl.removeStudentsFromClass);

// Matières
router.get   ('/subjects',            protect, admin, adminCtrl.getAllSubjects);
router.get   ('/subjects/:id',        protect, admin, adminCtrl.getSubjectById);
router.post  ('/subjects',            protect, admin, adminCtrl.createSubject);
router.put   ('/subjects/:id',        protect, admin, adminCtrl.updateSubject);
router.delete('/subjects/:id',        protect, admin, adminCtrl.deleteSubject);

// Cours
router.get   ('/courses',             protect, admin, adminCtrl.getAllCourses);
router.get   ('/courses/:id',         protect, admin, adminCtrl.getCourseById);
router.post  ('/courses',             protect, admin, adminCtrl.createCourse);
router.put   ('/courses/:id',         protect, admin, adminCtrl.updateCourse);
router.delete('/courses/:id',         protect, admin, adminCtrl.deleteCourse);

// Devoirs
router.get   ('/homework',            protect, admin, adminCtrl.getAllHomework);
router.get   ('/homework/:id',        protect, admin, adminCtrl.getHomeworkById);
router.post  ('/homework',            protect, admin, adminCtrl.createHomework);
router.put   ('/homework/:id',        protect, admin, adminCtrl.updateHomework);
router.delete('/homework/:id',        protect, admin, adminCtrl.deleteHomework);

// Examens
router.get   ('/exams',               protect, admin, adminCtrl.getAllExams);
router.get   ('/exams/:id',           protect, admin, adminCtrl.getExamById);
router.post  ('/exams',               protect, admin, adminCtrl.createExam);
router.put   ('/exams/:id',           protect, admin, adminCtrl.updateExam);
router.delete('/exams/:id',           protect, admin, adminCtrl.deleteExam);

// ==== GESTION DES DONNÉES ====

// Notes
router.get   ('/grades',              protect, admin, adminCtrl.getAllGrades);
router.get   ('/grades/student/:studentId', protect, admin, adminCtrl.getStudentGrades);
router.get   ('/grades/course/:courseId',   protect, admin, adminCtrl.getCourseGrades);
router.post  ('/grades',              protect, admin, adminCtrl.createGrade);
router.put   ('/grades/:id',          protect, admin, adminCtrl.updateGrade);
router.delete('/grades/:id',          protect, admin, adminCtrl.deleteGrade);
router.post  ('/grades/bulk',         protect, admin, adminCtrl.bulkUpdateGrades);

// Absences
router.get   ('/absences',            protect, admin, adminCtrl.getAllAbsences);
router.get   ('/absences/student/:studentId', protect, admin, adminCtrl.getStudentAbsences);
router.get   ('/absences/course/:courseId',   protect, admin, adminCtrl.getCourseAbsences);
router.post  ('/absences',            protect, admin, adminCtrl.createAbsence);
router.put   ('/absences/:id',        protect, admin, adminCtrl.updateAbsence);
router.delete('/absences/:id',        protect, admin, adminCtrl.deleteAbsence);

// Rappels
router.get   ('/reminders',           protect, admin, adminCtrl.getAllReminders);
router.get   ('/reminders/:id',       protect, admin, adminCtrl.getReminderById);
router.post  ('/reminders',           protect, admin, adminCtrl.createReminder);
router.put   ('/reminders/:id',       protect, admin, adminCtrl.updateReminder);
router.delete('/reminders/:id',       protect, admin, adminCtrl.deleteReminder);

// Demandes
router.get   ('/requests',            protect, admin, adminCtrl.getAllRequests);
router.get   ('/requests/:id',        protect, admin, adminCtrl.getRequestById);
router.put   ('/requests/:id',        protect, admin, adminCtrl.updateRequest);
router.delete('/requests/:id',        protect, admin, adminCtrl.deleteRequest);

// Formations
router.get   ('/trainings',           protect, admin, adminCtrl.getAllTrainings);
router.get   ('/trainings/:id',       protect, admin, adminCtrl.getTrainingById);
router.post  ('/trainings',           protect, admin, adminCtrl.createTraining);
router.put   ('/trainings/:id',       protect, admin, adminCtrl.updateTraining);
router.delete('/trainings/:id',       protect, admin, adminCtrl.deleteTraining);

// ==== SYSTÈME ====

// Configuration
router.get   ('/settings',            protect, admin, adminCtrl.getSettings);
router.put   ('/settings',            protect, admin, adminCtrl.updateSettings);
router.get   ('/settings/backup',     protect, admin, adminCtrl.createBackup);
router.post  ('/settings/restore',    protect, admin, adminCtrl.restoreBackup);

// Logs
router.get   ('/logs',                protect, admin, adminCtrl.getLogs);
router.get   ('/logs/error',          protect, admin, adminCtrl.getErrorLogs);
router.get   ('/logs/access',         protect, admin, adminCtrl.getAccessLogs);
router.delete('/logs',                protect, admin, adminCtrl.clearLogs);

// Sécurité
router.get   ('/security/status',     protect, admin, adminCtrl.getSecurityStatus);
router.post  ('/security/scan',       protect, admin, adminCtrl.securityScan);
router.get   ('/security/users',      protect, admin, adminCtrl.getSecurityUsers);
router.post  ('/security/block/:userId',   protect, admin, adminCtrl.blockUser);
router.post  ('/security/unblock/:userId', protect, admin, adminCtrl.unblockUser);

// Maintenance
router.post  ('/maintenance/enable',  protect, admin, adminCtrl.enableMaintenance);
router.post  ('/maintenance/disable', protect, admin, adminCtrl.disableMaintenance);
router.get   ('/maintenance/status',  protect, admin, adminCtrl.getMaintenanceStatus);

// ==== ANALYTICS & RAPPORTS ====

// Statistiques
router.get   ('/analytics/overview',  protect, admin, adminCtrl.getAnalyticsOverview);
router.get   ('/analytics/users',     protect, admin, adminCtrl.getUserAnalytics);
router.get   ('/analytics/academic',  protect, admin, adminCtrl.getAcademicAnalytics);
router.get   ('/analytics/system',    protect, admin, adminCtrl.getSystemAnalytics);

// Rapports
router.get   ('/reports/users',       protect, admin, adminCtrl.generateUserReport);
router.get   ('/reports/academic',    protect, admin, adminCtrl.generateAcademicReport);
router.get   ('/reports/financial',   protect, admin, adminCtrl.generateFinancialReport);
router.get   ('/reports/system',      protect, admin, adminCtrl.generateSystemReport);

// Métriques
router.get   ('/metrics/performance', protect, admin, adminCtrl.getPerformanceMetrics);
router.get   ('/metrics/usage',       protect, admin, adminCtrl.getUsageMetrics);
router.get   ('/metrics/errors',      protect, admin, adminCtrl.getErrorMetrics);

// ==== UTILITAIRES ====

// Import / Export
router.post  ('/import/users',        protect, admin, adminCtrl.importUsers);
router.get   ('/export/users',        protect, admin, adminCtrl.exportUsers);
router.post  ('/import/courses',      protect, admin, adminCtrl.importCourses);
router.get   ('/export/courses',      protect, admin, adminCtrl.exportCourses);

// Notifications
router.post  ('/notifications/send',  protect, admin, adminCtrl.sendNotification);
router.get   ('/notifications/history', protect, admin, adminCtrl.getNotificationHistory);

// Dashboard
router.get   ('/dashboard/stats',     protect, admin, adminCtrl.getDashboardStats);
router.get   ('/dashboard/activities',protect, admin, adminCtrl.getRecentActivities);
router.get   ('/dashboard/alerts',    protect, admin, adminCtrl.getSystemAlerts);

module.exports = router;
