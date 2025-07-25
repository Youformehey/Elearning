// seedMatieres.js

const mongoose = require("mongoose");
const Matiere = require("./models/Matiere"); // adapte le chemin si besoin

// 🔧 Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/learnup", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ✅ Liste des matières à insérer
const matieres = [
  { nom: "Mathématiques", code: "MATH01" },
  { nom: "Français", code: "FR01" },
  { nom: "Sciences", code: "SCI01" },
  { nom: "Anglais", code: "ANG01" },
  { nom: "EPS", code: "EPS01" },
  { nom: "Art Plastiques", code: "ART01" },
  { nom: "Technologie", code: "TECH01" },
  { nom: "Physique", code: "PHY01" },
  { nom: "Histoire-Géo", code: "HG01" },
  { nom: "SVT", code: "SVT01" },
];

// 🚀 Insertion dans la base
async function seedMatieres() {
  try {
    await Matiere.deleteMany(); // si tu veux tout réinitialiser
    await Matiere.insertMany(matieres);
    console.log("✅ Matières insérées avec succès !");
    process.exit();
  } catch (err) {
    console.error("❌ Erreur lors de l'insertion :", err);
    process.exit(1);
  }
}

seedMatieres();
