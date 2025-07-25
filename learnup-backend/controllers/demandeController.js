const Demande = require("../models/Demande");

// ✅ Créer une nouvelle demande (étudiant)
exports.creerDemande = async (req, res) => {
  try {
    const demande = new Demande(req.body);
    const saved = await demande.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Erreur création demande:", err);
    res.status(400).json({ error: "Erreur lors de la création de la demande." });
  }
};

// ✅ Récupérer les demandes d’un professeur
exports.getDemandesByProf = async (req, res) => {
  const { profId } = req.params;
  try {
    const demandes = await Demande.find({ professeur: profId }).sort({ createdAt: -1 });
    res.json(demandes);
  } catch (err) {
    console.error("Erreur récupération demandes:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// ✅ Modifier le statut d'une demande
exports.updateDemande = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Demande.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Demande non trouvée" });
    res.json(updated);
  } catch (err) {
    console.error("Erreur mise à jour demande:", err);
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

// ✅ Récupérer une seule demande (détail)
exports.getOneDemande = async (req, res) => {
  const { id } = req.params;
  try {
    const demande = await Demande.findById(id);
    if (!demande) return res.status(404).json({ error: "Demande introuvable" });
    res.json(demande);
  } catch (err) {
    console.error("Erreur détail demande:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
