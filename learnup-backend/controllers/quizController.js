const Quiz = require("../models/Quiz");

// Obtenir les questions d’un cours
const getQuizByCourse = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ courseId: req.params.id });
    if (!quiz) return res.json([]);
    res.json(quiz.questions);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Ajouter une question
const addQuestion = async (req, res) => {
  const { question, options, correctIndex } = req.body;

  if (!question || !options || correctIndex === undefined) {
    return res.status(400).json({ message: "Champs requis manquants" });
  }

  try {
    let quiz = await Quiz.findOne({ courseId: req.params.id });

    if (!quiz) {
      quiz = new Quiz({ courseId: req.params.id, questions: [] });
    }

    quiz.questions.push({ question, options, correctIndex });
    await quiz.save();
    res.status(201).json({ message: "Question ajoutée", quiz });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer une question
const deleteQuestion = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ courseId: req.params.id });
    if (!quiz) return res.status(404).json({ message: "Quiz introuvable" });

    quiz.questions = quiz.questions.filter((q) => q._id.toString() !== req.params.qid);
    await quiz.save();
    res.json({ message: "Question supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getQuizByCourse,
  addQuestion,
  deleteQuestion,
};
