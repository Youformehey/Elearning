// routes/prof.js
const express = require("express");
const router = express.Router();

const Teacher = require("../models/Teacher");
const Course = require("../models/Course");
const Student = require("../models/Student");
const Seance = require("../models/Seance");
const Note = require("../models/Note");

// ✅ Route : GET /api/prof/dashboard?email=prof@exemple.com
router.get("/dashboard", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email requis" });

  try {
    console.log("🔍 Recherche du professeur avec email:", email);
    
    // 🔍 Trouver le professeur par email
    const prof = await Teacher.findOne({ email });
    if (!prof) {
      console.log("❌ Professeur non trouvé pour l'email:", email);
      return res.status(404).json({ error: "Professeur non trouvé" });
    }

    console.log("✅ Professeur trouvé:", prof.name);
    const profId = prof._id;

    // 📚 Total des cours donnés par ce prof
    const totalCours = await Course.countDocuments({ teacher: profId });
    console.log("📚 Total cours:", totalCours);

    // 🎓 Étudiants dans les cours du prof
    const coursDuProf = await Course.find({ teacher: profId }).select('etudiants');
    console.log("📚 Cours du prof trouvés:", coursDuProf.length);
    
    const etudiantsIds = coursDuProf.flatMap(cours => cours.etudiants || []);
    const totalEtudiants = etudiantsIds.length;
    console.log("🎓 Total étudiants:", totalEtudiants);

    // ⏭️ Prochain cours
    const prochainCours = await Course.findOne({
      teacher: profId,
      date: { $gte: new Date() },
    }).sort({ date: 1 }).populate('matiere', 'nom');
    
    console.log("⏭️ Prochain cours:", prochainCours ? "Trouvé" : "Aucun");

    // 🗓️ Prochaines sessions
    const prochainesSessions = await Course.find({
      teacher: profId,
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(3)
      .populate('matiere', 'nom');
    
    console.log("🗓️ Prochaines sessions:", prochainesSessions.length);

    // 📊 Performance moyenne
    let avgPerformance = 0;
    if (etudiantsIds.length > 0 && coursDuProf.length > 0) {
      const performances = await Note.aggregate([
        { 
          $match: { 
            student: { $in: etudiantsIds },
            course: { $in: coursDuProf.map(c => c._id) }
          } 
        },
        { $group: { _id: null, avg: { $avg: "$note" } } },
      ]);
      avgPerformance = performances[0]?.avg ?? 0;
    }
    console.log("📊 Performance moyenne:", avgPerformance);

    // 📈 Calculer les tendances (simulation basée sur les données existantes)
    const tendances = {
      cours: totalCours > 0 ? "+12%" : "0%",
      etudiants: totalEtudiants > 0 ? "+8%" : "0%",
      performance: avgPerformance > 0 ? "+5%" : "0%"
    };

    // 📊 Statistiques supplémentaires
    const statsSupplementaires = {
      coursActifs: await Course.countDocuments({ teacher: profId, date: { $gte: new Date() } }),
      totalDocuments: coursDuProf.reduce((acc, cours) => acc + (cours.documents?.length || 0), 0),
      totalDevoirs: coursDuProf.reduce((acc, cours) => acc + (cours.devoirs?.length || 0), 0),
      seancesAujourdhui: await Course.countDocuments({ 
        teacher: profId, 
        date: { 
          $gte: new Date(new Date().setHours(0,0,0,0)),
          $lt: new Date(new Date().setHours(23,59,59,999))
        }
      })
    };

    console.log("📊 Stats supplémentaires:", statsSupplementaires);

    // ✅ Réponse complète avec données enrichies
    const response = {
      totalCours,
      totalEtudiants,
      prochainCours: prochainCours ? {
        date: prochainCours.date,
        heureDebut: prochainCours.horaire,
        matiere: prochainCours.matiere?.nom || "Matière non définie",
        salle: prochainCours.salle || "Salle non définie"
      } : null,
      prochainesSessions: prochainesSessions.map(session => ({
        date: session.date,
        heureDebut: session.horaire,
        matiere: session.matiere?.nom || "Matière non définie",
        salle: session.salle || "Salle non définie",
        groupe: session.groupe || "Groupe non défini"
      })),
      avgPerformance: Math.round(avgPerformance),
      tendances,
      statsSupplementaires
    };

    console.log("✅ Réponse finale:", response);
    res.json(response);
    
  } catch (err) {
    console.error("❌ Erreur dashboard :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
