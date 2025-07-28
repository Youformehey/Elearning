require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const debugLogin = async () => {
  try {
    console.log("🔍 Debug du login étudiant...");
    
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/learnup', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connecté");

    const Student = require("./models/Student");

    // 1. Récupérer l'étudiant khalil
    const student = await Student.findOne({ email: "khalil@gmail.com" });
    
    if (!student) {
      console.log("❌ Étudiant khalil@gmail.com NON TROUVÉ !");
      return;
    }

    console.log("✅ Étudiant trouvé :", {
      id: student._id,
      name: student.name,
      email: student.email,
      classe: student.classe,
      passwordHash: student.password.substring(0, 30) + "..."
    });

    // 2. Tester différents mots de passe
    const passwords = ["khalil12", "khalil", "test123", "password"];
    
    for (const password of passwords) {
      const isMatch = await bcrypt.compare(password, student.password);
      console.log(`🔑 Test "${password}": ${isMatch ? '✅ CORRECT' : '❌ INCORRECT'}`);
    }

    // 3. Tester avec l'étudiant test
    console.log("\n🔍 Test avec l'étudiant test...");
    const testStudent = await Student.findOne({ email: "test@gmail.com" });
    
    if (testStudent) {
      const isTestMatch = await bcrypt.compare("test123", testStudent.password);
      console.log(`🔑 Test "test123" pour test@gmail.com: ${isTestMatch ? '✅ CORRECT' : '❌ INCORRECT'}`);
    }

    // 4. Vérifier JWT_SECRET
    console.log("\n🔐 JWT_SECRET:", process.env.JWT_SECRET ? "✅ Présent" : "❌ MANQUANT");
    
    if (!process.env.JWT_SECRET) {
      console.log("⚠️  JWT_SECRET manquant dans .env !");
      console.log("💡 Ajoutez: JWT_SECRET=votre_secret_jwt_tres_securise");
    }

  } catch (error) {
    console.error("❌ Erreur:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Déconnexion");
  }
};

debugLogin(); 