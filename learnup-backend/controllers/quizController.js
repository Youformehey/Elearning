const Quiz = require("../models/Quiz");
const Chapitre = require("../models/Chapitre");
const Course = require("../models/Course");

// Obtenir le quiz d'un chapitre
const getQuizByChapitre = async (req, res) => {
  try {
    const { chapitreId } = req.params;
    console.log("🔍 getQuizByChapitre - chapitreId:", chapitreId);
    console.log("🔍 getQuizByChapitre - user:", req.user);
    
    // Vérifier que le chapitre existe
    const chapitre = await Chapitre.findById(chapitreId);
    if (!chapitre) {
      console.log("❌ Chapitre introuvable:", chapitreId);
      return res.status(404).json({ message: "Chapitre introuvable" });
    }
    console.log("✅ Chapitre trouvé:", chapitre.titre);

    // Vérifier les permissions
    const course = await Course.findById(chapitre.course);
    if (!course) {
      return res.status(404).json({ message: "Cours introuvable" });
    }

    // Si c'est un étudiant, vérifier qu'il est inscrit au cours
    if (req.user.role === "student") {
      console.log("🔍 Vérification étudiant - user ID:", req.user._id);
      console.log("🔍 Vérification étudiant - course students:", course.etudiants.map(s => s.toString()));
      const isEnrolled = course.etudiants.some(studentId => 
        studentId.toString() === req.user._id.toString()
      );
      console.log("🔍 Étudiant inscrit:", isEnrolled);
      if (!isEnrolled) {
        console.log("❌ Étudiant non inscrit au cours");
        return res.status(403).json({ message: "Vous n'êtes pas inscrit à ce cours" });
      }
    }

    // Si c'est un professeur, vérifier qu'il enseigne ce cours
    if (req.user.role === "teacher" || req.user.role === "prof") {
      console.log("🔍 Vérification professeur - user ID:", req.user._id);
      console.log("🔍 Vérification professeur - course teacher:", course.teacher);
      const isTeacher = course.teacher.toString() === req.user._id.toString();
      console.log("🔍 Professeur du cours:", isTeacher);
      if (!isTeacher) {
        console.log("❌ Professeur n'enseigne pas ce cours");
        return res.status(403).json({ message: "Vous n'enseignez pas ce cours" });
      }
    }

    // Récupérer le quiz
    let quiz = await Quiz.findOne({ chapitreId });
    console.log("🔍 Quiz trouvé:", quiz);
    
    if (!quiz) {
      console.log("❌ Aucun quiz trouvé pour ce chapitre");
      return res.json({ 
        exists: false, 
        message: "Aucun quiz créé pour ce chapitre",
        questions: []
      });
    }

    console.log("✅ Quiz trouvé avec", quiz.questions.length, "questions");
    res.json({
      exists: true,
      quiz: {
        _id: quiz._id,
        chapitreId: quiz.chapitreId,
        questions: quiz.questions,
        createdAt: quiz.createdAt,
        updatedAt: quiz.updatedAt
      }
    });
  } catch (err) {
    console.error("Erreur getQuizByChapitre:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Créer un quiz pour un chapitre (professeur)
const createQuiz = async (req, res) => {
  try {
    const { chapitreId } = req.params;
    
    // Vérifier que le chapitre existe
    const chapitre = await Chapitre.findById(chapitreId);
    if (!chapitre) {
      return res.status(404).json({ message: "Chapitre introuvable" });
    }

    // Vérifier que le professeur enseigne ce cours
    const course = await Course.findById(chapitre.course);
    if (!course) {
      return res.status(404).json({ message: "Cours introuvable" });
    }

    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Vous n'enseignez pas ce cours" });
    }

    // Vérifier si un quiz existe déjà
    const existingQuiz = await Quiz.findOne({ chapitreId });
    if (existingQuiz) {
      return res.status(400).json({ message: "Un quiz existe déjà pour ce chapitre" });
    }

    // Créer le quiz
    const quiz = new Quiz({
      chapitreId,
      questions: []
    });

    await quiz.save();

    res.status(201).json({ 
      message: "Quiz créé avec succès", 
      quiz 
    });
  } catch (err) {
    console.error("Erreur createQuiz:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Ajouter une question au quiz (professeur)
const addQuestion = async (req, res) => {
  try {
    const { chapitreId } = req.params;
    const { question, options, correctIndex } = req.body;

    // Validation des données
    if (!question || !options || correctIndex === undefined) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    if (options.length < 2) {
      return res.status(400).json({ message: "Au moins 2 options sont requises" });
    }

    if (correctIndex < 0 || correctIndex >= options.length) {
      return res.status(400).json({ message: "Index de réponse correct invalide" });
    }

    // Vérifier les permissions
    const chapitre = await Chapitre.findById(chapitreId);
    if (!chapitre) {
      return res.status(404).json({ message: "Chapitre introuvable" });
    }

    const course = await Course.findById(chapitre.course);
    if (!course) {
      return res.status(404).json({ message: "Cours introuvable" });
    }

    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Vous n'enseignez pas ce cours" });
    }

    // Récupérer ou créer le quiz
    let quiz = await Quiz.findOne({ chapitreId });
    if (!quiz) {
      quiz = new Quiz({ chapitreId, questions: [] });
    }

    // Vérifier la limite de 3 questions
    if (quiz.questions.length >= 3) {
      return res.status(400).json({ message: "Maximum 3 questions par quiz" });
    }

    // Ajouter la question
    quiz.questions.push({
      question,
      options,
      correctIndex
    });

    await quiz.save();

    res.status(201).json({ 
      message: "Question ajoutée avec succès", 
      quiz 
    });
  } catch (err) {
    console.error("Erreur addQuestion:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer une question
const deleteQuestion = async (req, res) => {
  try {
    const { chapitreId, questionId } = req.params;

    // Vérifier les permissions
    const chapitre = await Chapitre.findById(chapitreId);
    if (!chapitre) {
      return res.status(404).json({ message: "Chapitre introuvable" });
    }

    const course = await Course.findById(chapitre.course);
    if (!course) {
      return res.status(404).json({ message: "Cours introuvable" });
    }

    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Vous n'enseignez pas ce cours" });
    }

    // Récupérer le quiz
    const quiz = await Quiz.findOne({ chapitreId });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz introuvable" });
    }

    // Supprimer la question
    quiz.questions = quiz.questions.filter(q => q._id.toString() !== questionId);
    await quiz.save();

    res.json({ message: "Question supprimée avec succès" });
  } catch (err) {
    console.error("Erreur deleteQuestion:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Soumettre un quiz (étudiant)
const submitQuiz = async (req, res) => {
  try {
    const { chapitreId } = req.params;
    const { answers } = req.body; // { questionIndex: answerIndex }

    // Vérifier que l'étudiant est inscrit au cours
    const chapitre = await Chapitre.findById(chapitreId);
    if (!chapitre) {
      return res.status(404).json({ message: "Chapitre introuvable" });
    }

    const course = await Course.findById(chapitre.course);
    if (!course) {
      return res.status(404).json({ message: "Cours introuvable" });
    }

    const isEnrolled = course.etudiants.some(studentId => 
      studentId.toString() === req.user._id.toString()
    );
    if (!isEnrolled) {
      return res.status(403).json({ message: "Vous n'êtes pas inscrit à ce cours" });
    }

    // Récupérer le quiz
    const quiz = await Quiz.findOne({ chapitreId });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz introuvable" });
    }

    // Vérifier que toutes les questions ont été répondues
    if (Object.keys(answers).length < quiz.questions.length) {
      return res.status(400).json({ message: "Veuillez répondre à toutes les questions" });
    }

    // Calculer le score
    let score = 0;
    const results = [];

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctIndex;
      
      if (isCorrect) score++;
      
      results.push({
        questionIndex: index,
        userAnswer,
        correctAnswer: question.correctIndex,
        isCorrect,
        question: question.question,
        options: question.options
      });
    });

    const percentage = (score / quiz.questions.length) * 100;

    // Sauvegarder le résultat (optionnel - vous pouvez créer un modèle QuizResult)
    const result = {
      studentId: req.user._id,
      quizId: quiz._id,
      chapitreId,
      score,
      totalQuestions: quiz.questions.length,
      percentage,
      answers,
      submittedAt: new Date()
    };

    res.json({
      message: "Quiz soumis avec succès",
      result: {
        score,
        totalQuestions: quiz.questions.length,
        percentage,
        results
      }
    });
  } catch (err) {
    console.error("Erreur submitQuiz:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Obtenir les résultats d'un quiz (étudiant)
const getQuizResults = async (req, res) => {
  try {
    const { chapitreId } = req.params;

    // Vérifier que l'étudiant est inscrit au cours
    const chapitre = await Chapitre.findById(chapitreId);
    if (!chapitre) {
      return res.status(404).json({ message: "Chapitre introuvable" });
    }

    const course = await Course.findById(chapitre.course);
    if (!course) {
      return res.status(404).json({ message: "Cours introuvable" });
    }

    const isEnrolled = course.etudiants.some(studentId => 
      studentId.toString() === req.user._id.toString()
    );
    if (!isEnrolled) {
      return res.status(403).json({ message: "Vous n'êtes pas inscrit à ce cours" });
    }

    // Récupérer le quiz
    const quiz = await Quiz.findOne({ chapitreId });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz introuvable" });
    }

    res.json({
      quiz: {
        _id: quiz._id,
        questions: quiz.questions,
        totalQuestions: quiz.questions.length
      }
    });
  } catch (err) {
    console.error("Erreur getQuizResults:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getQuizByChapitre,
  createQuiz,
  addQuestion,
  deleteQuestion,
  submitQuiz,
  getQuizResults
};
