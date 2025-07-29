const mongoose = require('mongoose');
require('dotenv').config();

// Import des modèles
const Quiz = require('./models/Quiz');
const Chapitre = require('./models/Chapitre');
const Course = require('./models/Course');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB:', error);
    process.exit(1);
  }
};

const quickQuizTest = async () => {
  try {
    console.log('🔍 Vérification des quiz existants...');
    
    // Vérifier les cours
    const courses = await Course.find().populate('teacher').populate('matiere');
    console.log(`📚 ${courses.length} cours trouvés`);
    
    // Vérifier les chapitres
    const chapitres = await Chapitre.find().populate('course');
    console.log(`📖 ${chapitres.length} chapitres trouvés`);
    
    // Vérifier les quiz
    const quizs = await Quiz.find().populate('chapitre');
    console.log(`🎯 ${quizs.length} quiz trouvés`);
    
    if (quizs.length > 0) {
      console.log('\n📊 Détails des quiz:');
      quizs.forEach((quiz, index) => {
        console.log(`  ${index + 1}. Quiz pour chapitre: ${quiz.chapitre?.titre || 'Chapitre inconnu'}`);
        console.log(`     Questions: ${quiz.questions?.length || 0}`);
        console.log(`     ID: ${quiz._id}`);
        console.log('');
      });
    } else {
      console.log('\n❌ Aucun quiz trouvé. Création d\'un quiz de test...');
      
      // Créer un quiz de test si aucun n'existe
      if (chapitres.length > 0) {
        const testChapitre = chapitres[0];
        const testQuiz = await Quiz.create({
          chapitre: testChapitre._id,
          questions: [
            {
              question: "Question de test 1",
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctIndex: 0
            },
            {
              question: "Question de test 2", 
              options: ["Réponse 1", "Réponse 2", "Réponse 3", "Réponse 4"],
              correctIndex: 1
            }
          ]
        });
        
        console.log('✅ Quiz de test créé avec succès !');
        console.log(`   Chapitre: ${testChapitre.titre}`);
        console.log(`   Questions: ${testQuiz.questions.length}`);
        console.log(`   ID: ${testQuiz._id}`);
      } else {
        console.log('❌ Aucun chapitre trouvé pour créer un quiz de test');
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
};

const main = async () => {
  await connectDB();
  await quickQuizTest();
  process.exit(0);
};

main(); 