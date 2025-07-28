require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("./models/Student");
const Teacher = require("./models/Teacher");
const Parent = require("./models/Parent");
const Admin = require("./models/Admin");
const Course = require("./models/Course");
const Note = require("./models/Note");
const Absence = require("./models/Absence");
const Rappel = require("./models/Rappel");
const Demande = require("./models/Demande");
const Formation = require("./models/Formation");

const testDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connecté");

    console.log("\n=== VÉRIFICATION DES DONNÉES ===");

    // Compter les documents
    const studentsCount = await Student.countDocuments();
    const teachersCount = await Teacher.countDocuments();
    const parentsCount = await Parent.countDocuments();
    const adminsCount = await Admin.countDocuments();
    const coursesCount = await Course.countDocuments();
    const notesCount = await Note.countDocuments();
    const absencesCount = await Absence.countDocuments();
    const rappelsCount = await Rappel.countDocuments();
    const demandesCount = await Demande.countDocuments();
    const formationsCount = await Formation.countDocuments();

    console.log(`📊 Statistiques:`);
    console.log(`   Étudiants: ${studentsCount}`);
    console.log(`   Professeurs: ${teachersCount}`);
    console.log(`   Parents: ${parentsCount}`);
    console.log(`   Admins: ${adminsCount}`);
    console.log(`   Cours: ${coursesCount}`);
    console.log(`   Notes: ${notesCount}`);
    console.log(`   Absences: ${absencesCount}`);
    console.log(`   Rappels: ${rappelsCount}`);
    console.log(`   Demandes: ${demandesCount}`);
    console.log(`   Formations: ${formationsCount}`);

    // Afficher quelques exemples
    if (studentsCount > 0) {
      console.log(`\n👥 Exemples d'étudiants:`);
      const students = await Student.find().limit(3);
      students.forEach((student, index) => {
        console.log(`   ${index + 1}. ${student.prenom} ${student.nom} - ${student.email}`);
      });
    }

    if (teachersCount > 0) {
      console.log(`\n👨‍🏫 Exemples de professeurs:`);
      const teachers = await Teacher.find().limit(3);
      teachers.forEach((teacher, index) => {
        console.log(`   ${index + 1}. ${teacher.prenom} ${teacher.nom} - ${teacher.email}`);
      });
    }

    if (coursesCount > 0) {
      console.log(`\n📚 Exemples de cours:`);
      const courses = await Course.find().limit(3);
      courses.forEach((course, index) => {
        console.log(`   ${index + 1}. ${course.matiere} - ${course.description || 'Pas de description'}`);
      });
    }

    if (notesCount > 0) {
      console.log(`\n📝 Exemples de notes:`);
      const notes = await Note.find().limit(3);
      notes.forEach((note, index) => {
        console.log(`   ${index + 1}. Note: ${note.note}/20 - Étudiant: ${note.etudiant}`);
      });
    }

    if (absencesCount > 0) {
      console.log(`\n❌ Exemples d'absences:`);
      const absences = await Absence.find().limit(3);
      absences.forEach((absence, index) => {
        console.log(`   ${index + 1}. Étudiant: ${absence.etudiant} - Date: ${absence.date}`);
      });
    }

    if (rappelsCount > 0) {
      console.log(`\n🔔 Exemples de rappels:`);
      const rappels = await Rappel.find().limit(3);
      rappels.forEach((rappel, index) => {
        console.log(`   ${index + 1}. ${rappel.titre} - ${rappel.description}`);
      });
    }

    if (demandesCount > 0) {
      console.log(`\n📋 Exemples de demandes:`);
      const demandes = await Demande.find().limit(3);
      demandes.forEach((demande, index) => {
        console.log(`   ${index + 1}. ${demande.type} - Statut: ${demande.statut}`);
      });
    }

    if (formationsCount > 0) {
      console.log(`\n🎓 Exemples de formations:`);
      const formations = await Formation.find().limit(3);
      formations.forEach((formation, index) => {
        console.log(`   ${index + 1}. ${formation.titre} - ${formation.description}`);
      });
    }

    console.log("\n=== RÉSULTAT ===");
    if (studentsCount === 0 && teachersCount === 0 && coursesCount === 0) {
      console.log("❌ AUCUNE DONNÉE TROUVÉE !");
      console.log("💡 Solution: Exécutez les scripts de seed pour créer des données de test");
      console.log("   - node seedDashboardData.js");
      console.log("   - node seedFormations.js");
      console.log("   - node seedMatieres.js");
    } else {
      console.log("✅ DONNÉES TROUVÉES !");
      console.log("💡 Si l'interface ne les affiche pas, vérifiez:");
      console.log("   1. Le backend fonctionne (npm start)");
      console.log("   2. Les routes sont correctes");
      console.log("   3. Le token d'authentification est valide");
    }

  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Déconnexion de MongoDB");
  }
};

testDatabase(); 