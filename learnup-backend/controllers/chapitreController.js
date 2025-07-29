// controllers/chapitreController.js
const Chapitre = require("../models/Chapitre");
const Course   = require("../models/Course");

/**
 * Récupérer un chapitre par ID avec vérification des permissions
 */
const getChapitreById = async (req, res) => {
  try {
    const { chapitreId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    console.log("🔍 getChapitreById - chapitreId:", chapitreId);
    console.log("🔍 getChapitreById - user:", { id: userId, role: userRole });

    // Récupérer le chapitre avec son cours
    const chapitre = await Chapitre.findById(chapitreId).populate({
      path: "course",
      populate: ["matiere", "teacher", "etudiants"]
    });

    if (!chapitre) {
      console.log("❌ Chapitre introuvable:", chapitreId);
      return res.status(404).json({ message: "Chapitre introuvable" });
    }

    console.log("✅ Chapitre trouvé:", chapitre.titre);

    // Vérifier les permissions selon le rôle
    if (userRole === "teacher" || userRole === "prof") {
      // Professeur : vérifier qu'il enseigne le cours
      if (chapitre.course.teacher.toString() !== userId.toString()) {
        console.log("❌ Professeur n'enseigne pas ce cours");
        return res.status(403).json({ message: "Vous n'enseignez pas ce cours" });
      }
    } else if (userRole === "student" || userRole === "etudiant") {
      // Étudiant : vérifier qu'il est inscrit au cours
      const isEnrolled = chapitre.course.etudiants.some(studentId => 
        studentId.toString() === userId.toString()
      );
      if (!isEnrolled) {
        console.log("❌ Étudiant non inscrit au cours");
        return res.status(403).json({ message: "Vous n'êtes pas inscrit à ce cours" });
      }
    }

    console.log("✅ Permissions OK pour l'utilisateur");
    res.json(chapitre);
  } catch (err) {
    console.error("❌ Erreur getChapitreById:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Récupérer tous les chapitres pour le prof connecté,
 * en filtrant sur les cours qu’il enseigne.
 */
const getChapitresByTeacher = async (req, res) => {
  try {
    const teacherId = req.user._id;
    // 1) Récupère les IDs de tous les cours du prof
    const courses = await Course.find({ teacher: teacherId }, "_id").lean();
    const courseIds = courses.map(c => c._id);

    // 2) Récupère les chapitres liés à ces cours
    const chapitres = await Chapitre.find({ course: { $in: courseIds } })
      .populate({
        path: "course",
        populate: ["matiere", "teacher", "etudiants"]
      })
      .sort("order")
      .exec();

    res.json(chapitres);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors récupération chapitres" });
  }
};

/**
 * Créer un nouveau chapitre lié à un seul courseId.
 */
const createChapitre = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { titre, description = "", order = 0, ressources = [], courseId } = req.body;

    if (!titre)    return res.status(400).json({ message: "Le titre est obligatoire" });
    if (!courseId) return res.status(400).json({ message: "Le courseId est obligatoire" });

    // Vérifie que le cours existe et appartient bien au prof
    const course = await Course.findById(courseId);
    if (!course)                              return res.status(404).json({ message: "Cours introuvable" });
    if (course.teacher.toString() !== teacherId.toString())
                                              return res.status(403).json({ message: "Non autorisé" });

    // Création du chapitre
    const chap = await Chapitre.create({
      titre,
      description,
      order,
      ressources,
      course: course._id
    });

    res.status(201).json(chap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors création chapitre" });
  }
};

/**
 * Modifier un chapitre (uniquement si le prof qui l’a créé, via le course.teacher).
 */
const updateChapitre = async (req, res) => {
  try {
    const teacherId  = req.user._id;
    const { chapitreId } = req.params;
    const { titre, description, order, ressources, courseId } = req.body;

    // 1) Récupère le chapitre + son cours
    const chap = await Chapitre.findById(chapitreId).populate("course");
    if (!chap) return res.status(404).json({ message: "Chapitre introuvable" });
    // 2) Vérifie que c’est bien le prof
    if (chap.course.teacher.toString() !== teacherId.toString()) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    // 3) Applique les mises à jour
    if (titre)            chap.titre       = titre;
    if (description !== undefined) chap.description = description;
    if (order !== undefined)       chap.order       = order;
    if (ressources !== undefined)  chap.ressources  = ressources;

    // 4) Éventuel changement de cours
    if (courseId) {
      const newCourse = await Course.findById(courseId);
      if (!newCourse) return res.status(404).json({ message: "Cours introuvable" });
      if (newCourse.teacher.toString() !== teacherId.toString()) {
        return res.status(403).json({ message: "Non autorisé" });
      }
      chap.course = newCourse._id;
    }

    await chap.save();
    res.json(chap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors mise à jour chapitre" });
  }
};

/**
 * (Re)lier un chapitre à un nouveau cours.
 */
const addCourseToChapitre = async (req, res) => {
  try {
    const teacherId   = req.user._id;
    const { chapitreId, courseId } = req.params;

    // 1) Charge chapitre + son cours actuel
    const chap = await Chapitre.findById(chapitreId).populate("course");
    if (!chap) return res.status(404).json({ message: "Chapitre introuvable" });
    if (chap.course.teacher.toString() !== teacherId.toString()) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    // 2) Vérifie et attribue le nouveau cours
    const newCourse = await Course.findById(courseId);
    if (!newCourse) return res.status(404).json({ message: "Cours introuvable" });
    if (newCourse.teacher.toString() !== teacherId.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }
    chap.course = newCourse._id;
    await chap.save();

    res.json(chap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors ajout cours au chapitre" });
  }
};

/**
 * Supprimer un chapitre (uniquement par le prof propriétaire).
 */
const deleteChapitre = async (req, res) => {
  try {
    const teacherId   = req.user._id;
    const { chapitreId } = req.params;

    const chap = await Chapitre.findById(chapitreId).populate("course");
    if (!chap) return res.status(404).json({ message: "Chapitre introuvable" });
    if (chap.course.teacher.toString() !== teacherId.toString()) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    await chap.deleteOne();
    res.json({ message: "Chapitre supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors suppression chapitre" });
  }
};

module.exports = {
  getChapitreById,
  getChapitresByTeacher,
  createChapitre,
  updateChapitre,
  addCourseToChapitre,
  deleteChapitre,
};
