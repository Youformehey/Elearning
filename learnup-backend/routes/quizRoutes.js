const express = require("express");
const router = express.Router();
const {
  getQuizByChapitre,
  createQuiz,
  addQuestion,
  deleteQuestion,
  submitQuiz,
  getQuizResults
} = require("../controllers/quizController");
const { protect } = require("../middleware/authMiddleware");

// Obtenir le quiz d'un chapitre
router.get("/chapitre/:chapitreId", protect, getQuizByChapitre);

// Créer un quiz pour un chapitre (professeur)
router.post("/chapitre/:chapitreId", protect, createQuiz);

// Ajouter une question au quiz (professeur)
router.post("/chapitre/:chapitreId/question", protect, addQuestion);

// Supprimer une question
router.delete("/chapitre/:chapitreId/question/:questionId", protect, deleteQuestion);

// Soumettre un quiz (étudiant)
router.post("/chapitre/:chapitreId/submit", protect, submitQuiz);

// Obtenir les résultats d'un quiz (étudiant)
router.get("/chapitre/:chapitreId/results", protect, getQuizResults);

module.exports = router;
