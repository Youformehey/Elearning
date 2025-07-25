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
    // 🔍 Trouver le professeur par email
    const prof = await Teacher.findOne({ email });
    if (!prof) return res.status(404).json({ error: "Professeur non trouvé" });

    const profId = prof._id;

    // 📚 Total des cours donnés par ce prof
    const totalCours = await Course.countDocuments({ professeur: profId });

    // 🎓 Étudiants dans les classes du prof
    // (si le prof a un champ `classes` qui contient des noms de classes)
    const totalEtudiants = await Student.countDocuments({ classe: { $in: prof.classes || [] } });

    // ⏭️ Prochain cours
    const prochainCours = await Seance.findOne({
      professeur: profId,
      date: { $gte: new Date() },
    }).sort({ date: 1 });

    // 🗓️ Prochaines sessions
    const prochainesSessions = await Seance.find({
      professeur: profId,
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(3);

    // 📊 Performance moyenne (sur les notes attribuées par ce prof)
    const performances = await Note.aggregate([
      { $match: { professeur: profId } },
      { $group: { _id: null, avg: { $avg: "$note" } } },
    ]);
    const avgPerformance = performances[0]?.avg ?? null;

    // ✅ Réponse complète
    res.json({
      totalCours,
      totalEtudiants,
      prochainCours,
      prochainesSessions,
      avgPerformance: avgPerformance ? Math.round(avgPerformance) : 0,
    });
  } catch (err) {
    console.error("Erreur dashboard :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
