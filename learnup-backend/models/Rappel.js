const mongoose = require("mongoose");

const rappelSchema = new mongoose.Schema({
  texte: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ["tache", "devoir", "quiz", "note"],
    required: true,
  },
  professeur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  classe: {
    type: String,
    required: true,
  },
  fait: {
    type: Boolean,
    default: false,
  },
  etudiantsQuiOntFait: [{  // ✅ NOUVEAU
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model("Rappel", rappelSchema);
