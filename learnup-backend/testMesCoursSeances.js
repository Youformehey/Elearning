const mongoose = require('mongoose');
require('dotenv').config();

// Import des modèles
const Seance = require('./models/Seance');
const Course = require('./models/Course');
const Teacher = require('./models/Teacher');

async function testMesCoursSeances() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');

    // 1. Lister tous les cours avec leurs séances
    console.log('\n📚 COURS AVEC SÉANCES:');
    const courses = await Course.find({}).populate('teacher').populate('matiere');
    
    for (const course of courses) {
      console.log(`\n--- Cours: ${course.nom} (${course._id}) ---`);
      console.log(`   Classe: ${course.classe}`);
      console.log(`   Matière: ${course.matiere?.nom || 'Non définie'}`);
      console.log(`   Professeur: ${course.teacher?.name || 'Non assigné'}`);
      
      // Récupérer les séances de ce cours
      const seances = await Seance.find({ course: course._id })
        .populate('course')
        .populate('professeur')
        .sort({ date: 1 });
      
      console.log(`   Séances: ${seances.length}`);
      
      if (seances.length > 0) {
        const seancesTerminees = seances.filter(s => s.fait).length;
        const seancesNonTerminees = seances.length - seancesTerminees;
        const pourcentage = Math.round((seancesTerminees / seances.length) * 100);
        
        console.log(`   ✅ Terminées: ${seancesTerminees}`);
        console.log(`   ⏳ À faire: ${seancesNonTerminees}`);
        console.log(`   📊 Progression: ${pourcentage}%`);
        
        // Afficher quelques séances
        seances.slice(0, 3).forEach((seance, index) => {
          console.log(`     ${index + 1}. ${seance.date} - ${seance.heureDebut} (${seance.fait ? '✅' : '⏳'})`);
        });
      } else {
        console.log('   ❌ Aucune séance générée');
      }
    }

    // 2. Statistiques globales
    console.log('\n📊 STATISTIQUES GLOBALES:');
    const allSeances = await Seance.find({}).populate('course');
    const totalSeances = allSeances.length;
    const totalTerminees = allSeances.filter(s => s.fait).length;
    const totalNonTerminees = totalSeances - totalTerminees;
    
    console.log(`Total séances: ${totalSeances}`);
    console.log(`Séances terminées: ${totalTerminees}`);
    console.log(`Séances non terminées: ${totalNonTerminees}`);
    console.log(`Pourcentage global: ${totalSeances > 0 ? Math.round((totalTerminees / totalSeances) * 100) : 0}%`);

    // 3. Test de l'API
    console.log('\n🧪 TEST DE L\'API:');
    console.log('Pour tester l\'API, utilisez:');
    console.log(`GET http://localhost:5001/api/seances/course/{courseId}`);
    console.log('Headers: Authorization: Bearer {token}');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB');
  }
}

testMesCoursSeances(); 