const mongoose = require("mongoose");

const formationSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  prix: {
    type: Number,
    required: true,
    min: 0
  },
  duree: {
    type: String,
    required: true
  },
  niveau: {
    type: String,
    enum: ["Débutant", "Intermédiaire", "Avancé", "Tous niveaux"],
    default: "Débutant"
  },
  categorie: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  couleur: {
    type: String,
    required: true
  },
  bgCouleur: {
    type: String,
    required: true
  },
  borderCouleur: {
    type: String,
    required: true
  },
  statut: {
    type: String,
    enum: ["disponible", "verrouille"],
    default: "disponible"
  },
  etudiantsAcheteurs: [{
    etudiant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    dateAchat: {
      type: Date,
      default: Date.now
    },
    stripePaymentId: {
      type: String
    },
    statutPaiement: {
      type: String,
      enum: ["en_attente", "complete", "annule"],
      default: "en_attente"
    }
  }],
  contenu: {
    type: String,
    default: ""
  },
  videoUrl: {
    type: String
  },
  documents: [{
    nom: String,
    url: String,
    type: String
  }],
  quiz: [{
    question: String,
    reponses: [String],
    bonneReponse: Number
  }]
}, {
  timestamps: true
});

// Index pour améliorer les performances
formationSchema.index({ categorie: 1, statut: 1 });
formationSchema.index({ "etudiantsAcheteurs.etudiant": 1 });

module.exports = mongoose.model("Formation", formationSchema); 