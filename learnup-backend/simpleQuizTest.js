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

const createSimpleQuizTest = async () => {
  try {
    console.log('🚀 Création rapide de données de test...\n');
    
    // 1. Créer une matière si elle n'existe pas
    let matiere = await Matiere.findOne({ nom: 'Mathématiques' });
    if (!matiere) {
      console.log('📝 Création de la matière Mathématiques...');
      matiere = await Matiere.create({
        nom: 'Mathématiques',
        code: 'MATH',
        description: 'Mathématiques pour la 6ème'
      });
    }
    
    // 2. Créer un professeur si il n'existe pas
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
    
    // 3. Créer un étudiant si il n'existe pas
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
    
    // 4. Créer un cours si il n'existe pas
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
    
    // 5. Créer des chapitres
    console.log('📖 Création des chapitres...');
    const chapitresData = [
      {
        titre: 'Chapitre 1 - Les nombres entiers',
        description: 'Introduction aux nombres entiers',
        course: course._id,
        ordre: 1
      },
      {
        titre: 'Chapitre 2 - Les opérations',
        description: 'Addition, soustraction, multiplication',
        course: course._id,
        ordre: 2
      },
      {
        titre: 'Chapitre 3 - La géométrie',
        description: 'Formes géométriques de base',
        course: course._id,
        ordre: 3
      }
    ];
    
    const chapitres = [];
    for (const chapitreData of chapitresData) {
      let chapitre = await Chapitre.findOne({ titre: chapitreData.titre });
      if (!chapitre) {
        chapitre = await Chapitre.create(chapitreData);
        console.log(`   ✅ Chapitre créé: ${chapitre.titre}`);
      }
      chapitres.push(chapitre);
    }
    
    // 6. Créer des quiz pour chaque chapitre
    console.log('🎯 Création des quiz...');
    const quizQuestions = [
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
    ];
    
    for (const chapitre of chapitres) {
      let quiz = await Quiz.findOne({ chapitre: chapitre._id });
      if (!quiz) {
        quiz = await Quiz.create({
          chapitre: chapitre._id,
          questions: quizQuestions
        });
        console.log(`   ✅ Quiz créé pour: ${chapitre.titre} (${quizQuestions.length} questions)`);
      }
    }
    
    console.log('\n🎉 Données de test créées avec succès !');
    console.log('📊 Résumé:');
    console.log(`   - Matière: ${matiere.nom}`);
    console.log(`   - Professeur: ${teacher.name}`);
    console.log(`   - Étudiant: ${student.name}`);
    console.log(`   - Cours: ${course.nom}`);
    console.log(`   - Chapitres: ${chapitres.length}`);
    console.log(`   - Quiz: ${chapitres.length} (1 par chapitre)`);
    
    console.log('\n🔗 Informations de connexion:');
    console.log(`   Étudiant: ${student.email} / password123`);
    console.log(`   Professeur: ${teacher.email} / password123`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error);
  }
};

const main = async () => {
  await connectDB();
  await createSimpleQuizTest();
  process.exit(0);
};

main(); 