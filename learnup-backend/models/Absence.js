const mongoose = require("mongoose");

const absenceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  date: { type: Date, default: Date.now }, // ✅ champ essentiel
});

module.exports = mongoose.model("Absence", absenceSchema);
