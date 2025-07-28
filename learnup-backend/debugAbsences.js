require('dotenv').config();
const mongoose = require('mongoose');
const Absence = require('./models/Absence');
const Course = require('./models/Course');
const Student = require('./models/Student');

async function debugAbsences() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');
    
    // Récupérer quelques absences avec leurs cours
    const absences = await Absence.find()
      .populate({
        path: 'course',
        select: 'nom matiere classe semestre',
        populate: {
          path: 'matiere',
          select: 'nom'
        }
      })
      .populate('student', 'name email classe')
      .limit(10);
    
    console.log('\n📊 ABSENCES TROUVÉES:');
    absences.forEach((absence, index) => {
      console.log(`\n--- Absence ${index + 1} ---`);
      console.log('ID:', absence._id);
      console.log('Étudiant:', absence.student?.name, `(${absence.student?.classe})`);
      console.log('Date:', absence.date);
      console.log('Cours:', absence.course?.nom);
      console.log('Matière du cours:', absence.course?.matiere?.nom);
      console.log('Classe du cours:', absence.course?.classe);
      console.log('Semestre du cours:', absence.course?.semestre);
      console.log('Cours complet:', JSON.stringify(absence.course, null, 2));
    });
    
    // Vérifier les cours
    console.log('\n📚 COURS TROUVÉS:');
    const courses = await Course.find()
      .populate('matiere', 'nom')
      .limit(5);
    
    courses.forEach((course, index) => {
      console.log(`\n--- Cours ${index + 1} ---`);
      console.log('ID:', course._id);
      console.log('Nom:', course.nom);
      console.log('Matière:', course.matiere?.nom);
      console.log('Classe:', course.classe);
      console.log('Semestre:', course.semestre);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

debugAbsences(); 