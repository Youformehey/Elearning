const mongoose = require("mongoose");
const Course = require("./models/Course");
const Student = require("./models/Student");
const Note = require("./models/Note");
const Absence = require("./models/Absence");

// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/learnup", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fixEnrollments() {
  try {
    console.log("🔧 Début du nettoyage des inscriptions incorrectes...");
    
    // Récupérer tous les cours
    const courses = await Course.find().populate("etudiants", "name email classe");
    
    for (const course of courses) {
      console.log(`\n📚 Cours: ${course.nom} (Classe ${course.classe})`);
      
      const incorrectStudents = course.etudiants.filter(
        student => student.classe !== course.classe
      );
      
      if (incorrectStudents.length > 0) {
        console.log(`❌ Étudiants incorrects trouvés: ${incorrectStudents.length}`);
        
        for (const student of incorrectStudents) {
          console.log(`   - ${student.name} (${student.email}) - Classe: ${student.classe}`);
          
          // Supprimer l'étudiant du cours
          course.etudiants = course.etudiants.filter(
            s => s._id.toString() !== student._id.toString()
          );
          
          // Supprimer toutes les notes de cet étudiant pour ce cours
          await Note.deleteMany({
            etudiant: student._id,
            cours: course._id
          });
          console.log(`   ✅ Notes supprimées pour ${student.name}`);
          
          // Supprimer toutes les absences de cet étudiant pour ce cours
          await Absence.deleteMany({
            etudiant: student._id,
            cours: course._id
          });
          console.log(`   ✅ Absences supprimées pour ${student.name}`);
        }
        
        // Sauvegarder le cours sans les étudiants incorrects
        await course.save();
        console.log(`✅ Cours mis à jour - ${course.etudiants.length} étudiants restants`);
      } else {
        console.log(`✅ Aucun étudiant incorrect dans ce cours`);
      }
    }
    
    console.log("\n🎉 Nettoyage terminé avec succès !");
    process.exit(0);
    
  } catch (error) {
    console.error("💥 Erreur lors du nettoyage:", error);
    process.exit(1);
  }
}

fixEnrollments(); 