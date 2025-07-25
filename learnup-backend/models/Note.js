const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  etudiant: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  cours: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  devoir: { type: String, required: true }, // ex : "DS1", "DM maison", "Projet final"
  note: { type: Number, required: true },
  enseignant: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Note", noteSchema);
