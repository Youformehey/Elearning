const mongoose = require('mongoose');
require('dotenv').config();

// Import des modèles
const Seance = require('./models/Seance');
const Course = require('./models/Course');
const Teacher = require('./models/Teacher');

async function testSeancesPlanning() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');

    // 1. Lister tous les professeurs
    console.log('\n👨‍🏫 PROFESSEURS:');
    const teachers = await Teacher.find({});
    console.log(`Nombre de professeurs: ${teachers.length}`);
    
    teachers.forEach((teacher, index) => {
      console.log(`${index + 1}. ID: ${teacher._id}`);
      console.log(`   Nom: ${teacher.name}`);
      console.log(`   Email: ${teacher.email}`);
      console.log(`   Role: ${teacher.role}`);
      console.log('---');
    });

    // 2. Lister tous les cours
    console.log('\n📚 COURS:');
    const courses = await Course.find({}).populate('teacher').populate('matiere');
    console.log(`Nombre de cours: ${courses.length}`);
    
    courses.forEach((course, index) => {
      console.log(`${index + 1}. ID: ${course._id}`);
      console.log(`   Nom: ${course.nom}`);
      console.log(`   Classe: ${course.classe}`);
      console.log(`   Matière: ${course.matiere?.nom || 'Non définie'}`);
      console.log(`   Professeur: ${course.teacher?.name || 'Non assigné'} (${course.teacher?._id})`);
      console.log(`   Durée: ${course.duree || 120} min`);
      console.log('---');
    });

    // 3. Lister toutes les séances
    console.log('\n📅 SÉANCES:');
    const seances = await Seance.find({})
      .populate('course')
      .populate('professeur')
      .sort({ date: 1 });
    
    console.log(`Nombre de séances: ${seances.length}`);
    
    seances.forEach((seance, index) => {
      console.log(`${index + 1}. ID: ${seance._id}`);
      console.log(`   Date: ${seance.date}`);
      console.log(`   Heure début: ${seance.heureDebut}`);
      console.log(`   Heure fin: ${seance.heureFin}`);
      console.log(`   Classe: ${seance.classe}`);
      console.log(`   Salle: ${seance.salle}`);
      console.log(`   Fait: ${seance.fait ? '✅ Oui' : '❌ Non'}`);
      console.log(`   Cours: ${seance.course?.nom || 'Non défini'} (${seance.course?._id})`);
      console.log(`   Professeur: ${seance.professeur?.name || 'Non assigné'} (${seance.professeur?._id})`);
      console.log('---');
    });

    // 4. Tester le marquage d'une séance
    if (seances.length > 0) {
      const testSeance = seances[0];
      console.log('\n🧪 TEST DE MARQUAGE:');
      console.log(`Séance test: ${testSeance._id}`);
      console.log(`Statut actuel: ${testSeance.fait ? 'Fait' : 'Non fait'}`);
      
      // Simuler le marquage
      testSeance.fait = !testSeance.fait;
      await testSeance.save();
      console.log(`Nouveau statut: ${testSeance.fait ? 'Fait' : 'Non fait'}`);
      
      // Remettre l'état original
      testSeance.fait = !testSeance.fait;
      await testSeance.save();
      console.log('✅ Test de marquage réussi');
    }

    // 5. Statistiques
    console.log('\n📊 STATISTIQUES:');
    const totalSeances = seances.length;
    const seancesFaites = seances.filter(s => s.fait).length;
    const seancesNonFaites = totalSeances - seancesFaites;
    
    console.log(`Total séances: ${totalSeances}`);
    console.log(`Séances faites: ${seancesFaites}`);
    console.log(`Séances non faites: ${seancesNonFaites}`);
    console.log(`Pourcentage fait: ${totalSeances > 0 ? Math.round((seancesFaites / totalSeances) * 100) : 0}%`);

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB');
  }
}

testSeancesPlanning(); 