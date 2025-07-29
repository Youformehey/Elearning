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

    try {
      // Test des modèles
      const Quiz = require("./models/Quiz");
      const QuizResponse = require("./models/QuizResponse");
      
      console.log("🔍 Test des modèles...");
      
      // Vérifier que les modèles sont bien définis
      console.log("📋 Quiz model:", Quiz.modelName);
      console.log("📋 QuizResponse model:", QuizResponse.modelName);
      
      // Compter les documents
      const quizCount = await Quiz.countDocuments();
      const responseCount = await QuizResponse.countDocuments();
      
      console.log("📊 Nombre de quiz:", quizCount);
      console.log("📊 Nombre de réponses:", responseCount);
      
      if (quizCount > 0) {
        const quiz = await Quiz.findOne();
        console.log("✅ Premier quiz:", {
          _id: quiz._id,
          chapitreId: quiz.chapitreId,
          questionsCount: quiz.questions.length
        });
      }
      
      console.log("✅ Test terminé avec succès");
      
    } catch (error) {
      console.error("❌ Erreur lors du test:", error);
      console.error("❌ Stack trace:", error.stack);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch((err) => {
    console.error("❌ Erreur MongoDB:", err.message);
  }); 