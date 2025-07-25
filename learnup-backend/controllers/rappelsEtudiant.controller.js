const RappelEtudiant = require("../models/RappelEtudiant");
const Rappel = require("../models/Rappel");

// ➕ Marquer un rappel comme fait (ou non)
const marquerFait = async (req, res) => {
  const { rappelId } = req.params;
  const userId = req.user._id;
  const { fait, remarque } = req.body;

  try {
    let rappelEtudiant = await RappelEtudiant.findOne({ rappel: rappelId, etudiant: userId });

    if (!rappelEtudiant) {
      // Si l'étudiant ne l'a jamais vu, on crée un suivi
      rappelEtudiant = new RappelEtudiant({
        rappel: rappelId,
        etudiant: userId,
        fait,
        remarque,
      });
    } else {
      rappelEtudiant.fait = fait;
      if (remarque !== undefined) rappelEtudiant.remarque = remarque;
    }

    await rappelEtudiant.save();
    res.json(rappelEtudiant);
  } catch (error) {
    console.error("Erreur marquerFait:", error.message);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 📥 Récupérer tous les rappels de la classe de l’étudiant + état fait/remarque si dispo
const getRappelsEtudiant = async (req, res) => {
  const userId = req.user._id;
  const classe = req.user.classe; // 👈 Assure-toi que ce champ est bien fourni par le middleware `protect`

  try {
    // 1. Tous les rappels liés à la classe
    const rappelsClasse = await Rappel.find({ classe }).sort({ date: -1 });

    // 2. Les suivis spécifiques de cet étudiant
    const suivis = await RappelEtudiant.find({ etudiant: userId });

    // 3. Créer une map pour accès rapide
    const suiviMap = {};
    suivis.forEach((suivi) => {
      suiviMap[suivi.rappel.toString()] = suivi;
    });

    // 4. Fusionner pour chaque rappel un état personnalisé
    const rappelsFinal = rappelsClasse.map((rappel) => {
      const suivi = suiviMap[rappel._id.toString()];
      return {
        ...rappel._doc,
        fait: suivi?.fait || false,
        remarque: suivi?.remarque || "",
      };
    });

    res.json(rappelsFinal);
  } catch (error) {
    console.error("Erreur getRappelsEtudiant:", error.message);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

module.exports = {
  marquerFait,
  getRappelsEtudiant,
};
