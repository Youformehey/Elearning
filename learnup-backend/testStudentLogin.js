require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const testStudentLogin = async () => {
  try {
    console.log("🔍 Test du login étudiant...");
    
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/learnup', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connecté");

    const Student = require("./models/Student");

    // 1. Vérifier si l'étudiant khalil existe
    const student = await Student.findOne({ email: "khalil@gmail.com" });
    
    if (!student) {
      console.log("❌ Étudiant khalil@gmail.com NON TROUVÉ !");
      console.log("📋 Tous les étudiants dans la base :");
      const allStudents = await Student.find({});
      allStudents.forEach(s => {
        console.log(`  - ${s.name} (${s.email}) - Classe: ${s.classe}`);
      });
      return;
    }

    console.log("✅ Étudiant trouvé :", {
      id: student._id,
      name: student.name,
      email: student.email,
      classe: student.classe,
      hasPassword: !!student.password
    });

    // 2. Tester le mot de passe
    const password = "khalil12";
    const isMatch = await bcrypt.compare(password, student.password);
    
    if (isMatch) {
      console.log("✅ Mot de passe CORRECT !");
      console.log("🎉 Le login devrait fonctionner !");
    } else {
      console.log("❌ Mot de passe INCORRECT !");
      console.log("🔍 Mot de passe hashé dans la base :", student.password.substring(0, 20) + "...");
    }

    // 3. Créer un nouvel étudiant de test si nécessaire
    console.log("\n🔧 Création d'un étudiant de test...");
    const testStudent = await Student.findOne({ email: "test@gmail.com" });
    
    if (!testStudent) {
      const hashedPassword = await bcrypt.hash("test123", 10);
      const newStudent = new Student({
        name: "test",
        email: "test@gmail.com",
        password: hashedPassword,
        classe: "6A",
        role: "student"
      });
      await newStudent.save();
      console.log("✅ Étudiant de test créé : test@gmail.com / test123");
    } else {
      console.log("✅ Étudiant de test existe déjà");
    }

  } catch (error) {
    console.error("❌ Erreur:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Déconnexion");
  }
};

testStudentLogin(); 