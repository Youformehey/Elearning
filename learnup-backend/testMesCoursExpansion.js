const mongoose = require('mongoose');
require('dotenv').config();

// Import des modèles
const Course = require('./models/Course');
const Student = require('./models/Student');
const Absence = require('./models/Absence');
const Teacher = require('./models/Teacher');

async function testMesCoursExpansion() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');

    // 1. Lister tous les cours avec leurs étudiants
    console.log('\n📚 COURS AVEC ÉTUDIANTS:');
    const courses = await Course.find({}).populate('teacher').populate('matiere');
    
    for (const course of courses) {
      console.log(`\n--- Cours: ${course.nom} (${course._id}) ---`);
      console.log(`   Classe: ${course.classe}`);
      console.log(`   Matière: ${course.matiere?.nom || 'Non définie'}`);
      console.log(`   Professeur: ${course.teacher?.name || 'Non assigné'}`);
      
      // Récupérer les étudiants de ce cours
      const students = await Student.find({ courses: course._id });
      console.log(`   Étudiants: ${students.length}`);
      
      if (students.length > 0) {
        students.forEach((student, index) => {
          console.log(`     ${index + 1}. ${student.name} ${student.lastName} (${student.email})`);
        });
      } else {
        console.log('   ❌ Aucun étudiant inscrit');
      }
    }

    // 2. Lister toutes les absences
    console.log('\n📅 ABSENCES:');
    const absences = await Absence.find({})
      .populate('student', 'name lastName email')
      .populate('course', 'nom classe')
      .sort({ date: -1 });
    
    console.log(`Total absences: ${absences.length}`);
    
    if (absences.length > 0) {
      absences.slice(0, 10).forEach((absence, index) => {
        console.log(`${index + 1}. ${absence.student?.name} ${absence.student?.lastName}`);
        console.log(`   Cours: ${absence.course?.nom} (${absence.course?.classe})`);
        console.log(`   Date: ${absence.date} - Durée: ${absence.duree}h`);
        console.log(`   Justifiée: ${absence.justifiee ? 'Oui' : 'Non'}`);
        console.log('---');
      });
    } else {
      console.log('   ❌ Aucune absence enregistrée');
    }

    // 3. Statistiques par cours
    console.log('\n📊 STATISTIQUES PAR COURS:');
    for (const course of courses) {
      const courseAbsences = absences.filter(a => a.course?._id.toString() === course._id.toString());
      const totalHours = courseAbsences.reduce((sum, a) => sum + (a.duree || 2), 0);
      
      console.log(`\n--- ${course.nom} ---`);
      console.log(`   Absences: ${courseAbsences.length}`);
      console.log(`   Heures totales: ${totalHours}h`);
      
      // Grouper par étudiant
      const studentStats = {};
      courseAbsences.forEach(absence => {
        const studentId = absence.student?._id.toString();
        if (studentId) {
          if (!studentStats[studentId]) {
            studentStats[studentId] = {
              name: `${absence.student?.name} ${absence.student?.lastName}`,
              hours: 0,
              count: 0
            };
          }
          studentStats[studentId].hours += absence.duree || 2;
          studentStats[studentId].count += 1;
        }
      });
      
      Object.values(studentStats).forEach(stat => {
        console.log(`     ${stat.name}: ${stat.count} absences (${stat.hours}h)`);
      });
    }

    // 4. Test de l'API
    console.log('\n🧪 TEST DE L\'API:');
    console.log('Pour tester l\'API, utilisez:');
    console.log(`GET http://localhost:5001/api/absences/stats/{courseId}`);
    console.log('Headers: Authorization: Bearer {token}');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB');
  }
}

testMesCoursExpansion(); 