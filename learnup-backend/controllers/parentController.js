const Parent = require("../models/Parent");
const Student = require("../models/Student");
const Absence = require("../models/Absence");
const Note = require("../models/Note");
const Formation = require("../models/Formation");
const Demande = require("../models/Demande");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const registerParent = async (req, res) => {
  try {
    const { name, email, password, tel, adresse } = req.body;
    if (!name || !email || !password || !tel) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    // Vérifie si l'email existe déjà
    const existingUser = await Parent.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // 🔐 Hasher le mot de passe AVANT de sauvegarder
    const hashedPassword = await require('bcryptjs').hash(password, 10);

    const newParent = new Parent({
      name,
      email,
      password: hashedPassword, // mot de passe sécurisé
      tel,
      adresse,
      role: "parent"
    });

    await newParent.save();

    const token = require('jsonwebtoken').sign(
      { _id: newParent._id, email: newParent.email, role: newParent.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      _id: newParent._id,
      name: newParent.name,
      email: newParent.email,
      tel: newParent.tel,
      token,
    });
  } catch (err) {
    console.error("Erreur registerParent:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// Connexion parent
const loginParent = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const parent = await Parent.findOne({ email });
    if (!parent) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const isMatch = await parent.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign(
      { _id: parent._id, email: parent.email, role: "parent" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      _id: parent._id,
      name: parent.name,
      email: parent.email,
      tel: parent.tel,
      token,
    });
  } catch (err) {
    console.error("Erreur loginParent:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Profil parent connecté
const getParentProfile = async (req, res) => {
  try {
    const parent = await Parent.findById(req.user._id)
      .select("-password")
      .populate("children", "name email classe");
    
    if (!parent) return res.status(404).json({ message: "Parent non trouvé" });
    
    res.json(parent);
  } catch (err) {
    console.error("Erreur getParentProfile:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mettre à jour le profil parent
const updateParentProfile = async (req, res) => {
  try {
    const { name, tel, adresse } = req.body;
    const parent = await Parent.findById(req.user._id);
    
    if (!parent) return res.status(404).json({ message: "Parent non trouvé" });
    
    if (name) parent.name = name;
    if (tel) parent.tel = tel;
    if (adresse) parent.adresse = adresse;
    
    await parent.save();
    
    res.json({
      _id: parent._id,
      name: parent.name,
      email: parent.email,
      tel: parent.tel,
      adresse: parent.adresse,
    });
  } catch (err) {
    console.error("Erreur updateParentProfile:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer les absences des enfants groupées par enfant
const getChildrenAbsences = async (req, res) => {
  try {
    const parent = await Parent.findById(req.user._id).populate("children");
    if (!parent) return res.status(404).json({ message: "Parent non trouvé" });
    
    const childrenIds = parent.children.map(child => child._id);
    const absences = await Absence.find({ etudiant: { $in: childrenIds } })
      .populate("etudiant", "name classe email")
      .populate("seance", "date matiere")
      .sort({ createdAt: -1 });
    
    // Grouper les absences par enfant
    const absencesByChild = {};
    parent.children.forEach(child => {
      absencesByChild[child._id] = {
        enfant: {
          _id: child._id,
          name: child.name,
          email: child.email,
          classe: child.classe
        },
        absences: absences.filter(absence => absence.etudiant._id.toString() === child._id.toString())
      };
    });
    
    res.json(absencesByChild);
  } catch (err) {
    console.error("Erreur getChildrenAbsences:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer les notes des enfants groupées par enfant
const getChildrenNotes = async (req, res) => {
  try {
    const parent = await Parent.findById(req.user._id).populate("children");
    if (!parent) return res.status(404).json({ message: "Parent non trouvé" });
    
    const childrenIds = parent.children.map(child => child._id);
    const notes = await Note.find({ etudiant: { $in: childrenIds } })
      .populate("etudiant", "name classe email")
      .populate("cours", "titre")
      .sort({ createdAt: -1 });
    
    // Grouper les notes par enfant
    const notesByChild = {};
    parent.children.forEach(child => {
      notesByChild[child._id] = {
        enfant: {
          _id: child._id,
          name: child.name,
          email: child.email,
          classe: child.classe
        },
        notes: notes.filter(note => note.etudiant._id.toString() === child._id.toString())
      };
    });
    
    res.json(notesByChild);
  } catch (err) {
    console.error("Erreur getChildrenNotes:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer les formations disponibles
const getFormations = async (req, res) => {
  try {
    const formations = await Formation.find({}).sort({ createdAt: -1 });
    res.json(formations);
  } catch (err) {
    console.error("Erreur getFormations:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Payer une formation
const payFormation = async (req, res) => {
  try {
    const { formationId, paymentInfo } = req.body;
    const parent = await Parent.findById(req.user._id);
    
    if (!parent) return res.status(404).json({ message: "Parent non trouvé" });
    
    // Ici tu peux intégrer une vraie passerelle de paiement
    // Pour l'instant, on simule un paiement réussi
    
    // Mettre à jour les infos de paiement du parent
    parent.paymentInfo = paymentInfo;
    await parent.save();
    
    res.json({ message: "Paiement effectué avec succès" });
  } catch (err) {
    console.error("Erreur payFormation:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Ajouter un enfant au parent
const addChild = async (req, res) => {
  try {
    const { studentEmail } = req.body;
    const parent = await Parent.findById(req.user._id);
    const student = await Student.findOne({ email: studentEmail });
    
    if (!parent) return res.status(404).json({ message: "Parent non trouvé" });
    if (!student) return res.status(404).json({ message: "Étudiant non trouvé" });
    
    // Vérifier si l'étudiant n'est pas déjà lié à ce parent
    if (parent.children.includes(student._id)) {
      return res.status(400).json({ message: "Cet étudiant est déjà lié à votre compte" });
    }
    
    // Ajouter l'étudiant aux enfants du parent
    parent.children.push(student._id);
    await parent.save();
    
    // Ajouter le parent aux parents de l'étudiant
    student.parents.push(parent._id);
    await student.save();
    
    res.json({ message: "Enfant ajouté avec succès" });
  } catch (err) {
    console.error("Erreur addChild:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer les demandes des enfants groupées par enfant
const getChildrenDemandes = async (req, res) => {
  try {
    const parent = await Parent.findById(req.user._id).populate("children");
    if (!parent) return res.status(404).json({ message: "Parent non trouvé" });
    
    const childrenIds = parent.children.map(child => child._id);
    const demandes = await Demande.find({ etudiant: { $in: childrenIds } })
      .populate("etudiant", "name classe email")
      .sort({ createdAt: -1 });
    
    // Grouper les demandes par enfant
    const demandesByChild = {};
    parent.children.forEach(child => {
      demandesByChild[child._id] = {
        enfant: {
          _id: child._id,
          name: child.name,
          email: child.email,
          classe: child.classe
        },
        demandes: demandes.filter(demande => demande.etudiant._id.toString() === child._id.toString())
      };
    });
    
    res.json(demandesByChild);
  } catch (err) {
    console.error("Erreur getChildrenDemandes:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  registerParent,
  loginParent,
  getParentProfile,
  updateParentProfile,
  getChildrenAbsences,
  getChildrenNotes,
  getFormations,
  payFormation,
  addChild,
  getChildrenDemandes
}; 