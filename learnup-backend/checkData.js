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

const checkData = async () => {
  try {
    console.log('🔍 Vérification des données existantes...\n');
    
    // Vérifier les matières
    const matieres = await Matiere.find();
    console.log(`📚 Matières: ${matieres.length}`);
    matieres.forEach(m => console.log(`   - ${m.nom}`));
    
    // Vérifier les professeurs
    const teachers = await Teacher.find();
    console.log(`\n👨‍🏫 Professeurs: ${teachers.length}`);
    teachers.forEach(t => console.log(`   - ${t.name} (${t.email})`));
    
    // Vérifier les étudiants
    const students = await Student.find();
    console.log(`\n👨‍🎓 Étudiants: ${students.length}`);
    students.forEach(s => console.log(`   - ${s.name} (${s.email}) - Classe: ${s.classe}`));
    
    // Vérifier les cours
    const courses = await Course.find().populate('teacher').populate('matiere');
    console.log(`\n📖 Cours: ${courses.length}`);
    courses.forEach(c => {
      console.log(`   - ${c.nom} (${c.classe})`);
      console.log(`     Professeur: ${c.teacher?.name || 'Non assigné'}`);
      console.log(`     Matière: ${c.matiere?.nom || 'Non assignée'}`);
      console.log(`     Étudiants: ${c.etudiants?.length || 0}`);
    });
    
    // Vérifier les chapitres
    const chapitres = await Chapitre.find().populate('course');
    console.log(`\n📚 Chapitres: ${chapitres.length}`);
    chapitres.forEach(ch => {
      console.log(`   - ${ch.titre}`);
      console.log(`     Cours: ${ch.course?.nom || 'Cours inconnu'}`);
    });
    
    // Vérifier les quiz
    const quizs = await Quiz.find().populate('chapitre');
    console.log(`\n🎯 Quiz: ${quizs.length}`);
    quizs.forEach(q => {
      console.log(`   - Quiz pour: ${q.chapitre?.titre || 'Chapitre inconnu'}`);
      console.log(`     Questions: ${q.questions?.length || 0}`);
    });
    
    console.log('\n📊 Résumé:');
    console.log(`   - Matières: ${matieres.length}`);
    console.log(`   - Professeurs: ${teachers.length}`);
    console.log(`   - Étudiants: ${students.length}`);
    console.log(`   - Cours: ${courses.length}`);
    console.log(`   - Chapitres: ${chapitres.length}`);
    console.log(`   - Quiz: ${quizs.length}`);
    
    if (quizs.length === 0) {
      console.log('\n⚠️  Aucun quiz trouvé ! Exécutez createQuizData.js pour en créer.');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
};

const main = async () => {
  await connectDB();
  await checkData();
  process.exit(0);
};

main(); 