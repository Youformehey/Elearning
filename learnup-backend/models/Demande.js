const mongoose = require("mongoose");

const demandeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["absence", "rattrapage", "clarification"],
      required: true,
    },
    contenu: { type: String, required: true }, // Message de l'étudiant
    status: {
      type: String,
      enum: ["en_attente", "acceptee", "refusee"],
      default: "en_attente",
    },
    etudiant: {
      nom: String,
      email: String,
    },
    professeur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    dateDemande: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Demande", demandeSchema);
