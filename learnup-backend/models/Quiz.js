const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [String],
  correctIndex: { type: Number, required: true },
});

const quizSchema = new mongoose.Schema({
  chapitreId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapitre", required: true },
  questions: [questionSchema],
}, { timestamps: true });

module.exports = mongoose.model("Quiz", quizSchema);
