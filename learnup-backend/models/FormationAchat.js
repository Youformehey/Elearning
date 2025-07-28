const mongoose = require('mongoose');

const formationAchatSchema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: true
  },
  formation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Formation',
    required: false // Pas requis car peut être une formation de test
  },
  formationTest: {
    type: String,
    required: false // Pour les formations de test
  },
  enfants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  }],
  montant: {
    type: Number,
    required: true
  },
  statut: {
    type: String,
    enum: ['en_attente', 'paye', 'annule'],
    default: 'en_attente'
  },
  codeConfirmation: {
    type: String,
    required: false
  },
  detailsPaiement: {
    cardLast4: String,
    cardBrand: String,
    paymentMethod: String
  },
  dateAchat: {
    type: Date,
    default: Date.now
  },
  dateExpiration: {
    type: Date,
    default: function() {
      // Expire dans 1 an
      return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FormationAchat', formationAchatSchema); 