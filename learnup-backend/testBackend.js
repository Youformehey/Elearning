const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    return true;
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB:', error);
    return false;
  }
};

const testBackend = async () => {
  try {
    console.log('🔍 Test du backend...\n');
    
    // Test de connexion MongoDB
    const mongoConnected = await connectDB();
    if (!mongoConnected) {
      console.log('❌ Impossible de se connecter à MongoDB');
      return;
    }
    
    // Test des modèles
    const Course = require('./models/Course');
    const Chapitre = require('./models/Chapitre');
    const Quiz = require('./models/Quiz');
    
    console.log('📊 Données existantes:');
    
    const courses = await Course.countDocuments();
    console.log(`   - Cours: ${courses}`);
    
    const chapitres = await Chapitre.countDocuments();
    console.log(`   - Chapitres: ${chapitres}`);
    
    const quizs = await Quiz.countDocuments();
    console.log(`   - Quiz: ${quizs}`);
    
    if (courses === 0) {
      console.log('\n⚠️  Aucun cours trouvé. Création de données de test...');
      
      // Créer des données de test
      const Matiere = require('./models/Matiere');
      const Teacher = require('./models/Teacher');
      const Student = require('./models/Student');
      
      // Créer matière
      let matiere = await Matiere.findOne({ nom: 'Mathématiques' });
      if (!matiere) {
        matiere = await Matiere.create({
          nom: 'Mathématiques',
          code: 'MATH',
          description: 'Mathématiques pour la 6ème'
        });
        console.log('✅ Matière créée');
      }
      
      // Créer professeur
      let teacher = await Teacher.findOne({ email: 'prof@test.com' });
      if (!teacher) {
        teacher = await Teacher.create({
          name: 'Professeur Test',
          email: 'prof@test.com',
          password: 'password123',
          matiere: matiere._id
        });
        console.log('✅ Professeur créé');
      }
      
      // Créer étudiant
      let student = await Student.findOne({ email: 'etudiant@test.com' });
      if (!student) {
        student = await Student.create({
          name: 'Étudiant Test',
          email: 'etudiant@test.com',
          password: 'password123',
          classe: '6A'
        });
        console.log('✅ Étudiant créé');
      }
      
      // Créer cours
      const course = await Course.create({
        nom: 'Mathématiques - 6A',
        description: 'Cours de mathématiques pour la 6ème A',
        classe: '6A',
        teacher: teacher._id,
        matiere: matiere._id,
        etudiants: [student._id]
      });
      console.log('✅ Cours créé');
      
      // Créer chapitres
      const chapitresData = [
        {
          titre: 'Chapitre 1 - Les nombres entiers',
          description: 'Introduction aux nombres entiers',
          course: course._id,
          ordre: 1
        },
        {
          titre: 'Chapitre 2 - Les opérations',
          description: 'Addition, soustraction, multiplication',
          course: course._id,
          ordre: 2
        }
      ];
      
      for (const chapitreData of chapitresData) {
        const chapitre = await Chapitre.create(chapitreData);
        console.log(`✅ Chapitre créé: ${chapitre.titre}`);
        
        // Créer quiz pour ce chapitre
        const quiz = await Quiz.create({
          chapitre: chapitre._id,
          questions: [
            {
              question: "Quel est le résultat de 5 + 3 ?",
              options: ["6", "7", "8", "9"],
              correctIndex: 2
            },
            {
              question: "Combien font 4 × 6 ?",
              options: ["20", "24", "28", "32"],
              correctIndex: 1
            }
          ]
        });
        console.log(`✅ Quiz créé pour: ${chapitre.titre}`);
      }
      
      console.log('\n🎉 Données de test créées avec succès !');
    }
    
    console.log('\n✅ Backend prêt !');
    console.log('🔗 URL: http://localhost:5001');
    console.log('👤 Étudiant: etudiant@test.com / password123');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
};

const main = async () => {
  await testBackend();
  process.exit(0);
};

main(); 