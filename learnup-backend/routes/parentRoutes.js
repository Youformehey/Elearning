// routes/parentRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const Parent = require('../models/Parent');
const Student = require('../models/Student');
const Note = require('../models/Note');
const Absence = require('../models/Absence');
const Formation = require('../models/Formation');
const FormationAchat = require('../models/FormationAchat');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Route de login pour les parents
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔐 Tentative de login parent :", email);

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const parent = await Parent.findOne({ email });
    if (!parent) {
      console.warn("❌ Aucune correspondance pour cet email :", email);
      return res.status(401).json({ message: "Email incorrect" });
    }

    const isMatch = await parent.matchPassword(password);
    if (!isMatch) {
      console.warn("❌ Mot de passe incorrect pour :", email);
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { _id: parent._id, email: parent.email, role: "parent" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Connexion réussie pour :", email);

    res.json({
      _id: parent._id,
      name: parent.name,
      email: parent.email,
      tel: parent.tel,
      role: "parent",
      token,
    });
  } catch (err) {
    console.error("❌ Erreur loginParent:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// Récupérer le profil du parent avec ses enfants
router.get('/me', protect, authorizeRoles('parent'), async (req, res) => {
  try {
    const parent = await Parent.findById(req.user._id)
      .populate('children', 'name email classe');
    
    if (!parent) {
      return res.status(404).json({ message: 'Parent non trouvé' });
    }

    res.json(parent);
  } catch (err) {
    console.error('Erreur getParentProfile:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer les notes des enfants
router.get('/children/notes', protect, authorizeRoles('parent'), async (req, res) => {
  try {
    const parent = await Parent.findById(req.user._id).populate('children');
    if (!parent) {
      return res.status(404).json({ message: 'Parent non trouvé' });
    }

    const childrenNotes = {};
    
    for (const child of parent.children) {
      const notes = await Note.find({ student: child._id })
        .populate('course', 'titre matiere')
        .sort({ createdAt: -1 });

      childrenNotes[child._id] = {
        enfant: {
          _id: child._id,
          name: child.name,
          email: child.email,
          classe: child.classe
        },
        notes
      };
    }

    res.json(childrenNotes);
  } catch (err) {
    console.error('Erreur getChildrenNotes:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer les absences des enfants
router.get('/children/absences', protect, authorizeRoles('parent'), async (req, res) => {
  try {
    const parent = await Parent.findById(req.user._id).populate('children');
    if (!parent) {
      return res.status(404).json({ message: 'Parent non trouvé' });
    }

    const childrenAbsences = {};
    
    for (const child of parent.children) {
      const absences = await Absence.find({ student: child._id })
        .populate({
          path: 'seance',
          populate: [
            { path: 'matiere', select: 'nom description' },
            { path: 'professeur', select: 'name email' }
          ]
        })
        .populate('justification')
        .sort({ date: -1 });

      // Grouper les absences par matière
      const grouped = {};
      let totalAbsences = 0;
      let totalHeures = 0;
      let totalJustified = 0;
      let totalUnjustified = 0;

      absences.forEach(absence => {
        const matiere = absence.seance?.matiere?.nom || 'Non spécifiée';
        
        if (!grouped[matiere]) {
          grouped[matiere] = {
            matiere,
            absences: [],
            totalAbsences: 0,
            totalHeures: 0,
            justified: 0,
            unjustified: 0,
            dates: [],
            limiteDepassee: false
          };
        }

        grouped[matiere].absences.push({
          _id: absence._id,
          date: absence.date,
          justified: !!absence.justification,
          justification: absence.justification?.raison,
          seance: {
            horaire: absence.seance?.horaire || '2h',
            salle: absence.seance?.salle,
            professeur: absence.seance?.professeur
          }
        });

        grouped[matiere].totalAbsences++;
        grouped[matiere].totalHeures += 2;
        
        if (absence.justification) {
          grouped[matiere].justified++;
          totalJustified++;
        } else {
          grouped[matiere].unjustified++;
          totalUnjustified++;
        }
        
        grouped[matiere].dates.push(absence.date);
        grouped[matiere].limiteDepassee = grouped[matiere].totalHeures > 12;

        totalAbsences++;
        totalHeures += 2;
      });

      childrenAbsences[child._id] = {
        enfant: {
          _id: child._id,
          name: child.name,
          email: child.email,
          classe: child.classe
        },
        matieres: Object.values(grouped),
        stats: {
          totalAbsences,
          totalHeures,
          totalJustified,
          totalUnjustified,
          matieresEnDanger: Object.values(grouped).filter(m => m.limiteDepassee).length
        }
      };
    }

    res.json(childrenAbsences);
  } catch (err) {
    console.error('Erreur getChildrenAbsences:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer les formations des enfants
router.get('/children/formations', protect, authorizeRoles('parent'), async (req, res) => {
  try {
    const parent = await Parent.findById(req.user._id).populate('children');
    if (!parent) {
      return res.status(404).json({ message: 'Parent non trouvé' });
    }

    const childrenFormations = {};
    
    for (const child of parent.children) {
      const formations = await Formation.find({ students: child._id })
        .populate('teacher', 'name email')
        .sort({ startDate: -1 });

      childrenFormations[child._id] = {
        enfant: {
          _id: child._id,
          name: child.name,
          email: child.email,
          classe: child.classe
        },
        formations
      };
    }

    res.json(childrenFormations);
  } catch (err) {
    console.error('Erreur getChildrenFormations:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer les demandes des enfants
router.get('/children/demandes', protect, authorizeRoles('parent'), async (req, res) => {
  try {
    const parent = await Parent.findById(req.user._id).populate('children');
    if (!parent) {
      return res.status(404).json({ message: 'Parent non trouvé' });
    }

    const Demande = require('../models/Demande');
    const childrenDemandes = {};
    
    for (const child of parent.children) {
      const demandes = await Demande.find({ etudiant: child._id })
        .populate('professeur', 'name email')
        .sort({ createdAt: -1 });

      childrenDemandes[child._id] = {
        enfant: {
          _id: child._id,
          name: child.name,
          email: child.email,
          classe: child.classe
        },
        demandes
      };
    }

    res.json(childrenDemandes);
  } catch (err) {
    console.error('Erreur getChildrenDemandes:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 👨‍👩‍👧‍👦 Récupérer les formations disponibles
router.get('/formations', protect, authorizeRoles('parent'), async (req, res) => {
  try {
    const parentId = req.user.id;
    
    // Récupérer les achats existants du parent
    const achatsExistants = await FormationAchat.find({
      parent: parentId,
      statut: 'paye'
    });
    
    // Créer un set des formations déjà achetées
    const formationsAchetees = new Set();
    achatsExistants.forEach(achat => {
      if (achat.formation) {
        formationsAchetees.add(achat.formation.toString());
      } else if (achat.formationTest) {
        formationsAchetees.add(achat.formationTest);
      }
    });

    const formations = await Formation.find({ active: true }).sort({ createdAt: -1 });
    if (formations.length === 0) {
      // Formations de test adaptées au primaire
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
          borderCouleur: "border-blue-200",
          active: true
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
          borderCouleur: "border-green-200",
          active: true
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
          borderCouleur: "border-purple-200",
          active: true
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
          borderCouleur: "border-orange-200",
          active: true
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
          borderCouleur: "border-indigo-200",
          active: true
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
          borderCouleur: "border-teal-200",
          active: true
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
          borderCouleur: "border-pink-200",
          active: true
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
          borderCouleur: "border-gray-200",
          active: true
        }
      ];
      
      // Filtrer les formations déjà achetées
      const formationsDisponibles = formationsTest.filter(formation => 
        !formationsAchetees.has(formation._id)
      );
      
      res.json(formationsDisponibles);
    } else {
      // Filtrer les formations réelles déjà achetées
      const formationsDisponibles = formations.filter(formation => 
        !formationsAchetees.has(formation._id.toString())
      );
      res.json(formationsDisponibles);
    }
  } catch (err) {
    console.error('Erreur récupération formations:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des formations' });
  }
});

// 👨‍👩‍👧‍👦 Récupérer les formations achetées par le parent
router.get('/formations/achetees', protect, authorizeRoles('parent'), async (req, res) => {
  try {
    const parentId = req.user.id;
    
    // Récupérer tous les achats du parent
    const achats = await FormationAchat.find({
      parent: parentId,
      statut: 'paye'
    }).populate('formation').populate('enfants', 'name classe');
    
    const formationsAchetees = [];
    
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
        formationsAchetees.push({
          ...formationData,
          dateAchat: achat.dateAchat,
          dateExpiration: achat.dateExpiration,
          codeConfirmation: achat.codeConfirmation,
          enfants: achat.enfants,
          montant: achat.montant,
          statut: 'achete'
        });
      }
    }
    
    res.json(formationsAchetees);
    
  } catch (err) {
    console.error('Erreur récupération formations achetées:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des formations achetées' });
  }
});

// 💳 Créer une session de paiement pour les formations
router.post('/formations/create-payment', protect, authorizeRoles('parent'), async (req, res) => {
  try {
    const { formationId, childrenIds, amount, cardDetails } = req.body;
    const parentId = req.user.id;

    // Validation des données
    if (!formationId || !childrenIds || !amount || !cardDetails) {
      return res.status(400).json({ 
        success: false, 
        message: 'Données manquantes pour le paiement' 
      });
    }

    // Vérifier que la formation existe (pour les formations de test, on accepte les IDs string)
    let formation;
    if (formationId.length === 24) {
      // ID MongoDB valide
      formation = await Formation.findById(formationId);
    } else {
      // Formation de test - créer un objet formation temporaire
      const formationsTest = [
        {
          _id: "1",
          titre: "🔢 Mathématiques Ludiques CP-CE1",
          description: "Apprends à compter, additionner et soustraire en t'amusant ! Des jeux et des exercices adaptés aux 6-7 ans.",
          prix: 25,
          duree: "3 heures",
          niveau: "CP-CE1",
          matiere: "Mathématiques"
        },
        {
          _id: "2",
          titre: "📚 Lecture et Écriture CP-CE1",
          description: "Découvre les lettres, les sons et apprends à lire tes premiers mots ! Méthode progressive et amusante.",
          prix: 28,
          duree: "4 heures",
          niveau: "CP-CE1",
          matiere: "Français"
        },
        {
          _id: "3",
          titre: "🌍 Découverte du Monde CE1-CE2",
          description: "Explore la nature, les animaux et le monde qui t'entoure ! Des vidéos et des activités interactives.",
          prix: 22,
          duree: "2 heures",
          niveau: "CE1-CE2",
          matiere: "Sciences"
        },
        {
          _id: "4",
          titre: "🎨 Créativité et Arts CP-CE2",
          description: "Dessine, peins et crée ! Développe ton imagination avec des activités artistiques amusantes.",
          prix: 20,
          duree: "2 heures",
          niveau: "CP-CE2",
          matiere: "Arts"
        },
        {
          _id: "5",
          titre: "🔤 Anglais Débutant CP-CE1",
          description: "Apprends tes premiers mots en anglais ! Chansons, jeux et activités pour débuter en douceur.",
          prix: 24,
          duree: "3 heures",
          niveau: "CP-CE1",
          matiere: "Anglais"
        },
        {
          _id: "6",
          titre: "🧩 Logique et Réflexion CE1-CE2",
          description: "Résous des énigmes, des puzzles et développe ton esprit logique ! Des défis adaptés à ton âge.",
          prix: 26,
          duree: "3 heures",
          niveau: "CE1-CE2",
          matiere: "Logique"
        },
        {
          _id: "7",
          titre: "🎵 Musique et Rythme CP-CE2",
          description: "Découvre la musique ! Chante, danse et apprends à reconnaître les sons et les rythmes.",
          prix: 23,
          duree: "2 heures",
          niveau: "CP-CE2",
          matiere: "Musique"
        },
        {
          _id: "8",
          titre: "💻 Premiers Pas Informatique CE1-CE2",
          description: "Découvre l'ordinateur en toute sécurité ! Apprends à utiliser la souris et le clavier en t'amusant.",
          prix: 30,
          duree: "4 heures",
          niveau: "CE1-CE2",
          matiere: "Informatique"
        }
      ];
      
      formation = formationsTest.find(f => f._id === formationId);
    }

    if (!formation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Formation non trouvée' 
      });
    }

    // Vérifier que les enfants appartiennent au parent
    const parent = await Parent.findById(parentId).populate('children');
    const parentChildrenIds = parent.children.map(child => child._id.toString());
    
    const validChildren = childrenIds.filter(childId => 
      parentChildrenIds.includes(childId.toString())
    );

    if (validChildren.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucun enfant valide sélectionné' 
      });
    }

    // Simulation de validation de carte Stripe
    const { cardNumber, expiryMonth, expiryYear, cvc, cardholderName } = cardDetails;

    // Validation basique des données de carte
    if (!cardNumber || !expiryMonth || !expiryYear || !cvc || !cardholderName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Informations de carte incomplètes' 
      });
    }

    // Simulation de validation Stripe (accepte n'importe quelle carte de test)
    const isValidCard = cardNumber.length >= 13 && cardNumber.length <= 19;
    const isValidCVC = cvc.length >= 3 && cvc.length <= 4;
    const isValidExpiry = parseInt(expiryMonth) >= 1 && parseInt(expiryMonth) <= 12 && 
                         parseInt(expiryYear) >= new Date().getFullYear();

    if (!isValidCard || !isValidCVC || !isValidExpiry) {
      return res.status(400).json({ 
        success: false, 
        message: 'Informations de carte invalides' 
      });
    }

    // Simulation de traitement Stripe (délai de 2 secondes)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Générer un code de confirmation
    const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Créer l'achat en base
    const achat = new FormationAchat({
      parent: parentId,
      formation: formationId.length === 24 ? formationId : null, // null pour les formations de test
      formationTest: formationId.length !== 24 ? formationId : null, // ID de test
      enfants: validChildren,
      montant: amount,
      statut: 'paye',
      codeConfirmation: confirmationCode,
      detailsPaiement: {
        cardLast4: cardNumber.slice(-4),
        cardBrand: 'visa', // Simulation
        paymentMethod: 'card'
      }
    });
    await achat.save();

    res.json({ 
      success: true, 
      message: 'Paiement traité avec succès !', 
      achatId: achat._id, 
      confirmationCode: confirmationCode,
      formation: formation.titre,
      enfants: validChildren.length,
      montant: amount
    });

  } catch (err) {
    console.error('Erreur paiement formation:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors du traitement du paiement' 
    });
  }
});

module.exports = router;
