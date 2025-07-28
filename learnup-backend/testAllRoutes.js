const mongoose = require('mongoose');
require('dotenv').config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/learnup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Student = require('./models/Student');
const Parent = require('./models/Parent');
const Demande = require('./models/Demande');
const FormationAchat = require('./models/FormationAchat');

async function testAllRoutes() {
  try {
    console.log('🔍 Test de toutes les routes...\n');

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

    // 2. Vérifier si un parent existe
    const parent = await Parent.findOne({ email: 'parent@test.com' });
    if (!parent) {
      console.log('❌ Aucun parent trouvé avec parent@test.com');
      console.log('📝 Création d\'un parent de test...');
      
      const testParent = new Parent({
        name: 'Test Parent',
        email: 'parent@test.com',
        password: 'password123',
        role: 'parent',
        children: student ? [student._id] : []
      });
      await testParent.save();
      console.log('✅ Parent de test créé:', testParent._id);
    } else {
      console.log('✅ Parent trouvé:', parent._id);
    }

    // 3. Vérifier les demandes
    console.log('\n📋 Test des demandes...');
    const demandes = await Demande.find({ etudiant: student?._id || 'test' });
    console.log(`📝 Nombre de demandes trouvées: ${demandes.length}`);
    
    if (demandes.length === 0) {
      console.log('⚠️  Aucune demande trouvée - création de demandes de test...');
      
      const testDemandes = [
        {
          etudiant: student?._id || 'test',
          type: 'Demande de rendez-vous',
          description: 'Je souhaite un rendez-vous pour discuter des progrès de mon enfant',
          statut: 'en_cours',
          reponse: null
        },
        {
          etudiant: student?._id || 'test',
          type: 'Demande de document',
          description: 'J\'ai besoin d\'un certificat de scolarité',
          statut: 'traitee',
          reponse: 'Votre certificat est prêt, vous pouvez le récupérer au secrétariat'
        }
      ];
      
      for (const demandeData of testDemandes) {
        const demande = new Demande(demandeData);
        await demande.save();
        console.log('✅ Demande créée:', demande.type, '-', demande.statut);
      }
    }

    // 4. Vérifier les achats de formations
    console.log('\n🎓 Test des achats de formations...');
    const achats = await FormationAchat.find({ enfants: student?._id || 'test' });
    console.log(`💰 Nombre d'achats trouvés: ${achats.length}`);
    
    if (achats.length === 0) {
      console.log('⚠️  Aucun achat trouvé - création d\'achats de test...');
      
      const testAchats = [
        {
          parent: parent?._id || 'test',
          formationTest: '1', // Mathématiques
          enfants: [student?._id || 'test'],
          montant: 25,
          statut: 'paye',
          codeConfirmation: 'ABC123',
          dateAchat: new Date()
        },
        {
          parent: parent?._id || 'test',
          formationTest: '2', // Français
          enfants: [student?._id || 'test'],
          montant: 28,
          statut: 'paye',
          codeConfirmation: 'DEF456',
          dateAchat: new Date()
        }
      ];
      
      for (const achatData of testAchats) {
        const achat = new FormationAchat(achatData);
        await achat.save();
        console.log('✅ Achat créé:', achat.formationTest, '-', achat.montant + '€');
      }
    }

    console.log('\n🎉 Test terminé !');
    console.log('📋 Résumé:');
    console.log(`   - Étudiant: ${student ? 'Trouvé' : 'Créé'}`);
    console.log(`   - Parent: ${parent ? 'Trouvé' : 'Créé'}`);
    console.log(`   - Demandes: ${demandes.length} existantes`);
    console.log(`   - Achats: ${achats.length} existants`);

    console.log('\n🚀 Routes à tester:');
    console.log('   - GET /api/students/dashboard');
    console.log('   - GET /api/students/formations');
    console.log('   - GET /api/parents/children/demandes');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    mongoose.connection.close();
  }
}

testAllRoutes(); 