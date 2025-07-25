const Course = require("../models/Course");
const Seance = require("../models/Seance");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

exports.getProfDashboard = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email du professeur requis." });
  }

  try {
    // 🔍 Trouver le professeur
    const prof = await Teacher.findOne({ email });
    if (!prof) {
      return res.status(404).json({ message: "Professeur non trouvé." });
    }

    // 📊 Cours associés à ce professeur
    const cours = await Course.find({ teacher: prof._id });

    // 👨‍🎓 Étudiants inscrits à ses cours
    const studentIdsSet = new Set();
    cours.forEach(course => {
      course.students.forEach(studentId => studentIdsSet.add(studentId.toString()));
    });

    // 🗓️ Prochaine séance
    const now = new Date();
    const prochainesSessions = await Seance.find({
      professeur: prof._id,
      date: { $gte: now }
    })
      .sort({ date: 1 })
      .limit(3)
      .lean();

    // 🕒 Trouver le prochain cours
    const prochainCours = prochainesSessions.length ? prochainesSessions[0] : null;

    // 📈 Moyenne fictive (exemple)
    const avgPerformance = 10;

    res.json({
      totalCours: cours.length,
      totalEtudiants: studentIdsSet.size,
      avgPerformance,
      prochainCours,
      prochainesSessions
    });
  } catch (err) {
    console.error("Erreur dashboard prof :", err);
    res.status(500).json({ message: "Erreur interne serveur." });
  }
};
