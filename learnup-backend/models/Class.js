const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true
  },
  niveau: {
    type: String,
    required: true,
    enum: ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale']
  },
  section: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  },
  effectif: {
    type: Number,
    default: 30,
    min: 1,
    max: 50
  },
  professeurPrincipal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  etudiants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  matieres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Matiere'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  salle: {
    type: String,
    default: 'À définir'
  },
  horaire: {
    type: String,
    default: 'À définir'
  },
  capacite: {
    type: Number,
    default: 30
  },
  noteMoyenne: {
    type: Number,
    default: 0
  },
  tauxPresence: {
    type: Number,
    default: 100
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
classSchema.index({ nom: 1 });
classSchema.index({ niveau: 1 });
classSchema.index({ status: 1 });

// Méthode pour calculer l'effectif actuel
classSchema.methods.getEffectifActuel = function() {
  return this.etudiants ? this.etudiants.length : 0;
};

// Méthode pour vérifier si la classe est pleine
classSchema.methods.isFull = function() {
  return this.getEffectifActuel() >= this.capacite;
};

// Middleware pour mettre à jour la date de modification
classSchema.pre('save', function(next) {
  this.dateModification = new Date();
  next();
});

module.exports = mongoose.model('Class', classSchema); 