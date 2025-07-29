const QuizResponse = require('../models/QuizResponse');
const Quiz = require('../models/Quiz');
const mongoose = require('mongoose');

// Sauvegarder une réponse (sans soumettre le quiz)
exports.saveAnswer = async (req, res) => {
  try {
    console.log('🔍 === DÉBUT SAVE ANSWER ===');
    console.log('🔍 req.user:', req.user);
    console.log('🔍 req.params:', req.params);
    console.log('🔍 req.body:', req.body);
    
    const { quizId, chapitreId } = req.params;
    const { questionIndex, answerIndex } = req.body;
    const studentId = req.user._id;

    console.log('💾 Paramètres reçus:', { studentId, quizId, chapitreId, questionIndex, answerIndex });

    // Vérification simple des paramètres
    if (!studentId || !quizId || !chapitreId || questionIndex === undefined || answerIndex === undefined) {
      console.error('❌ Paramètres manquants:', { studentId, quizId, chapitreId, questionIndex, answerIndex });
      return res.status(400).json({ 
        success: false, 
        message: 'Paramètres manquants',
        params: { studentId, quizId, chapitreId, questionIndex, answerIndex }
      });
    }

    // Vérifier que les IDs sont valides
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      console.error('❌ studentId invalide:', studentId);
      return res.status(400).json({ success: false, message: 'ID étudiant invalide' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      console.error('❌ quizId invalide:', quizId);
      return res.status(400).json({ success: false, message: 'ID quiz invalide' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(chapitreId)) {
      console.error('❌ chapitreId invalide:', chapitreId);
      return res.status(400).json({ success: false, message: 'ID chapitre invalide' });
    }
    
    console.log('✅ Tous les IDs sont valides');

    // Vérifier que le quiz existe
    console.log('🔍 Vérification du quiz:', quizId);
    const quizExists = await Quiz.findById(quizId);
    if (!quizExists) {
      console.error('❌ Quiz non trouvé:', quizId);
      return res.status(404).json({ success: false, message: 'Quiz non trouvé' });
    }
    console.log('✅ Quiz trouvé:', quizExists._id);

    // Chercher ou créer une réponse existante
    console.log('🔍 Recherche QuizResponse existante...');
    let quizResponse = await QuizResponse.findOne({
      student: studentId,
      quiz: quizId,
      chapitre: chapitreId
    });

    console.log('🔍 QuizResponse trouvé:', quizResponse ? 'OUI' : 'NON');

    if (!quizResponse) {
      console.log('🔍 Création d\'une nouvelle QuizResponse');
      quizResponse = new QuizResponse({
        student: studentId,
        quiz: quizId,
        chapitre: chapitreId,
        answers: {}
      });
    }

    console.log('🔍 Mise à jour de la réponse:', { questionIndex, answerIndex });
    console.log('🔍 Types:', { 
      questionIndex: typeof questionIndex, 
      answerIndex: typeof answerIndex,
      questionIndexValue: questionIndex,
      answerIndexValue: answerIndex
    });
    
    // Mettre à jour la réponse - utiliser un objet simple
    quizResponse.answers[questionIndex] = answerIndex;
    console.log('🔍 Réponses après mise à jour:', quizResponse.answers);
    
    console.log('🔍 Sauvegarde en cours...');
    await quizResponse.save();
    console.log('✅ QuizResponse sauvegardée avec succès');

    console.log('📊 Réponses actuelles:', quizResponse.answers);

    console.log('✅ === FIN SAVE ANSWER ===');
    res.json({ 
      success: true, 
      message: 'Réponse sauvegardée',
      answers: quizResponse.answers
    });

  } catch (error) {
    console.error('❌ === ERREUR SAVE ANSWER ===');
    console.error('❌ Erreur:', error.message);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la sauvegarde',
      error: error.message
    });
  }
};

// Récupérer les réponses sauvegardées
exports.getAnswers = async (req, res) => {
  try {
    console.log('🔍 === DÉBUT GET ANSWERS ===');
    const { quizId, chapitreId } = req.params;
    const studentId = req.user._id;

    console.log('📂 Récupération réponses:', { studentId, quizId, chapitreId });

    const quizResponse = await QuizResponse.findOne({
      student: studentId,
      quiz: quizId,
      chapitre: chapitreId
    });

    if (quizResponse) {
      console.log('✅ Réponses trouvées en base de données');
      console.log('📊 Réponses:', quizResponse.answers);
      res.json({
        success: true,
        answers: quizResponse.answers,
        isSubmitted: quizResponse.isSubmitted
      });
    } else {
      console.log('❌ Aucune réponse trouvée en base de données');
      res.json({
        success: true,
        answers: {},
        isSubmitted: false
      });
    }

  } catch (error) {
    console.error('❌ Erreur récupération réponses:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération' 
    });
  }
};

// Soumettre le quiz final
exports.submitQuiz = async (req, res) => {
  try {
    console.log('🔍 === DÉBUT SUBMIT QUIZ ===');
    const { quizId, chapitreId } = req.params;
    const { answers } = req.body;
    const studentId = req.user._id;

    console.log('🎯 Soumission quiz:', { studentId, quizId, chapitreId, answers });

    // Récupérer le quiz pour calculer le score
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz non trouvé' });
    }

    // Calculer le score
    let score = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctIndex) {
        score++;
      }
    });

    // Sauvegarder ou mettre à jour la réponse
    let quizResponse = await QuizResponse.findOne({
      student: studentId,
      quiz: quizId,
      chapitre: chapitreId
    });

    if (!quizResponse) {
      quizResponse = new QuizResponse({
        student: studentId,
        quiz: quizId,
        chapitre: chapitreId,
        answers: {}
      });
    }

    // Mettre à jour avec toutes les réponses
    Object.entries(answers).forEach(([questionIndex, answerIndex]) => {
      quizResponse.answers[questionIndex] = answerIndex;
    });

    quizResponse.isSubmitted = true;
    quizResponse.score = score;
    quizResponse.totalQuestions = totalQuestions;
    quizResponse.submittedAt = new Date();

    await quizResponse.save();

    console.log('✅ Quiz soumis avec succès');
    res.json({
      success: true,
      result: {
        score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100)
      }
    });

  } catch (error) {
    console.error('❌ Erreur soumission quiz:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la soumission' 
    });
  }
}; 