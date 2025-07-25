const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    trim: true,
    // fileName sera requis uniquement si pas de videoUrl
    required: function() {
      return !this.videoUrl;
    },
  },
  fileUrl: {
    type: String,
    // fileUrl sera requis uniquement si pas de videoUrl
    required: function() {
      return !this.videoUrl;
    },
  },
  videoUrl: {
    type: String,
    trim: true,
    // vidéo URL optionnelle, mais si présente, fileName et fileUrl ne sont pas requis
  },
  message: {
    type: String,
    trim: true,
    maxlength: 500, // Limite utile pour les descriptions
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Le cours lié est requis"],
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "L'enseignant est requis"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Validator pour vérifier que soit un fichier soit une videoUrl est présente
documentSchema.pre("validate", function(next) {
  if (!this.fileUrl && !this.videoUrl) {
    next(new Error("Soit un fichier soit une URL vidéo doit être renseignée"));
  } else {
    next();
  }
});

module.exports = mongoose.model("Document", documentSchema);
