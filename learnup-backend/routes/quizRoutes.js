const express = require("express");
const router = express.Router();
const {
  getQuizByCourse,
  addQuestion,
  deleteQuestion,
} = require("../controllers/quizController");
const { protect } = require("../middleware/authMiddleware");

// Obtenir toutes les questions pour un cours
router.get("/:id", protect, getQuizByCourse);

// Ajouter une question (professeur)
router.post("/:id", protect, addQuestion);

// Supprimer une question
router.delete("/:id/:qid", protect, deleteQuestion);

module.exports = router;
