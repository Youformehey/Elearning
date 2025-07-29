const mongoose = require('mongoose');

const quizResponseSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  chapitre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapitre',
    required: true
  },
  answers: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isSubmitted: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  submittedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index pour éviter les doublons
quizResponseSchema.index({ student: 1, quiz: 1 }, { unique: true });

module.exports = mongoose.model('QuizResponse', quizResponseSchema); 