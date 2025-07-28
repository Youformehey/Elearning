const fs = require('fs');

const envContent = `MONGO_URI=mongodb+srv://sofiane:sofiane123@cluster0.qwrnofy.mongodb.net/test
JWT_SECRET=votre_secret_jwt_tres_securise_pour_learnup_2025
PORT=5001
CORS_ORIGIN=http://localhost:5173
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760`;

fs.writeFileSync('.env', envContent);
console.log('✅ Fichier .env créé !');
console.log('🔐 JWT_SECRET configuré');
console.log('🌐 MONGO_URI configuré');
console.log('🚀 Redémarrez votre backend maintenant !'); 