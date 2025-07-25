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
    allowedHeaders: ["Content-Type", "Authorization"],  // <-- Ajout important
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
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => {
    console.error("❌ Erreur MongoDB:", err.message);
    process.exit(1);
  });

// Uploads publics
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import des routes (sauf matières)
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
  
};

// Import routes rappels faits et matières
const rappelFaitRoutes = require("./routes/rappelFaitRoutes");
const matiereRoutes = require("./routes/matieres");

// Import nouvelle route chapitres
const chapitresRoutes = require("./routes/chapitres");

// --- IMPORT USER ROUTES ---
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
app.use("/api/admins", routes.admins);
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

// Nouvelle route chapitres
app.use("/api/chapitres", chapitresRoutes);

app.use("/api/rappels-faits", rappelFaitRoutes);
app.use("/api/matieres", matiereRoutes);

// --- MOUNT USER ROUTES ---
app.use("/api/users", userRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
