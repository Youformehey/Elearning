require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion MongoDB
console.log("🔐 MONGO_URI:", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connecté");

    // Import explicite des modèles pour éviter MissingSchemaError
    require("./models/Student");
    require("./models/Course");
    require("./models/Chapitre");
    require("./models/Teacher");
    require("./models/Matiere");
    require("./models/Absence");
    require("./models/Homework");
    require("./models/HomeworkSubmission");
    require("./models/ForumMessage");
    require("./models/Seance");
    require("./models/Formation");
    require("./models/Parent");

    // Import des routes
    const routes = {
      students: require("./routes/studentRoutes"),
      teachers: require("./routes/teacherRoutes"),
      admins: require("./routes/adminRoutes"),
      courses: require("./routes/courseRoutes"),
      forum: require("./routes/forumRoutes"),
      documents: require("./routes/documentRoutes"),
      rappels: require("./routes/rappelRoutes"),
      rappelsEtudiant: require("./routes/rappelsEtudiant.routes"),
      quiz: require("./routes/quizRoutes"),
      absences: require("./routes/absenceRoutes"),
      seances: require("./routes/seanceRoutes"),
      notes: require("./routes/noteRoutes"),
      upload: require("./routes/upload"),
      prof: require("./routes/prof"),
      demandes: require("./routes/demandesRoutes"),
      assistant: require("./routes/assistant"),
      formations: require("./routes/formationRoutes"),
      parents: require("./routes/parentRoutes"),
    };

    const rappelFaitRoutes = require("./routes/rappelFaitRoutes");
    const matiereRoutes = require("./routes/matieres");
    const chapitresRoutes = require("./routes/chapitres");
    const userRoutes = require("./routes/userRoutes");

    // Vérification des routes valides
    Object.entries(routes).forEach(([name, route]) => {
      if (typeof route !== "function") {
        console.error(`❌ ERREUR: La route '${name}' n'exporte pas un router valide`);
        process.exit(1);
      }
    });

    // Enregistrement des routes avec leurs préfixes
    app.use("/api/students", routes.students);
    app.use("/api/teachers", routes.teachers);
    app.use("/api/admin", routes.admins);
    app.use("/api/courses", routes.courses);
    app.use("/api/forum", routes.forum);
    app.use("/api/documents", routes.documents);
    app.use("/api/rappels", routes.rappels);
    app.use("/api/rappelsEtudiant", routes.rappelsEtudiant);
    app.use("/api/quiz", routes.quiz);
    app.use("/api/absences", routes.absences);
    app.use("/api/seances", routes.seances);
    app.use("/api/notes", routes.notes);
    app.use("/api/upload", routes.upload);
    app.use("/api/prof", routes.prof);
    app.use("/api/demandes", routes.demandes);
    app.use("/api/assistant", routes.assistant);
    app.use("/api/formations", routes.formations);
    app.use("/api/parents", routes.parents);

    app.use("/api/chapitres", chapitresRoutes);
    app.use("/api/rappels-faits", rappelFaitRoutes);
    app.use("/api/matieres", matiereRoutes);
    app.use("/api/users", userRoutes);

    // Uploads publics
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    // Démarrage du serveur
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur MongoDB:", err.message);
    process.exit(1);
  });
