const Absence = require("../models/Absence");
const mongoose = require("mongoose");

// ✅ Compte les absences d’un étudiant pour un cours
const countAbsencesForStudent = async (studentId, courseId) => {
  return await Absence.countDocuments({ student: studentId, course: courseId });
};

// ✅ Enregistre les absences groupées (appelé lors du bouton "Sauvegarder")
const enregistrerAbsences = async (req, res) => {
  const { courseId, attendance } = req.body;

  try {
    if (!courseId || !attendance || typeof attendance !== "object") {
      return res.status(400).json({ message: "Payload invalide" });
    }

    // Jour serveur (plage du jour)
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const ops = [];

    for (const [studentId, isAbsent] of Object.entries(attendance)) {
      if (!isAbsent) continue; // on n'enregistre que les absents

      // Limite max (6) AVANT l'upsert
      const total = await Absence.countDocuments({ student: studentId, course: courseId });
      if (total >= 6) continue;

      // Upsert: un seul enregistrement/jour/élève/cours
      ops.push(
        Absence.updateOne(
          {
            student: studentId,
            course: courseId,
            date: { $gte: dayStart, $lt: dayEnd },
          },
          {
            $setOnInsert: {
              student: studentId,
              course: courseId,
              date: new Date(), // horodatage exact, mais contraint par la plage du jour
            },
          },
          { upsert: true }
        )
      );
    }

    await Promise.all(ops);

    res.status(200).json({
      message: "Absences enregistrées.",
      totalAbsents: ops.length,
    });
  } catch (err) {
    console.error("❌ Erreur :", err.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// ✅ Marque ou retire une absence spécifique (toggle sur la journée)
const marquerAbsence = async (req, res) => {
  const { etudiantId, coursId, date } = req.body;

  try {
    const base = date ? new Date(date) : new Date();
    base.setHours(0, 0, 0, 0);
    const dayStart = base;
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const existing = await Absence.findOne({
      student: etudiantId,
      course: coursId,
      date: { $gte: dayStart, $lt: dayEnd },
    });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ removed: true, message: "Présence marquée" });
    }

    const total = await Absence.countDocuments({ student: etudiantId, course: coursId });
    if (total >= 6) {
      return res.status(400).json({ message: "⚠️ Limite atteinte" });
    }

    const newAbs = await Absence.create({
      student: etudiantId,
      course: coursId,
      date: new Date(),
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
    const courseId = req.params.courseId || req.params.coursId; // 👈 compat route
    const absences = await Absence.find({ course: courseId })
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

// ✅ Récupère les absences d'un étudiant avec détails
const getAbsencesEtudiantParMatiere = async (req, res) => {
  try {
    // 1. Récupérer l'ID étudiant depuis le token (compat id/_id)
    const studentId = req.user?.id || req.user?._id;

    // 2. Vérifier que l'ID existe
    if (!studentId) {
      return res.status(400).json({ message: "ID étudiant non trouvé" });
    }

    console.log("🔍 Recherche absences pour étudiant:", studentId);

    // 3. Rechercher les absences avec populate complet
    const absences = await Absence.find({ student: studentId })
      .populate({
        path: 'course',
        select: 'nom matiere classe teacher',
        populate: {
          path: 'matiere',
          select: 'nom'
        }
      })
      .sort({ date: -1 });

    // 4. Formater les données pour le frontend
    const formattedAbsences = absences.map(abs => ({
      _id: abs._id,
      date: abs.date,
      course: {
        _id: abs.course?._id,
        nom: abs.course?.nom || 'Non spécifié',
        matiere: abs.course?.matiere?.nom || 'Non spécifié',
        classe: abs.course?.classe
      },
      justified: false,
      hours: 2
    }));

    res.status(200).json(formattedAbsences);

  } catch (err) {
    console.error("❌ Erreur getAbsencesEtudiantParMatiere:", err);
    res.status(500).json({ 
      message: "Erreur lors de la récupération des absences",
      error: err.message 
    });
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
