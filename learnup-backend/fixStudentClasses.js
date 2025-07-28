require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');
const Absence = require('./models/Absence');
const Course = require('./models/Course');

async function fixStudentClasses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');
    
    // Vérifier les étudiants
    console.log('\n👥 ÉTUDIANTS TROUVÉS:');
    const students = await Student.find().limit(10);
    
    students.forEach((student, index) => {
      console.log(`\n--- Étudiant ${index + 1} ---`);
      console.log('ID:', student._id);
      console.log('Nom:', student.name);
      console.log('Email:', student.email);
      console.log('Classe actuelle:', student.classe);
    });
    
    // Vérifier les cours
    console.log('\n📚 COURS TROUVÉS:');
    const courses = await Course.find()
      .populate('matiere', 'nom')
      .limit(10);
    
    courses.forEach((course, index) => {
      console.log(`\n--- Cours ${index + 1} ---`);
      console.log('ID:', course._id);
      console.log('Nom:', course.nom);
      console.log('Matière:', course.matiere?.nom);
      console.log('Classe:', course.classe);
      console.log('Semestre:', course.semestre);
    });
    
    // Vérifier les absences avec les cours
    console.log('\n📊 ABSENCES AVEC COURS:');
    const absences = await Absence.find()
      .populate('student', 'name classe')
      .populate({
        path: 'course',
        select: 'nom matiere classe semestre',
        populate: {
          path: 'matiere',
          select: 'nom'
        }
      })
      .limit(5);
    
    absences.forEach((absence, index) => {
      console.log(`\n--- Absence ${index + 1} ---`);
      console.log('Étudiant:', absence.student?.name);
      console.log('Classe étudiant:', absence.student?.classe);
      console.log('Cours:', absence.course?.nom);
      console.log('Classe cours:', absence.course?.classe);
      console.log('Matière cours:', absence.course?.matiere?.nom);
    });
    
    // CORRECTION AUTOMATIQUE : Changer 5A en 6A
    console.log('\n🔧 CORRECTION AUTOMATIQUE DES CLASSES:');
    const studentsToUpdate = await Student.find({ classe: '5A' });
    
    if (studentsToUpdate.length > 0) {
      console.log(`Trouvé ${studentsToUpdate.length} étudiant(s) avec la classe 5A`);
      
      for (const student of studentsToUpdate) {
        console.log(`Correction de ${student.name} (${student.email}) : 5A → 6A`);
        await Student.findByIdAndUpdate(student._id, { classe: '6A' });
      }
      
      console.log('✅ Correction terminée !');
    } else {
      console.log('Aucun étudiant avec la classe 5A trouvé');
    }
    
    // Vérifier aussi les cours avec classe 5A
    const coursesToUpdate = await Course.find({ classe: '5A' });
    
    if (coursesToUpdate.length > 0) {
      console.log(`Trouvé ${coursesToUpdate.length} cours avec la classe 5A`);
      
      for (const course of coursesToUpdate) {
        console.log(`Correction du cours ${course.nom} : 5A → 6A`);
        await Course.findByIdAndUpdate(course._id, { classe: '6A' });
      }
      
      console.log('✅ Correction des cours terminée !');
    } else {
      console.log('Aucun cours avec la classe 5A trouvé');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

fixStudentClasses(); 