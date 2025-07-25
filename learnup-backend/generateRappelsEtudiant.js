// 📂 Place ce fichier à la racine de ton projet backend (même niveau que server.js)

require("dotenv").config();
const mongoose = require("mongoose");

const Rappel = require("./models/Rappel");
const RappelEtudiant = require("./models/RappelEtudiant");
const Student = require("./models/Student");

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("✅ Connexion MongoDB réussie");

  // Récupérer tous les rappels
  const rappels = await Rappel.find();
  let totalAjoutes = 0;
  let totalIgnorés = 0;

  for (const rappel of rappels) {
    const etudiants = await Student.find({ classe: rappel.classe });

    for (const etudiant of etudiants) {
      const existe = await RappelEtudiant.findOne({
        rappel: rappel._id,
        etudiant: etudiant._id,
      });

      if (existe) {
        totalIgnorés++;
        continue; // déjà existant
      }

      await RappelEtudiant.create({
        rappel: rappel._id,
        etudiant: etudiant._id,
        fait: false,
      });

      totalAjoutes++;
      console.log(`✅ Ajout pour ${etudiant.name} – ${rappel.texte}`);
    }
  }

  console.log("🎯 Terminé !");
  console.log(`➡️ Nouveaux suivis créés : ${totalAjoutes}`);
  console.log(`⏭️ Déjà existants : ${totalIgnorés}`);
  process.exit();
}).catch((err) => {
  console.error("❌ Erreur MongoDB :", err.message);
  process.exit(1);
});
