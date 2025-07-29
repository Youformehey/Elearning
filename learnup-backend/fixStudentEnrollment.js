const mongoose = require('mongoose');
require('dotenv').config();

// Modèles
const Student = require('./models/Student');
const Course = require('./models/Course');
const Chapitre = require('./models/Chapitre');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connecté');
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB:', error);
    process.exit(1);
  }
};

const fixStudentEnrollment = async () => {
  try {
    console.log('🔍 Vérification des inscriptions étudiants...');

    // Récupérer tous les étudiants
    const students = await Student.find({});
    console.log(`📊 ${students.length} étudiants trouvés`);

    // Récupérer tous les cours
    const courses = await Course.find({});
    console.log(`📚 ${courses.length} cours trouvés`);

    // Pour chaque étudiant, l'inscrire à tous les cours
    for (const student of students) {
      console.log(`\n👤 Traitement de l'étudiant: ${student.name}`);
      
      for (const course of courses) {
        // Vérifier si l'étudiant est déjà inscrit
        const isEnrolled = course.etudiants.includes(student._id);
        
        if (!isEnrolled) {
          // Ajouter l'étudiant au cours
          course.etudiants.push(student._id);
          await course.save();
          console.log(`  ✅ Inscrit au cours: ${course.nom}`);
        } else {
          console.log(`  ℹ️ Déjà inscrit au cours: ${course.nom}`);
        }
      }
    }

    // Vérifier les chapitres
    const chapitres = await Chapitre.find({}).populate('course');
    console.log(`\n📖 ${chapitres.length} chapitres trouvés`);

    for (const chapitre of chapitres) {
      if (chapitre.course) {
        console.log(`📝 Chapitre "${chapitre.titre}" -> Cours "${chapitre.course.nom}"`);
        console.log(`   Étudiants inscrits: ${chapitre.course.etudiants.length}`);
      }
    }

    console.log('\n✅ Correction des inscriptions terminée !');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
};

// Exécuter le script
connectDB().then(() => {
  fixStudentEnrollment();
}); 