const fs = require('fs');
const path = require('path');

const envContent = `# Configuration MongoDB
MONGO_URI=mongodb+srv://sofiane:sofiane123@cluster0.qwrnofy.mongodb.net/test

# JWT Secret pour l'authentification
JWT_SECRET=votre_secret_jwt_tres_securise_pour_learnup_2025

# Configuration du serveur
PORT=5001

# Configuration CORS
CORS_ORIGIN=http://localhost:5173

# Configuration des uploads
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Fichier .env créé avec succès !');
  console.log('📁 Chemin:', envPath);
  console.log('🔐 JWT_SECRET configuré');
  console.log('🌐 MONGO_URI configuré');
} catch (error) {
  console.error('❌ Erreur lors de la création du fichier .env:', error.message);
} 