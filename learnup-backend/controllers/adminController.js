const Seance = require("../models/Seance");
const Course = require("../models/Course");

const associateOldSeancesWithCourses = async (req, res) => {
  try {
    const seances = await Seance.find({ course: { $exists: false } });

    let count = 0;

    for (const s of seances) {
      const match = await Course.findOne({
        classe: s.classe,
        salle: s.salle,
        groupe: s.groupe,
        date: s.date,
        horaire: { $regex: s.heureDebut || "", $options: "i" },
      });

      if (match) {
        s.course = match._id;
        await s.save();
        count++;
      }
    }

    res.json({ message: `${count} séances associées à un cours.` });
  } catch (error) {
    res.status(500).json({ message: "Erreur d'association", error: error.message });
  }
};

module.exports = {
  associateOldSeancesWithCourses,
  // ajoute d'autres fonctions ici si nécessaire
};
