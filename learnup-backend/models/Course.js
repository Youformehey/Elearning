const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  nom:       { type: String, required: true, trim: true },
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
  documents: [{ fileName: String, fileUrl: String }],
  devoirs: [{ fileName: String, fileUrl: String, dateEnvoi: { type: Date, default: Date.now } }],
  soumissions: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
      fileName: String,
      fileUrl: String,
      dateSoumission: { type: Date, default: Date.now },
      devoirId: String,
      grade: { type: Number, min: 0, max: 20 },
      comment: String,
      dateNotation: Date
    }
  ],
  chapitres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapitre' }], // <-- Ajout ici
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

// Supprime le virtual 'chapitres' car on a le champ réel

module.exports = mongoose.model('Course', courseSchema);
