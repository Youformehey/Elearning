const mongoose = require('mongoose');
const Teacher = require('./models/Teacher');
const Course = require('./models/Course');
const Student = require('./models/Student');
const Note = require('./models/Note');
const Matiere = require('./models/Matiere');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/learnup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDashboardData = async () => {
  try {
    console.log('🌱 Début du seeding des données pour le dashboard...');

    // 1. Créer des matières
    const matieres = await Matiere.create([
      { nom: 'Mathématiques', description: 'Algèbre et géométrie' },
      { nom: 'Physique', description: 'Mécanique et électricité' },
      { nom: 'Chimie', description: 'Chimie générale et organique' },
      { nom: 'Informatique', description: 'Programmation et algorithmes' },
      { nom: 'Anglais', description: 'Langue anglaise' }
    ]);

    console.log('✅ Matières créées');

    // 2. Créer un professeur de test
    const prof = await Teacher.findOneAndUpdate(
      { email: 'prof@test.com' },
      {
        name: 'Dr. Martin Dubois',
        email: 'prof@test.com',
        password: 'password123',
        matiere: 'Mathématiques',
        tel: '0123456789',
        adresse: '123 Rue de l\'Éducation, Paris'
      },
      { upsert: true, new: true }
    );

    console.log('✅ Professeur créé:', prof.email);

    // 3. Créer des étudiants
    const students = await Student.create([
      { name: 'Alice Martin', email: 'alice@student.com', password: 'password123', classe: 'Terminale S' },
      { name: 'Bob Dupont', email: 'bob@student.com', password: 'password123', classe: 'Terminale S' },
      { name: 'Claire Leroy', email: 'claire@student.com', password: 'password123', classe: 'Terminale S' },
      { name: 'David Moreau', email: 'david@student.com', password: 'password123', classe: 'Terminale S' },
      { name: 'Emma Petit', email: 'emma@student.com', password: 'password123', classe: 'Terminale S' },
      { name: 'François Roux', email: 'francois@student.com', password: 'password123', classe: 'Terminale S' },
      { name: 'Gabrielle Simon', email: 'gabrielle@student.com', password: 'password123', classe: 'Terminale S' },
      { name: 'Hugo Michel', email: 'hugo@student.com', password: 'password123', classe: 'Terminale S' }
    ]);

    console.log('✅ Étudiants créés');

    // 4. Créer des cours
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfterTomorrow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    const courses = await Course.create([
      {
        nom: 'Algèbre linéaire',
        matiere: matieres[0]._id, // Mathématiques
        classe: 'Terminale S',
        semestre: 'S1',
        horaire: '14:00',
        date: tomorrow,
        salle: 'Salle 201',
        groupe: 'Groupe A',
        duree: 120,
        teacher: prof._id,
        etudiants: students.slice(0, 4).map(s => s._id),
        documents: [
          { fileName: 'Cours_Algèbre_1.pdf', fileUrl: '/uploads/cours_algebre_1.pdf' },
          { fileName: 'Exercices_Algèbre.pdf', fileUrl: '/uploads/exercices_algebre.pdf' }
        ],
        devoirs: [
          { fileName: 'Devoir_Algèbre_1.pdf', fileUrl: '/uploads/devoir_algebre_1.pdf', dateEnvoi: new Date() }
        ]
      },
      {
        nom: 'Géométrie analytique',
        matiere: matieres[0]._id, // Mathématiques
        classe: 'Terminale S',
        semestre: 'S1',
        horaire: '10:00',
        date: dayAfterTomorrow,
        salle: 'Salle 105',
        groupe: 'Groupe B',
        duree: 120,
        teacher: prof._id,
        etudiants: students.slice(4, 8).map(s => s._id),
        documents: [
          { fileName: 'Cours_Géométrie.pdf', fileUrl: '/uploads/cours_geometrie.pdf' }
        ],
        devoirs: [
          { fileName: 'Devoir_Géométrie.pdf', fileUrl: '/uploads/devoir_geometrie.pdf', dateEnvoi: new Date() }
        ]
      },
      {
        nom: 'Calcul différentiel',
        matiere: matieres[0]._id, // Mathématiques
        classe: 'Terminale S',
        semestre: 'S1',
        horaire: '16:00',
        date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        salle: 'Salle 203',
        groupe: 'Groupe C',
        duree: 120,
        teacher: prof._id,
        etudiants: students.map(s => s._id),
        documents: [
          { fileName: 'Cours_Calcul.pdf', fileUrl: '/uploads/cours_calcul.pdf' },
          { fileName: 'TD_Calcul.pdf', fileUrl: '/uploads/td_calcul.pdf' }
        ]
      },
      {
        nom: 'Probabilités',
        matiere: matieres[0]._id, // Mathématiques
        classe: 'Terminale S',
        semestre: 'S1',
        horaire: '08:00',
        date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        salle: 'Salle 301',
        groupe: 'Groupe A',
        duree: 120,
        teacher: prof._id,
        etudiants: students.slice(0, 4).map(s => s._id)
      },
      {
        nom: 'Statistiques',
        matiere: matieres[0]._id, // Mathématiques
        classe: 'Terminale S',
        semestre: 'S1',
        horaire: '13:00',
        date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        salle: 'Salle 205',
        groupe: 'Groupe B',
        duree: 120,
        teacher: prof._id,
        etudiants: students.slice(4, 8).map(s => s._id)
      }
    ]);

    console.log('✅ Cours créés');

    // 5. Créer des notes
    const notes = [];
    for (const course of courses) {
      for (const studentId of course.etudiants) {
        notes.push({
          student: studentId,
          course: course._id,
          professeur: prof._id,
          note: Math.floor(Math.random() * 40) + 60, // Notes entre 60 et 100
          type: 'Contrôle',
          date: new Date(),
          commentaire: 'Bon travail'
        });
      }
    }

    await Note.create(notes);
    console.log('✅ Notes créées');

    // 6. Mettre à jour les étudiants avec leurs cours
    for (const student of students) {
      const studentCourses = courses.filter(course => 
        course.etudiants.includes(student._id)
      );
      await Student.findByIdAndUpdate(student._id, {
        courses: studentCourses.map(c => c._id)
      });
    }

    console.log('✅ Étudiants mis à jour avec leurs cours');

    // Afficher un résumé
    console.log('\n📊 Résumé des données créées:');
    console.log(`- ${matieres.length} matières`);
    console.log(`- 1 professeur (${prof.email})`);
    console.log(`- ${students.length} étudiants`);
    console.log(`- ${courses.length} cours`);
    console.log(`- ${notes.length} notes`);

    console.log('\n🎯 Pour tester le dashboard:');
    console.log(`- Connectez-vous avec: ${prof.email} / password123`);
    console.log('- Ou utilisez votre email de professeur existant');

    console.log('\n✅ Seeding terminé avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Exécuter le script
seedDashboardData(); 