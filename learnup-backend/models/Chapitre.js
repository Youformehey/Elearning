// models/Chapitre.js
const mongoose = require('mongoose');

const ChapitreSchema = new mongoose.Schema({
  titre: {
    type:    String,
    required:true,
    trim:    true
  },
  description: {
    type:   String,
    default:''
  },
  order: {
    type:   Number,
    default:0
  },
  // Référence au cours parent
  course: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Course',
    required: true
  },
  // Ressources associées
  ressources: [
    {
      type: {
        type:     String,
        enum:     ['video','pdf','lien'],
        required: true
      },
      titre:    { type: String, required: true },
      url:      { type: String, required: true },
      dateMaj:  { type: Date,   default: Date.now }
    }
  ]
}, {
  timestamps: true
});

// Index pour accélérer les requêtes par course et tri par ordre
ChapitreSchema.index({ course: 1, order: 1 });

module.exports = mongoose.model('Chapitre', ChapitreSchema);
