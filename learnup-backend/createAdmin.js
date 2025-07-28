require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

const createDefaultAdmin = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connecté");

    // Vérifier si un admin existe déjà
    const existingAdmin = await Admin.findOne({ email: "admin@learnup.com" });
    if (existingAdmin) {
      console.log("⚠️  Un administrateur existe déjà avec l'email admin@learnup.com");
      console.log("📧 Email: admin@learnup.com");
      console.log("🔑 Mot de passe: admin123");
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash("admin123", 12);

    // Créer l'administrateur par défaut
    const admin = new Admin({
      nom: "Administrateur",
      prenom: "Super",
      email: "admin@learnup.com",
      password: hashedPassword,
      telephone: "+33 1 23 45 67 89",
      role: "admin",
      status: "active"
    });

    await admin.save();
    console.log("✅ Administrateur créé avec succès !");
    console.log("📧 Email: admin@learnup.com");
    console.log("🔑 Mot de passe: admin123");
    console.log("⚠️  IMPORTANT: Changez ce mot de passe après la première connexion !");

  } catch (error) {
    console.error("❌ Erreur lors de la création de l'administrateur:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Déconnexion de MongoDB");
  }
};

// Exécuter le script
createDefaultAdmin(); 