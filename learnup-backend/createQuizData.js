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

const createQuizData = async () => {
  try {
    console.log('🔍 Recherche des chapitres existants...');
    
    // Récupérer tous les chapitres
    const chapitres = await Chapitre.find().populate('course');
    console.log(`📖 ${chapitres.length} chapitres trouvés`);
    
    if (chapitres.length === 0) {
      console.log('❌ Aucun chapitre trouvé. Impossible de créer des quiz.');
      return;
    }
    
    // Créer des quiz pour chaque chapitre
    for (let i = 0; i < chapitres.length; i++) {
      const chapitre = chapitres[i];
      
      // Vérifier si un quiz existe déjà pour ce chapitre
      const existingQuiz = await Quiz.findOne({ chapitre: chapitre._id });
      
      if (!existingQuiz) {
        console.log(`🎯 Création d'un quiz pour: ${chapitre.titre}`);
        
        // Créer un quiz avec des questions basées sur le titre du chapitre
        const quizQuestions = [];
        
        if (chapitre.titre.toLowerCase().includes('math') || chapitre.titre.toLowerCase().includes('nombre')) {
          quizQuestions.push(
            {
              question: "Quel est le résultat de 5 + 3 ?",
              options: ["6", "7", "8", "9"],
              correctIndex: 2
            },
            {
              question: "Combien font 4 × 6 ?",
              options: ["20", "24", "28", "32"],
              correctIndex: 1
            },
            {
              question: "Quel est le double de 7 ?",
              options: ["12", "14", "16", "18"],
              correctIndex: 1
            }
          );
        } else if (chapitre.titre.toLowerCase().includes('français') || chapitre.titre.toLowerCase().includes('francais')) {
          quizQuestions.push(
            {
              question: "Quel est le pluriel de 'cheval' ?",
              options: ["chevals", "chevaux", "chevales", "cheval"],
              correctIndex: 1
            },
            {
              question: "Quelle est la nature du mot 'rapidement' ?",
              options: ["Nom", "Verbe", "Adverbe", "Adjectif"],
              correctIndex: 2
            },
            {
              question: "Combien de syllabes dans le mot 'électricité' ?",
              options: ["3", "4", "5", "6"],
              correctIndex: 2
            }
          );
        } else if (chapitre.titre.toLowerCase().includes('scien') || chapitre.titre.toLowerCase().includes('physique')) {
          quizQuestions.push(
            {
              question: "Quel est l'état de l'eau à 100°C ?",
              options: ["Solide", "Liquide", "Gaz", "Plasma"],
              correctIndex: 2
            },
            {
              question: "Quel est le symbole chimique de l'oxygène ?",
              options: ["O", "Ox", "O2", "Oxy"],
              correctIndex: 0
            },
            {
              question: "Quelle est la planète la plus proche du Soleil ?",
              options: ["Vénus", "Mercure", "Mars", "Terre"],
              correctIndex: 1
            }
          );
        } else {
          // Questions génériques
          quizQuestions.push(
            {
              question: "Quelle est la capitale de la France ?",
              options: ["Lyon", "Marseille", "Paris", "Toulouse"],
              correctIndex: 2
            },
            {
              question: "En quelle année a eu lieu la Révolution française ?",
              options: ["1789", "1799", "1809", "1819"],
              correctIndex: 0
            },
            {
              question: "Combien de côtés a un hexagone ?",
              options: ["4", "5", "6", "7"],
              correctIndex: 2
            }
          );
        }
        
        // Créer le quiz
        const newQuiz = await Quiz.create({
          chapitre: chapitre._id,
          questions: quizQuestions
        });
        
        console.log(`✅ Quiz créé avec ${quizQuestions.length} questions pour: ${chapitre.titre}`);
      } else {
        console.log(`⏭️ Quiz déjà existant pour: ${chapitre.titre}`);
      }
    }
    
    // Afficher le résumé final
    const totalQuizs = await Quiz.countDocuments();
    console.log(`\n🎉 Résumé final: ${totalQuizs} quiz créés au total !`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des quiz:', error);
  }
};

const main = async () => {
  await connectDB();
  await createQuizData();
  process.exit(0);
};

main(); 