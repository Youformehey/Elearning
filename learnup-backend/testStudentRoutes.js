const mongoose = require('mongoose');
require('dotenv').config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/learnup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Student = require('./models/Student');
const Note = require('./models/Note');
const Absence = require('./models/Absence');
const Course = require('./models/Course');
const Teacher = require('./models/Teacher');

async function testStudentRoutes() {
  try {
    console.log('🔍 Test des routes étudiant...\n');

    // 1. Vérifier si un étudiant existe
    const student = await Student.findOne({ email: 'khalil@gmail.com' });
    if (!student) {
      console.log('❌ Aucun étudiant trouvé avec khalil@gmail.com');
      console.log('📝 Création d\'un étudiant de test...');
      
      const testStudent = new Student({
        name: 'Test Student',
        email: 'test@gmail.com',
        password: 'password123',
        classe: '6ème A',
        role: 'student'
      });
      await testStudent.save();
      console.log('✅ Étudiant de test créé:', testStudent._id);
    } else {
      console.log('✅ Étudiant trouvé:', student._id);
    }

    // 2. Vérifier les notes
    console.log('\n📊 Test des notes...');
    const notes = await Note.find({ etudiant: student?._id || 'test' });
    console.log(`📝 Nombre de notes trouvées: ${notes.length}`);
    
    if (notes.length === 0) {
      console.log('⚠️  Aucune note trouvée - création de notes de test...');
      
      // Créer un cours de test
      const course = await Course.findOne() || new Course({
        nom: 'Mathématiques',
        description: 'Cours de mathématiques',
        classe: '6ème A'
      });
      await course.save();
      
      // Créer un prof de test
      const teacher = await Teacher.findOne() || new Teacher({
        name: 'Prof Test',
        email: 'prof@test.com',
        password: 'password123',
        matiere: 'Mathématiques',
        role: 'teacher'
      });
      await teacher.save();
      
      // Créer des notes de test
      const testNotes = [
        {
          etudiant: student?._id || 'test',
          cours: course._id,
          devoir: 'DS1',
          note: 15,
          enseignant: teacher._id
        },
        {
          etudiant: student?._id || 'test',
          cours: course._id,
          devoir: 'DM1',
          note: 18,
          enseignant: teacher._id
        }
      ];
      
      for (const noteData of testNotes) {
        const note = new Note(noteData);
        await note.save();
        console.log('✅ Note créée:', note.devoir, '-', note.note + '/20');
      }
    }

    // 3. Vérifier les absences
    console.log('\n📅 Test des absences...');
    const absences = await Absence.find({ student: student?._id || 'test' });
    console.log(`⏰ Nombre d'absences trouvées: ${absences.length}`);
    
    if (absences.length === 0) {
      console.log('⚠️  Aucune absence trouvée - création d\'absences de test...');
      
      const course = await Course.findOne();
      if (course) {
        const testAbsences = [
          {
            student: student?._id || 'test',
            course: course._id,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Il y a 7 jours
          },
          {
            student: student?._id || 'test',
            course: course._id,
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // Il y a 3 jours
          }
        ];
        
        for (const absenceData of testAbsences) {
          const absence = new Absence(absenceData);
          await absence.save();
          console.log('✅ Absence créée:', absence.date.toLocaleDateString());
        }
      }
    }

    console.log('\n🎉 Test terminé !');
    console.log('📋 Résumé:');
    console.log(`   - Étudiant: ${student ? 'Trouvé' : 'Créé'}`);
    console.log(`   - Notes: ${notes.length} existantes`);
    console.log(`   - Absences: ${absences.length} existantes`);

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    mongoose.connection.close();
  }
}

testStudentRoutes(); 