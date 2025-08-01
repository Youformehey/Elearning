const Absence = require("../models/Absence");
const mongoose = require("mongoose");

// ✅ Compte les absences d’un étudiant pour un cours
const countAbsencesForStudent = async (studentId, courseId) => {
  return await Absence.countDocuments({ student: studentId, course: courseId });
};

// ✅ Enregistre les absences groupées (appelé lors du bouton "Sauvegarder")
const enregistrerAbsences = async (req, res) => {
  const { courseId, attendance } = req.body;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const absences = [];

    for (const [studentId, isAbsent] of Object.entries(attendance)) {
      if (!isAbsent) continue;

      const existing = await Absence.findOne({
        student: studentId,
        course: courseId,
        date: today,
      });

      if (existing) continue;

      const total = await countAbsencesForStudent(studentId, courseId);
      if (total >= 6) continue;

      const newAbs = await Absence.create({
        course: courseId,
        student: studentId,
        date: today,
      });

      absences.push(newAbs);
    }

    res.status(200).json({
      message: "Absences enregistrées.",
      totalAbsents: absences.length,
    });
  } catch (err) {
    console.error("❌ Erreur :", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Marque ou retire une absence spécifique
const marquerAbsence = async (req, res) => {
  const { etudiantId, coursId, date } = req.body;

  try {
    const parsedDate = new Date(date);
    parsedDate.setHours(0, 0, 0, 0);

    const existing = await Absence.findOne({
      student: etudiantId,
      course: coursId,
      date: parsedDate,
    });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ removed: true, message: "Présence marquée" });
    }

    const total = await countAbsencesForStudent(etudiantId, coursId);
    if (total >= 6) {
      return res.status(400).json({ message: "⚠️ Limite atteinte" });
    }

    const newAbs = await Absence.create({
      student: etudiantId,
      course: coursId,
      date: parsedDate,
    });

    res.status(200).json({ removed: false, message: "Absence marquée", absence: newAbs });
  } catch (err) {
    console.error("❌ Erreur :", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Récupère toutes les absences d’un cours
const getAbsencesParCours = async (req, res) => {
  try {
    const absences = await Absence.find({ course: req.params.courseId })
      .populate("student", "name email")
      .sort({ date: -1 });

    res.status(200).json(absences);
  } catch (err) {
    console.error("❌ Erreur récupération absences par cours :", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 📊 Stats d'absences par matière, classe et prof
const getAbsencesParMatiereEtClasse = async (req, res) => {
  const { matiere, classe, profId } = req.params;

  try {
    const Course = mongoose.model("Course");
    const cours = await Course.find({
      matiere,
      classe,
      teacher: profId,
    });

    const courseIds = cours.map((c) => c._id);

    const absences = await Absence.find({ course: { $in: courseIds } })
      .populate("student", "name email")
      .lean();

    const stats = {};

    absences.forEach((abs) => {
      const id = abs.student._id.toString();
      if (!stats[id]) {
        stats[id] = {
          name: abs.student.name,
          email: abs.student.email,
          totalHours: 0,
        };
      }
      stats[id].totalHours += 2;
    });

    res.status(200).json({ absences: Object.values(stats) });
  } catch (err) {
    console.error("❌ Erreur stats matière-classe :", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getAbsencesByCourseId = async (req, res) => {
  const { courseId } = req.params;

  try {
    const absences = await Absence.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: "$student",
          totalHours: { $sum: 2 },
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      {
        $project: {
          name: "$student.name",
          email: "$student.email",
          totalHours: 1,
        },
      },
    ]);

    res.status(200).json({ absences });
  } catch (err) {
    console.error("❌ Erreur récupération stats par courseId:", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Récupère les absences d’un étudiant regroupées par matière
const getAbsencesEtudiantParMatiere = async (req, res) => {
  try {
    const studentId = req.user._id;

    const absences = await Absence.find({ student: studentId })
      .populate({
        path: "course",
        populate: { path: "matiere" }
      });

    const grouped = {};

    for (const abs of absences) {
      const matiereNom = abs.course?.matiere?.nom || "Inconnue";
      if (!grouped[matiereNom]) grouped[matiereNom] = 0;
      grouped[matiereNom] += 1;
    }

    const result = Object.entries(grouped).map(([matiere, nbAbs]) => {
      const heures = nbAbs * 2;
      return {
        matiere,
        totalAbsences: nbAbs,
        totalHeures: heures,
        limiteDepassee: heures > 12,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Erreur getAbsencesEtudiantParMatiere :", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  enregistrerAbsences,
  marquerAbsence,
  getAbsencesParCours,
  getAbsencesParMatiereEtClasse,
  getAbsencesByCourseId,
  getAbsencesEtudiantParMatiere,
};
