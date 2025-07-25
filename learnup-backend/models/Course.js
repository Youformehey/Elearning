// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  matiere:   { type: mongoose.Schema.Types.ObjectId, ref: 'Matiere', required: true },
  classe:    { type: String, required: true },
  semestre:  { type: String },
  horaire:   { type: String },
  date:      { type: Date },
  salle:     { type: String },
  groupe:    { type: String },
  duree:     { type: Number, default: 120 },
  teacher:   { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  etudiants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  documents: [
    { fileName: String, fileUrl: String }
  ],
  devoirs: [
    { fileName: String, fileUrl: String, dateEnvoi: { type: Date, default: Date.now } }
  ],
  soumissions: [
    {
      student:       { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
      fileName:      String,
      fileUrl:       String,
      dateSoumission:{ type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true
});

// Virtual populate pour récupérer les chapitres liés
courseSchema.virtual('chapitres', {
  ref: 'Chapitre',       // modèle à peupler
  localField: '_id',     // champ local
  foreignField: 'course',// champ dans Chapitre
  justOne: false
});

// Pour inclure les virtuals dans toObject() et toJSON()
courseSchema.set('toObject', { virtuals: true });
courseSchema.set('toJSON',   { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
