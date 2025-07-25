const mongoose = require("mongoose");

const rappelEtudiantSchema = new mongoose.Schema({
  rappel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rappel",
    required: true,
  },
  etudiant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  fait: {
    type: Boolean,
    default: false,
  },
  remarque: {
    type: String,
    default: "",
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("RappelEtudiant", rappelEtudiantSchema);
