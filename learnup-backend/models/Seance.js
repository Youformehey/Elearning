const mongoose = require("mongoose");

const seanceSchema = new mongoose.Schema({
  jour: String,
  date: Date,
  heureDebut: String,
  heureFin: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  professeur: {                  // <-- changer ici
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  salle: String,
  groupe: String,
  classe: {
    type: String,
    required: true,
  },
  fait: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Seance", seanceSchema);
