const jwt = require('jsonwebtoken');

// Créer un token admin valide pour les tests
function createAdminToken() {
  const adminData = {
    _id: '507f1f77bcf86cd799439011', // ID fictif pour admin
    role: 'admin'
  };

  const token = jwt.sign(adminData, 'votre_secret_jwt_tres_securise_pour_learnup_2025', { 
    expiresIn: '30d' 
  });

  console.log('🔐 Token admin créé:');
  console.log(token);
  console.log('\n📋 Token décodé:');
  console.log(JSON.stringify(jwt.decode(token), null, 2));
  
  return token;
}

createAdminToken(); 