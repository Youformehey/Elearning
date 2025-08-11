const express = require("express");
const router = express.Router();
const Seance = require("../models/Seance");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { 
  getSeancesByStudent, 
  getAllSeancesForStudents,
  getSeancesByEmail, 
  createSeance,
  marquerSeanceFaite,
  deleteSeance,
  getSeancesByCourse
} = require("../controllers/seanceController");

// GET toutes les séances d'un professeur
router.get("/professeur", protect, authorizeRoles("teacher", "admin"), getSeancesByEmail);

// GET toutes les séances d'un étudiant (par classe)
router.get("/etudiant", protect, authorizeRoles("student", "admin"), getSeancesByStudent);

// GET toutes les séances (pour les étudiants - toutes les séances disponibles)
router.get("/etudiant/all", protect, authorizeRoles("student", "admin"), getAllSeancesForStudents);

// GET toutes les séances d'un cours spécifique
router.get("/course/:courseId", protect, authorizeRoles("teacher", "prof", "admin"), getSeancesByCourse);

// POST création séance (professeur, admin)
router.post("/", protect, authorizeRoles("teacher", "prof", "admin"), createSeance);

// PUT mise à jour statut 'fait' d'une séance
router.put("/:id/mark", protect, authorizeRoles("teacher", "prof", "admin"), marquerSeanceFaite);

// DELETE suppression séance
router.delete("/:id", protect, authorizeRoles("teacher", "prof", "admin"), deleteSeance);

// POST génération automatique de séances pour un cours
router.post("/generate", protect, authorizeRoles("teacher", "prof", "admin"), async (req, res) => {
  try {
    const { courseId, startDate, endDate, frequency, duration, status } = req.body;
    
    const Course = require("../models/Course");
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const seances = [];
    
    // Générer les séances selon la fréquence
    let currentDate = new Date(start);
    while (currentDate <= end) {
      const seance = new Seance({
        course: courseId,
        date: new Date(currentDate),
        duree: duration || 120, // 2 heures par défaut
        status: status || "planned",
        titre: `${course.nom} - Séance ${seances.length + 1}`,
        description: `Séance automatiquement générée pour ${course.nom}`,
        salle: course.salle || "À définir",
        horaire: course.horaire || "À définir"
      });
      
      seances.push(seance);
      
      // Passer à la prochaine date selon la fréquence
      if (frequency === "daily") {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (frequency === "weekly") {
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (frequency === "biweekly") {
        currentDate.setDate(currentDate.getDate() + 14);
      } else {
        currentDate.setDate(currentDate.getDate() + 7); // Par défaut hebdomadaire
      }
    }
    
    // Sauvegarder toutes les séances
    await Seance.insertMany(seances);
    
    res.status(201).json({ 
      message: `${seances.length} séances générées avec succès`,
      seances: seances.length
    });
    
  } catch (err) {
    console.error("❌ Erreur génération séances:", err.message);
    res.status(500).json({ message: "Erreur lors de la génération des séances" });
  }
});

module.exports = router;
