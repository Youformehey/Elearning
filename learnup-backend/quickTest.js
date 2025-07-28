require("dotenv").config();
const mongoose = require("mongoose");

const quickTest = async () => {
  try {
    console.log("🔍 Test rapide de la base de données...");
    
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/learnup', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connecté");

    // Vérifier les collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📚 Collections trouvées:", collections.map(c => c.name));

    // Compter les documents dans chaque collection
    const Student = require("./models/Student");
    const Teacher = require("./models/Teacher");
    const Admin = require("./models/Admin");
    const Course = require("./models/Course");
    const Note = require("./models/Note");
    const Absence = require("./models/Absence");
    const Rappel = require("./models/Rappel");
    const Demande = require("./models/Demande");
    const Formation = require("./models/Formation");

    const counts = {
      students: await Student.countDocuments(),
      teachers: await Teacher.countDocuments(),
      admins: await Admin.countDocuments(),
      courses: await Course.countDocuments(),
      notes: await Note.countDocuments(),
      absences: await Absence.countDocuments(),
      rappels: await Rappel.countDocuments(),
      demandes: await Demande.countDocuments(),
      formations: await Formation.countDocuments()
    };

    console.log("📊 Compteurs:", counts);

    if (counts.students === 0 && counts.teachers === 0) {
      console.log("❌ AUCUNE DONNÉE TROUVÉE !");
      console.log("💡 Exécutez: node fixAdminData.js");
    } else {
      console.log("✅ DONNÉES TROUVÉES !");
    }

  } catch (error) {
    console.error("❌ Erreur:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Déconnexion");
  }
};

quickTest(); 