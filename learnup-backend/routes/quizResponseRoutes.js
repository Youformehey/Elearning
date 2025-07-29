const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  saveAnswer,
  getAnswers,
  submitQuiz
} = require('../controllers/quizResponseController');

// Sauvegarder une réponse (étudiants seulement)
router.post('/:quizId/:chapitreId/answer', protect, authorizeRoles('student', 'etudiant'), saveAnswer);

// Récupérer les réponses sauvegardées (étudiants seulement)
router.get('/:quizId/:chapitreId/answers', protect, authorizeRoles('student', 'etudiant'), getAnswers);

// Soumettre le quiz final (étudiants seulement)
router.post('/:quizId/:chapitreId/submit', protect, authorizeRoles('student', 'etudiant'), submitQuiz);

// Route de test (sans authentification)
router.get('/test', (req, res) => {
  res.json({ message: 'Quiz Response API fonctionne !' });
});

module.exports = router; 