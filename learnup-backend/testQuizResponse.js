require("dotenv").config();
const mongoose = require("mongoose");

// Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB connecté");

    // Import des modèles
    const Quiz = require("./models/Quiz");
    const QuizResponse = require("./models/QuizResponse");
    const Student = require("./models/Student");
    const Chapitre = require("./models/Chapitre");

    try {
      // Vérifier les modèles
      console.log("🔍 Vérification des modèles...");
      
      // Vérifier s'il y a des quiz
      const quizCount = await Quiz.countDocuments();
      console.log("📊 Nombre de quiz:", quizCount);
      
      if (quizCount > 0) {
        const quiz = await Quiz.findOne();
        console.log("📋 Premier quiz trouvé:", {
          _id: quiz._id,
          chapitreId: quiz.chapitreId,
          questionsCount: quiz.questions.length
        });
      }

      // Vérifier s'il y a des étudiants
      const studentCount = await Student.countDocuments();
      console.log("👥 Nombre d'étudiants:", studentCount);
      
      if (studentCount > 0) {
        const student = await Student.findOne();
        console.log("👤 Premier étudiant trouvé:", {
          _id: student._id,
          nom: student.nom,
          prenom: student.prenom
        });
      }

      // Vérifier s'il y a des chapitres
      const chapitreCount = await Chapitre.countDocuments();
      console.log("📚 Nombre de chapitres:", chapitreCount);
      
      if (chapitreCount > 0) {
        const chapitre = await Chapitre.findOne();
        console.log("📖 Premier chapitre trouvé:", {
          _id: chapitre._id,
          titre: chapitre.titre,
          course: chapitre.course
        });
      }

      // Vérifier les réponses de quiz
      const responseCount = await QuizResponse.countDocuments();
      console.log("💾 Nombre de réponses de quiz:", responseCount);

      console.log("✅ Test terminé avec succès");
      
    } catch (error) {
      console.error("❌ Erreur lors du test:", error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch((err) => {
    console.error("❌ Erreur MongoDB:", err.message);
  }); 