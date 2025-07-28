const Formation = require("../models/Formation");
const Student = require("../models/Student");

// Récupérer toutes les formations avec statut pour l'étudiant
exports.getFormations = async (req, res) => {
  try {
    const formations = await Formation.find({ statut: "disponible" }).sort({ createdAt: -1 });
    const etudiantId = req.user._id;

    // Ajouter le statut d'achat pour chaque formation
    const formationsAvecStatut = formations.map(formation => {
      const aAchete = formation.etudiantsAcheteurs.some(
        achat => achat.etudiant.toString() === etudiantId.toString() && achat.statutPaiement === "complete"
      );
      
      return {
        ...formation.toObject(),
        statut: aAchete ? "achete" : "disponible"
      };
    });

    res.json(formationsAvecStatut);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur : " + err.message });
  }
};

// Récupérer les formations achetées par l'étudiant
exports.getFormationsAchetees = async (req, res) => {
  try {
    const etudiantId = req.user._id;
    
    const formations = await Formation.find({
      "etudiantsAcheteurs.etudiant": etudiantId,
      "etudiantsAcheteurs.statutPaiement": "complete"
    }).populate("etudiantsAcheteurs.etudiant", "name email");

    const formationsAchetees = formations.map(formation => ({
      ...formation.toObject(),
      statut: "achete"
    }));

    res.json(formationsAchetees);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur : " + err.message });
  }
};

// Acheter une formation (simulation Stripe)
exports.acheterFormation = async (req, res) => {
  try {
    const { formationId } = req.params;
    const etudiantId = req.user._id;

    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ error: "Formation introuvable" });
    }

    // Vérifier si l'étudiant a déjà acheté cette formation
    const dejaAchete = formation.etudiantsAcheteurs.some(
      achat => achat.etudiant.toString() === etudiantId.toString()
    );

    if (dejaAchete) {
      return res.status(400).json({ error: "Vous avez déjà acheté cette formation" });
    }

    // Simuler un paiement Stripe réussi
    const stripePaymentId = `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Ajouter l'étudiant aux acheteurs
    formation.etudiantsAcheteurs.push({
      etudiant: etudiantId,
      stripePaymentId,
      statutPaiement: "complete"
    });

    await formation.save();

    res.json({ 
      message: "Formation achetée avec succès",
      formation: {
        ...formation.toObject(),
        statut: "achete"
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur : " + err.message });
  }
};

// Vérifier l'accès à une formation
exports.verifierAcces = async (req, res) => {
  try {
    const { formationId } = req.params;
    const etudiantId = req.user._id;

    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ error: "Formation introuvable" });
    }

    const aAcces = formation.etudiantsAcheteurs.some(
      achat => achat.etudiant.toString() === etudiantId.toString() && achat.statutPaiement === "complete"
    );

    if (!aAcces) {
      return res.status(403).json({ error: "Accès refusé. Vous devez acheter cette formation." });
    }

    res.json({ 
      message: "Accès autorisé",
      formation: {
        ...formation.toObject(),
        statut: "achete"
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur : " + err.message });
  }
};

// Créer une nouvelle formation (admin/prof)
exports.creerFormation = async (req, res) => {
  try {
    const {
      titre,
      description,
      prix,
      duree,
      niveau,
      categorie,
      icon,
      couleur,
      bgCouleur,
      borderCouleur,
      contenu,
      videoUrl
    } = req.body;

    const formation = new Formation({
      titre,
      description,
      prix,
      duree,
      niveau,
      categorie,
      icon,
      couleur,
      bgCouleur,
      borderCouleur,
      contenu,
      videoUrl
    });

    await formation.save();
    res.status(201).json({ message: "Formation créée avec succès", formation });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur : " + err.message });
  }
};

// Modifier une formation
exports.modifierFormation = async (req, res) => {
  try {
    const { formationId } = req.params;
    const updates = req.body;

    const formation = await Formation.findByIdAndUpdate(
      formationId,
      updates,
      { new: true, runValidators: true }
    );

    if (!formation) {
      return res.status(404).json({ error: "Formation introuvable" });
    }

    res.json({ message: "Formation modifiée avec succès", formation });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur : " + err.message });
  }
};

// Supprimer une formation
exports.supprimerFormation = async (req, res) => {
  try {
    const { formationId } = req.params;

    const formation = await Formation.findByIdAndDelete(formationId);
    if (!formation) {
      return res.status(404).json({ error: "Formation introuvable" });
    }

    res.json({ message: "Formation supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur : " + err.message });
  }
}; 