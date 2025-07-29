const mongoose = require('mongoose');
require('dotenv').config();

// Import des modèles
const Matiere = require('./models/Matiere');
const Teacher = require('./models/Teacher');
const Student = require('./models/Student');
const Course = require('./models/Course');
const Chapitre = require('./models/Chapitre');
const Quiz = require('./models/Quiz');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB:', error);
    process.exit(1);
  }
};

const testQuizData = async () => {
  try {
    console.log('🔍 Vérification des données existantes...');
    
    // Vérifier les matières
    let matiere = await Matiere.findOne({ nom: 'Mathématiques' });
    if (!matiere) {
      console.log('📝 Création de la matière Mathématiques...');
      matiere = await Matiere.create({
        nom: 'Mathématiques',
        code: 'MATH',
        description: 'Mathématiques pour la 6ème'
      });
    }
    
    // Vérifier le professeur
    let teacher = await Teacher.findOne({ email: 'prof@test.com' });
    if (!teacher) {
      console.log('👨‍🏫 Création du professeur...');
      teacher = await Teacher.create({
        name: 'Professeur Test',
        email: 'prof@test.com',
        password: 'password123',
        matiere: matiere._id
      });
    }
    
    // Vérifier l'étudiant
    let student = await Student.findOne({ email: 'etudiant@test.com' });
    if (!student) {
      console.log('👨‍🎓 Création de l\'étudiant...');
      student = await Student.create({
        name: 'Étudiant Test',
        email: 'etudiant@test.com',
        password: 'password123',
        classe: '6A'
      });
    }
    
    // Vérifier le cours
    let course = await Course.findOne({ nom: 'Mathématiques - 6A' });
    if (!course) {
      console.log('📚 Création du cours...');
      course = await Course.create({
        nom: 'Mathématiques - 6A',
        description: 'Cours de mathématiques pour la 6ème A',
        classe: '6A',
        teacher: teacher._id,
        matiere: matiere._id,
        etudiants: [student._id]
      });
    }
    
    // Vérifier les chapitres
    let chapitre = await Chapitre.findOne({ titre: 'Chapitre 1 - Les nombres' });
    if (!chapitre) {
      console.log('📖 Création du chapitre...');
      chapitre = await Chapitre.create({
        titre: 'Chapitre 1 - Les nombres',
        description: 'Introduction aux nombres entiers et décimaux',
        course: course._id,
        ordre: 1
      });
    }
    
    // Vérifier le quiz
    let quiz = await Quiz.findOne({ chapitre: chapitre._id });
    if (!quiz) {
      console.log('🎯 Création du quiz...');
      quiz = await Quiz.create({
        chapitre: chapitre._id,
        questions: [
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
        ]
      });
    }
    
    console.log('✅ Données de test créées avec succès !');
    console.log('📊 Résumé:');
    console.log(`   - Matière: ${matiere.nom}`);
    console.log(`   - Professeur: ${teacher.name}`);
    console.log(`   - Étudiant: ${student.name}`);
    console.log(`   - Cours: ${course.nom}`);
    console.log(`   - Chapitre: ${chapitre.titre}`);
    console.log(`   - Quiz: ${quiz.questions.length} questions`);
    
    // Tester la récupération des quiz
    console.log('\n🔍 Test de récupération des quiz...');
    const quizResponse = await fetch(`http://localhost:5001/api/quiz/chapitre/${chapitre._id}`, {
      headers: { 
        'Authorization': `Bearer ${teacher.token || 'test-token'}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (quizResponse.ok) {
      const quizData = await quizResponse.json();
      console.log('✅ Quiz récupéré avec succès:', quizData.exists);
    } else {
      console.log('❌ Erreur lors de la récupération du quiz');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des données:', error);
  }
};

const main = async () => {
  await connectDB();
  await testQuizData();
  process.exit(0);
};

main(); 