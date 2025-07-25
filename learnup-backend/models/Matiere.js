const mongoose = require("mongoose");

const matiereSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Matiere", matiereSchema);
