const Student = require("../models/Student");
const Seance = require("../models/Seance");
const Rappel = require("../models/Rappel");
const Course = require("../models/Course");
const Chapitre = require("../models/Chapitre");
const Note = require("../models/Note");
const Absence = require("../models/Absence");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Inscription étudiant
const registerStudent = async (req, res) => {
  try {
    console.log("📝 Register Student - Body:", req.body);
    
    const { name, email, password, classe } = req.body;
    
    // Validation des champs
    if (!name || !email || !password || !classe) {
      return res.status(400).json({ 
        message: "Tous les champs sont obligatoires",
        required: ["name", "email", "password", "classe"],
        received: { name, email, password: password ? "***" : null, classe }
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Créer le nouvel étudiant
    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      classe,
      role: "student"
    });

    await newStudent.save();
    console.log("✅ Étudiant créé:", newStudent._id);

    // Générer le token JWT
    const token = jwt.sign(
      { 
        _id: newStudent._id, 
        email: newStudent.email, 
        role: newStudent.role 
      },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      _id: newStudent._id,
      name: newStudent.name,
      email: newStudent.email,
      classe: newStudent.classe,
      token,
    });
  } catch (err) {
    console.error("❌ Erreur registerStudent:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Connexion étudiant
const loginStudent = async (req, res) => {
  try {
    console.log("🔐 Login Student - Body:", req.body);
    
    const { email, password } = req.body;
    
    // Validation des champs
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email et mot de passe requis",
        required: ["email", "password"],
        received: { email, password: password ? "***" : null }
      });
    }

    // Chercher l'étudiant par email
    const student = await Student.findOne({ email });
    if (!student) {
      console.log("❌ Étudiant non trouvé:", email);
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    console.log("✅ Étudiant trouvé:", student._id);

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      console.log("❌ Mot de passe incorrect pour:", email);
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    console.log("✅ Mot de passe correct pour:", email);

    // Générer le token JWT
    const token = jwt.sign(
      { 
        _id: student._id, 
        email: student.email, 
        role: "student" 
      },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "7d" }
    );

    console.log("✅ Token généré pour:", email);

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      classe: student.classe,
      token,
    });
  } catch (err) {
    console.error("❌ Erreur loginStudent:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Profil étudiant connecté
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select("-password");
    if (!student) return res.status(404).json({ message: "Étudiant non trouvé" });
    
    // Calculer la moyenne de l'étudiant
    const notes = await Note.find({ etudiant: req.user._id });
    let moyenne = 0;
    if (notes.length > 0) {
      const totalNotes = notes.reduce((sum, note) => sum + note.note, 0);
      moyenne = Math.round((totalNotes / notes.length) * 10) / 10;
    }
    
    // Calculer le taux de présence
    const absences = await Absence.find({ student: req.user._id });
    const totalSeances = await Seance.countDocuments({ classe: student.classe });
    let tauxPresence = 100;
    if (totalSeances > 0) {
      const tauxAbsence = (absences.length / totalSeances) * 100;
      tauxPresence = Math.round(100 - tauxAbsence);
    }
    
    const profileWithStats = {
      ...student.toObject(),
      moyenne: moyenne,
      tauxPresence: tauxPresence
    };
    
    res.json(profileWithStats);
  } catch (err) {
    console.error("Erreur getStudentProfile:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer les cours de la classe de l'étudiant
const getStudentCourses = async (req, res) => {
  try {
    const classe = req.user.classe;
    if (!classe) return res.status(400).json({ message: "Classe manquante" });
    const courses = await Course.find({ classe })
      .populate("matiere")
      .populate("teacher", "name email");
    res.json(courses);
  } catch (err) {
    console.error("Erreur getStudentCourses:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer tous les rappels de tous les professeurs
const getStudentRappels = async (req, res) => {
  try {
    const rappels = await Rappel.find({ etudiant: req.user._id })
      .populate("professeur", "name email")
      .sort({ date: 1 });
    res.json(rappels);
  } catch (err) {
    console.error("Erreur getStudentRappels:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Marquer un rappel comme fait
const markRappelFait = async (req, res) => {
  try {
    const { rappelId } = req.params;
    const rappel = await Rappel.findById(rappelId);
    
    if (!rappel) {
      return res.status(404).json({ message: "Rappel non trouvé" });
    }
    
    if (rappel.etudiant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }
    
    rappel.fait = true;
    rappel.dateFait = new Date();
    await rappel.save();
    
    res.json({ message: "Rappel marqué comme fait" });
  } catch (err) {
    console.error("Erreur markRappelFait:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer le planning de l'étudiant
const getStudentPlanning = async (req, res) => {
  try {
    const classe = req.user.classe;
    if (!classe) return res.status(400).json({ message: "Classe manquante" });
    
    const seances = await Seance.find({ classe })
      .populate("matiere", "nom")
      .populate("professeur", "name")
      .sort({ date: 1, heureDebut: 1 });
    
    res.json(seances);
  } catch (err) {
    console.error("Erreur getStudentPlanning:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer les chapitres avec les cours
const getChapitresWithCourses = async (req, res) => {
  try {
    const chapitres = await Chapitre.find()
      .populate({
        path: "cours",
        populate: {
          path: "matiere",
          select: "nom"
        }
      });
    res.json(chapitres);
  } catch (err) {
    console.error("Erreur getChapitresWithCourses:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mettre à jour le profil étudiant
const updateStudentProfile = async (req, res) => {
  try {
    const { name, email, classe, tel, adresse } = req.body;
    
    const student = await Student.findById(req.user._id);
    if (!student) return res.status(404).json({ message: "Étudiant non trouvé" });
    
    if (name) student.name = name;
    if (email) student.email = email;
    if (classe) student.classe = classe;
    if (tel) student.tel = tel;
    if (adresse) student.adresse = adresse;
    
    await student.save();
    
    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      classe: student.classe,
      tel: student.tel,
      adresse: student.adresse
    });
  } catch (err) {
    console.error("Erreur updateStudentProfile:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer les notes de l'étudiant
const getStudentNotes = async (req, res) => {
  try {
    const notes = await Note.find({ etudiant: req.user._id })
      .populate('cours', 'nom')
      .populate('enseignant', 'name')
      .sort({ createdAt: -1 });
    
    res.json(notes);
  } catch (err) {
    console.error("Erreur getStudentNotes:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer les absences de l'étudiant
const getStudentAbsences = async (req, res) => {
  try {
    const absences = await Absence.find({ student: req.user._id })
      .populate('course', 'nom')
      .sort({ date: -1 });
    
    res.json(absences);
  } catch (err) {
    console.error("Erreur getStudentAbsences:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer les données du dashboard étudiant
const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { email } = req.query;

    // Récupérer les données de base de l'étudiant
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }

    // Compter les cours
    const totalCours = await Course.countDocuments({ classe: student.classe });
    
    // Compter les autres étudiants dans la même classe
    const totalEtudiants = await Student.countDocuments({ classe: student.classe });
    
    // Calculer la moyenne des notes
    const notes = await Note.find({ etudiant: studentId });
    const avgPerformance = notes.length > 0 
      ? Math.round(notes.reduce((sum, note) => sum + note.note, 0) / notes.length)
      : 75;
    
    // Vérifier s'il y a un cours aujourd'hui
    const today = new Date();
    const prochainCours = await Course.findOne({ 
      classe: student.classe,
      // Ajouter une logique pour vérifier les horaires
    });

    // Statistiques supplémentaires
    const statsSupplementaires = {
      totalDocuments: Math.floor(Math.random() * 30) + 20, // Simulation
      devoirsRendus: Math.floor(Math.random() * 10) + 5,
      seancesAujourdhui: Math.floor(Math.random() * 5) + 1
    };

    // Prochaines sessions (simulation)
    const prochainesSessions = [
      {
        date: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Demain
        heureDebut: "09:00",
        matiere: "Mathématiques",
        salle: "Salle 101",
        groupe: "Groupe A"
      },
      {
        date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // Après-demain
        heureDebut: "14:00",
        matiere: "Français",
        salle: "Salle 102",
        groupe: "Groupe A"
      }
    ];

    const dashboardData = {
      totalCours,
      totalEtudiants,
      objectifsAtteints: avgPerformance,
      prochainCours: !!prochainCours,
      avgPerformance,
      statsSupplementaires,
      prochainesSessions
    };

    res.json(dashboardData);
  } catch (err) {
    console.error("Erreur getStudentDashboard:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer les formations de l'étudiant
const getStudentFormations = async (req, res) => {
  try {
    const studentId = req.user._id;
    
    // Récupérer les formations achetées par les parents pour cet étudiant
    const FormationAchat = require('../models/FormationAchat');
    const achats = await FormationAchat.find({
      enfants: studentId,
      statut: 'paye'
    }).populate('formation');

    const formations = [];
    
    for (const achat of achats) {
      let formationData;
      
      if (achat.formation) {
        // Formation réelle de la base de données
        formationData = achat.formation.toObject();
      } else if (achat.formationTest) {
        // Formation de test
        const formationsTest = [
          {
            _id: "1",
            titre: "🔢 Mathématiques Ludiques CP-CE1",
            description: "Apprends à compter, additionner et soustraire en t'amusant ! Des jeux et des exercices adaptés aux 6-7 ans.",
            prix: 25,
            duree: "3 heures",
            niveau: "CP-CE1",
            matiere: "Mathématiques",
            categorie: "Mathématiques",
            icon: "Calculator",
            couleur: "from-blue-500 to-cyan-600",
            bgCouleur: "bg-gradient-to-br from-blue-50 to-cyan-50",
            borderCouleur: "border-blue-200"
          },
          {
            _id: "2",
            titre: "📚 Lecture et Écriture CP-CE1",
            description: "Découvre les lettres, les sons et apprends à lire tes premiers mots ! Méthode progressive et amusante.",
            prix: 28,
            duree: "4 heures",
            niveau: "CP-CE1",
            matiere: "Français",
            categorie: "Français",
            icon: "BookOpen",
            couleur: "from-green-500 to-emerald-600",
            bgCouleur: "bg-gradient-to-br from-green-50 to-emerald-50",
            borderCouleur: "border-green-200"
          },
          {
            _id: "3",
            titre: "🌍 Découverte du Monde CE1-CE2",
            description: "Explore la nature, les animaux et le monde qui t'entoure ! Des vidéos et des activités interactives.",
            prix: 22,
            duree: "2 heures",
            niveau: "CE1-CE2",
            matiere: "Sciences",
            categorie: "Sciences",
            icon: "Globe",
            couleur: "from-purple-500 to-pink-600",
            bgCouleur: "bg-gradient-to-br from-purple-50 to-pink-50",
            borderCouleur: "border-purple-200"
          },
          {
            _id: "4",
            titre: "🎨 Créativité et Arts CP-CE2",
            description: "Dessine, peins et crée ! Développe ton imagination avec des activités artistiques amusantes.",
            prix: 20,
            duree: "2 heures",
            niveau: "CP-CE2",
            matiere: "Arts",
            categorie: "Arts",
            icon: "Palette",
            couleur: "from-orange-500 to-red-600",
            bgCouleur: "bg-gradient-to-br from-orange-50 to-red-50",
            borderCouleur: "border-orange-200"
          },
          {
            _id: "5",
            titre: "🔤 Anglais Débutant CP-CE1",
            description: "Apprends tes premiers mots en anglais ! Chansons, jeux et activités pour débuter en douceur.",
            prix: 24,
            duree: "3 heures",
            niveau: "CP-CE1",
            matiere: "Anglais",
            categorie: "Langues",
            icon: "Globe",
            couleur: "from-indigo-500 to-blue-600",
            bgCouleur: "bg-gradient-to-br from-indigo-50 to-blue-50",
            borderCouleur: "border-indigo-200"
          },
          {
            _id: "6",
            titre: "🧩 Logique et Réflexion CE1-CE2",
            description: "Résous des énigmes, des puzzles et développe ton esprit logique ! Des défis adaptés à ton âge.",
            prix: 26,
            duree: "3 heures",
            niveau: "CE1-CE2",
            matiere: "Logique",
            categorie: "Logique",
            icon: "Brain",
            couleur: "from-teal-500 to-green-600",
            bgCouleur: "bg-gradient-to-br from-teal-50 to-green-50",
            borderCouleur: "border-teal-200"
          },
          {
            _id: "7",
            titre: "🎵 Musique et Rythme CP-CE2",
            description: "Découvre la musique ! Chante, danse et apprends à reconnaître les sons et les rythmes.",
            prix: 23,
            duree: "2 heures",
            niveau: "CP-CE2",
            matiere: "Musique",
            categorie: "Musique",
            icon: "Music",
            couleur: "from-pink-500 to-purple-600",
            bgCouleur: "bg-gradient-to-br from-pink-50 to-purple-50",
            borderCouleur: "border-pink-200"
          },
          {
            _id: "8",
            titre: "💻 Premiers Pas Informatique CE1-CE2",
            description: "Découvre l'ordinateur en toute sécurité ! Apprends à utiliser la souris et le clavier en t'amusant.",
            prix: 30,
            duree: "4 heures",
            niveau: "CE1-CE2",
            matiere: "Informatique",
            categorie: "Informatique",
            icon: "Code",
            couleur: "from-gray-500 to-blue-600",
            bgCouleur: "bg-gradient-to-br from-gray-50 to-blue-50",
            borderCouleur: "border-gray-200"
          }
        ];
        
        formationData = formationsTest.find(f => f._id === achat.formationTest);
      }
      
      if (formationData) {
        formations.push({
          ...formationData,
          dateAchat: achat.dateAchat,
          dateExpiration: achat.dateExpiration,
          codeConfirmation: achat.codeConfirmation,
          statut: 'achete'
        });
      }
    }
    
    res.json(formations);
    
  } catch (err) {
    console.error("Erreur getStudentFormations:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  getStudentProfile,
  getStudentCourses,
  getStudentNotes,
  getStudentAbsences,
  getStudentRappels,
  markRappelFait,
  getStudentPlanning,
  getChapitresWithCourses,
  updateStudentProfile,
  getStudentDashboard,
  getStudentFormations
};
