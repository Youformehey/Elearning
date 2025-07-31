const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Admin = require('./models/Admin');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/learnup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkAdminAndCreateToken() {
  try {
    console.log('🔄 Vérification des admins dans la base de données...');
    
    const admins = await Admin.find().select('_id nom prenom email role');
    console.log('✅ Admins trouvés:', admins.length);
    
    if (admins.length === 0) {
      console.log('❌ Aucun admin trouvé dans la base de données');
      console.log('💡 Créez un admin d\'abord avec createAdmin.js');
      return;
    }
    
    const admin = admins[0];
    console.log('📝 Premier admin:', admin);
    
    // Créer un token valide pour cet admin
    const adminData = {
      _id: admin._id.toString(),
      role: 'admin'
    };
    
    const token = jwt.sign(adminData, 'votre_secret_jwt_tres_securise_pour_learnup_2025', { 
      expiresIn: '30d' 
    });
    
    console.log('\n🔐 Token admin valide créé:');
    console.log(token);
    console.log('\n📋 Token décodé:');
    console.log(JSON.stringify(jwt.decode(token), null, 2));
    
    return token;
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkAdminAndCreateToken(); 