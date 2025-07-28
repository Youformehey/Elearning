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
const bcrypt = require("bcryptjs");

const fixAdminData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connecté");

    // 1. Créer un admin si pas d'admin
    const adminExists = await Admin.findOne({ email: "admin@learnup.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 12);
      const admin = new Admin({
        name: "Super Admin",
        email: "admin@learnup.com",
        password: hashedPassword,
        role: "admin"
      });
      await admin.save();
      console.log("✅ Admin créé: admin@learnup.com / admin123");
    } else {
      console.log("✅ Admin existe déjà");
    }

    // 2. Créer des étudiants de test
    const studentsCount = await Student.countDocuments();
    if (studentsCount === 0) {
      const students = await Student.create([
        {
          nom: "Martin",
          prenom: "Alice",
          email: "alice.martin@student.com",
          password: await bcrypt.hash("password123", 12),
          classe: "Terminale S",
          telephone: "+33 6 12 34 56 78",
          adresse: "123 Rue de l'Éducation, Paris",
          role: "etudiant"
        },
        {
          nom: "Dupont",
          prenom: "Bob",
          email: "bob.dupont@student.com",
          password: await bcrypt.hash("password123", 12),
          classe: "Terminale S",
          telephone: "+33 6 23 45 67 89",
          adresse: "456 Avenue des Étudiants, Lyon",
          role: "etudiant"
        },
        {
          nom: "Leroy",
          prenom: "Claire",
          email: "claire.leroy@student.com",
          password: await bcrypt.hash("password123", 12),
          classe: "Terminale S",
          telephone: "+33 6 34 56 78 90",
          adresse: "789 Boulevard de la Science, Marseille",
          role: "etudiant"
        }
      ]);
      console.log(`✅ ${students.length} étudiants créés`);
    } else {
      console.log(`✅ ${studentsCount} étudiants existent déjà`);
    }

    // 3. Créer des professeurs de test
    const teachersCount = await Teacher.countDocuments();
    if (teachersCount === 0) {
      const teachers = await Teacher.create([
        {
          nom: "Dubois",
          prenom: "Jean",
          email: "jean.dubois@prof.com",
          password: await bcrypt.hash("password123", 12),
          matiere: "Mathématiques",
          telephone: "+33 6 45 67 89 01",
          adresse: "321 Rue des Professeurs, Paris",
          role: "professeur"
        },
        {
          nom: "Petit",
          prenom: "Marie",
          email: "marie.petit@prof.com",
          password: await bcrypt.hash("password123", 12),
          matiere: "Français",
          telephone: "+33 6 56 78 90 12",
          adresse: "654 Avenue de l'Enseignement, Lyon",
          role: "professeur"
        }
      ]);
      console.log(`✅ ${teachers.length} professeurs créés`);
    } else {
      console.log(`✅ ${teachersCount} professeurs existent déjà`);
    }

    // 4. Créer des cours de test
    const coursesCount = await Course.countDocuments();
    if (coursesCount === 0) {
      const courses = await Course.create([
        {
          matiere: "Mathématiques",
          description: "Cours d'algèbre et géométrie",
          classe: "Terminale S",
          professeur: (await Teacher.findOne({ matiere: "Mathématiques" }))._id
        },
        {
          matiere: "Français",
          description: "Cours de littérature française",
          classe: "Terminale S",
          professeur: (await Teacher.findOne({ matiere: "Français" }))._id
        }
      ]);
      console.log(`✅ ${courses.length} cours créés`);
    } else {
      console.log(`✅ ${coursesCount} cours existent déjà`);
    }

    // 5. Créer des notes de test
    const notesCount = await Note.countDocuments();
    if (notesCount === 0) {
      const students = await Student.find().limit(2);
      const notes = await Note.create([
        {
          etudiant: students[0]._id,
          matiere: "Mathématiques",
          note: 16,
          coefficient: 1,
          date: new Date()
        },
        {
          etudiant: students[1]._id,
          matiere: "Français",
          note: 14,
          coefficient: 1,
          date: new Date()
        }
      ]);
      console.log(`✅ ${notes.length} notes créées`);
    } else {
      console.log(`✅ ${notesCount} notes existent déjà`);
    }

    // 6. Créer des absences de test
    const absencesCount = await Absence.countDocuments();
    if (absencesCount === 0) {
      const students = await Student.find().limit(1);
      const absences = await Absence.create([
        {
          etudiant: students[0]._id,
          matiere: "Mathématiques",
          date: new Date(),
          motif: "Maladie",
          justifiee: false
        }
      ]);
      console.log(`✅ ${absences.length} absences créées`);
    } else {
      console.log(`✅ ${absencesCount} absences existent déjà`);
    }

    // 7. Créer des rappels de test
    const rappelsCount = await Rappel.countDocuments();
    if (rappelsCount === 0) {
      const students = await Student.find().limit(1);
      const teachers = await Teacher.find().limit(1);
      const rappels = await Rappel.create([
        {
          titre: "Devoir de mathématiques",
          description: "Rendre le devoir sur les fonctions",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Dans 7 jours
          etudiant: students[0]._id,
          professeur: teachers[0]._id,
          type: "devoir"
        }
      ]);
      console.log(`✅ ${rappels.length} rappels créés`);
    } else {
      console.log(`✅ ${rappelsCount} rappels existent déjà`);
    }

    // 8. Créer des demandes de test
    const demandesCount = await Demande.countDocuments();
    if (demandesCount === 0) {
      const students = await Student.find().limit(1);
      const demandes = await Demande.create([
        {
          type: "certificat",
          description: "Demande de certificat de scolarité",
          etudiant: students[0]._id,
          statut: "en_attente",
          date: new Date()
        }
      ]);
      console.log(`✅ ${demandes.length} demandes créées`);
    } else {
      console.log(`✅ ${demandesCount} demandes existent déjà`);
    }

    // 9. Créer des formations de test
    const formationsCount = await Formation.countDocuments();
    if (formationsCount === 0) {
      const formations = await Formation.create([
        {
          titre: "Formation Python",
          description: "Apprendre la programmation Python",
          prix: 299,
          duree: "20 heures",
          niveau: "Débutant"
        },
        {
          titre: "Formation Web",
          description: "Développement web moderne",
          prix: 399,
          duree: "30 heures",
          niveau: "Intermédiaire"
        }
      ]);
      console.log(`✅ ${formations.length} formations créées`);
    } else {
      console.log(`✅ ${formationsCount} formations existent déjà`);
    }

    console.log("\n🎉 DONNÉES ADMIN CRÉÉES AVEC SUCCÈS !");
    console.log("📧 Admin: admin@learnup.com");
    console.log("🔑 Mot de passe: admin123");

  } catch (error) {
    console.error("❌ Erreur:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Déconnexion de MongoDB");
  }
};

fixAdminData(); 