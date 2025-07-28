require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

// Créer le fichier .env s'il n'existe pas
const envPath = './.env';
if (!fs.existsSync(envPath)) {
  const envContent = `MONGO_URI=mongodb+srv://sofiane:sofiane123@cluster0.qwrnofy.mongodb.net/test
JWT_SECRET=votre_secret_jwt_tres_securise_pour_learnup_2025
PORT=5001
CORS_ORIGIN=http://localhost:5173
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Fichier .env créé !');
}

// Tester la connexion MongoDB
const testConnection = async () => {
  try {
    console.log('🔗 Test de connexion MongoDB...');
    
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://sofiane:sofiane123@cluster0.qwrnofy.mongodb.net/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connecté avec succès !');
    
    // Tester les modèles
    const Student = require('./models/Student');
    const Teacher = require('./models/Teacher');
    const Parent = require('./models/Parent');
    
    const students = await Student.find();
    const teachers = await Teacher.find();
    const parents = await Parent.find();
    
    console.log('📊 Données trouvées :');
    console.log(`  - Étudiants: ${students.length}`);
    console.log(`  - Professeurs: ${teachers.length}`);
    console.log(`  - Parents: ${parents.length}`);
    
    if (students.length > 0) {
      console.log('  - Étudiants:', students.map(s => s.name).join(', '));
    }
    if (teachers.length > 0) {
      console.log('  - Professeurs:', teachers.map(t => t.name).join(', '));
    }
    if (parents.length > 0) {
      console.log('  - Parents:', parents.map(p => p.name).join(', '));
    }
    
    console.log('\n🚀 Backend prêt ! Redémarrez votre serveur avec: npm start');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

testConnection(); 