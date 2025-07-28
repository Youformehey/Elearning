const mongoose = require("mongoose");
const Formation = require("./models/Formation");

// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/learnup", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const formationsData = [
  {
    titre: "🧠 Apprendre à apprendre",
    description: "Découvre des techniques magiques pour mieux mémoriser et organiser tes révisions !",
    prix: 29,
    duree: "4 heures",
    niveau: "Débutant",
    categorie: "Méthodologie",
    icon: "Brain",
    couleur: "from-pink-500 to-purple-600",
    bgCouleur: "bg-gradient-to-br from-pink-50 to-purple-50",
    borderCouleur: "border-pink-200",
    statut: "disponible",
    contenu: "Contenu de la formation sur l'apprentissage..."
  },
  {
    titre: "💻 Premiers pas en programmation",
    description: "Crée tes premiers jeux et animations avec le code ! C'est comme jouer aux LEGO !",
    prix: 49,
    duree: "6 heures",
    niveau: "Débutant",
    categorie: "Informatique",
    icon: "Code",
    couleur: "from-blue-500 to-cyan-600",
    bgCouleur: "bg-gradient-to-br from-blue-50 to-cyan-50",
    borderCouleur: "border-blue-200",
    statut: "disponible",
    contenu: "Contenu de la formation sur la programmation..."
  },
  {
    titre: "✍️ Devenir un pro de la rédaction",
    description: "Transforme tes idées en histoires captivantes ! Deviens un écrivain en herbe !",
    prix: 39,
    duree: "5 heures",
    niveau: "Intermédiaire",
    categorie: "Français",
    icon: "BookOpen",
    couleur: "from-green-500 to-emerald-600",
    bgCouleur: "bg-gradient-to-br from-green-50 to-emerald-50",
    borderCouleur: "border-green-200",
    statut: "disponible",
    contenu: "Contenu de la formation sur la rédaction..."
  },
  {
    titre: "🎨 Créativité et Arts",
    description: "Libère ton imagination ! Dessine, peins et crée des œuvres d'art uniques !",
    prix: 35,
    duree: "4 heures",
    niveau: "Tous niveaux",
    categorie: "Arts",
    icon: "Palette",
    couleur: "from-orange-500 to-red-600",
    bgCouleur: "bg-gradient-to-br from-orange-50 to-red-50",
    borderCouleur: "border-orange-200",
    statut: "verrouille",
    contenu: "Contenu de la formation sur les arts..."
  },
  {
    titre: "🎵 Musique et Rythme",
    description: "Découvre la musique ! Apprends à jouer, chanter et créer tes propres mélodies !",
    prix: 42,
    duree: "5 heures",
    niveau: "Débutant",
    categorie: "Musique",
    icon: "Music",
    couleur: "from-purple-500 to-pink-600",
    bgCouleur: "bg-gradient-to-br from-purple-50 to-pink-50",
    borderCouleur: "border-purple-200",
    statut: "disponible",
    contenu: "Contenu de la formation sur la musique..."
  },
  {
    titre: "🔢 Mathématiques Amusantes",
    description: "Les maths deviennent un jeu ! Résous des énigmes et deviens un champion des calculs !",
    prix: 38,
    duree: "4 heures",
    niveau: "Intermédiaire",
    categorie: "Mathématiques",
    icon: "Calculator",
    couleur: "from-indigo-500 to-blue-600",
    bgCouleur: "bg-gradient-to-br from-indigo-50 to-blue-50",
    borderCouleur: "border-indigo-200",
    statut: "disponible",
    contenu: "Contenu de la formation sur les mathématiques..."
  }
];

async function seedFormations() {
  try {
    console.log("🌱 Début de l'ajout des formations...");
    
    // Supprimer les formations existantes
    await Formation.deleteMany({});
    console.log("🗑️ Anciennes formations supprimées");
    
    // Ajouter les nouvelles formations
    const formations = await Formation.insertMany(formationsData);
    console.log(`✅ ${formations.length} formations ajoutées avec succès !`);
    
    // Afficher les formations créées
    formations.forEach((formation, index) => {
      console.log(`${index + 1}. ${formation.titre} - ${formation.prix}€`);
    });
    
    console.log("\n🎉 Script terminé avec succès !");
    process.exit(0);
    
  } catch (error) {
    console.error("💥 Erreur lors de l'ajout des formations:", error);
    process.exit(1);
  }
}

seedFormations(); 