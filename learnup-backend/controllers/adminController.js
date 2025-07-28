const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Parent = require("../models/Parent");
const Admin = require("../models/Admin");
const Course = require("../models/Course");
const Note = require("../models/Note");
const Absence = require("../models/Absence");
const Rappel = require("../models/Rappel");
const Demande = require("../models/Demande");
const Formation = require("../models/Formation");
const Seance = require("../models/Seance");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===== AUTHENTIFICATION ADMIN =====

// Register Admin (sans authentification pour le premier admin)
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role = "admin" } = req.body;
    
    // Vérifier si l'email existe déjà
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Un administrateur avec cet email existe déjà" });
    }

    const admin = new Admin({
      name,
      email,
      password,
      role
    });

    await admin.save();
    
    // Créer le token JWT
    const token = jwt.sign(
      { userId: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({ 
      success: true,
      message: "Administrateur créé avec succès", 
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'administrateur", error: error.message });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'admin existe
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérifier le mot de passe
    const isValidPassword = await admin.matchPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { userId: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Connexion réussie",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
  }
};

// Get Admin Profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.userId).select('-password');
    if (!admin) {
      return res.status(404).json({ message: "Administrateur non trouvé" });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du profil", error: error.message });
  }
};

// Update Admin Profile
const updateAdminProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const admin = await Admin.findById(req.user.userId);
    if (!admin) {
      return res.status(404).json({ message: "Administrateur non trouvé" });
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;

    await admin.save();
    res.json({ message: "Profil mis à jour avec succès", admin });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du profil", error: error.message });
  }
};

// ===== GESTION DES UTILISATEURS =====

// === Étudiants ===
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('classe');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des étudiants", error: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('classe');
    if (!student) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'étudiant", error: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const { name, email, password, classe, tel, adresse } = req.body;
    
    // Vérifier si l'email existe déjà
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Un étudiant avec cet email existe déjà" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    const student = new Student({
      name,
      email,
      password: hashedPassword,
      classe,
      tel,
      adresse,
      role: 'student'
    });

    await student.save();
    res.status(201).json({ message: "Étudiant créé avec succès", student });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'étudiant", error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { nom, prenom, email, classe, telephone, adresse, status } = req.body;
    
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }

    student.nom = nom || student.nom;
    student.prenom = prenom || student.prenom;
    student.email = email || student.email;
    student.classe = classe || student.classe;
    student.telephone = telephone || student.telephone;
    student.adresse = adresse || student.adresse;
    student.status = status || student.status;

    await student.save();
    res.json({ message: "Étudiant mis à jour avec succès", student });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'étudiant", error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }
    res.json({ message: "Étudiant supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'étudiant", error: error.message });
  }
};

const bulkActionStudents = async (req, res) => {
  try {
    const { action, studentIds } = req.body;
    
    switch (action) {
      case 'activate':
        await Student.updateMany({ _id: { $in: studentIds } }, { status: 'active' });
        break;
      case 'deactivate':
        await Student.updateMany({ _id: { $in: studentIds } }, { status: 'inactive' });
        break;
      case 'delete':
        await Student.deleteMany({ _id: { $in: studentIds } });
        break;
      default:
        return res.status(400).json({ message: "Action non valide" });
    }
    
    res.json({ message: `Action ${action} effectuée avec succès` });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'action en masse", error: error.message });
  }
};

// === Professeurs ===
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des professeurs", error: error.message });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Professeur non trouvé" });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du professeur", error: error.message });
  }
};

const createTeacher = async (req, res) => {
  try {
    const { name, email, password, matiere, tel, adresse } = req.body;
    
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Un professeur avec cet email existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const teacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      matiere,
      tel,
      adresse,
      role: 'teacher'
    });

    await teacher.save();
    res.status(201).json({ message: "Professeur créé avec succès", teacher });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du professeur", error: error.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { name, email, matiere, tel, adresse, status } = req.body;
    
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Professeur non trouvé" });
    }

    teacher.name = name || teacher.name;
    teacher.email = email || teacher.email;
    teacher.matiere = matiere || teacher.matiere;
    teacher.tel = tel || teacher.tel;
    teacher.adresse = adresse || teacher.adresse;
    teacher.status = status || teacher.status;

    await teacher.save();
    res.json({ message: "Professeur mis à jour avec succès", teacher });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du professeur", error: error.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Professeur non trouvé" });
    }
    res.json({ message: "Professeur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du professeur", error: error.message });
  }
};

const bulkActionTeachers = async (req, res) => {
  try {
    const { action, teacherIds } = req.body;
    
    switch (action) {
      case 'activate':
        await Teacher.updateMany({ _id: { $in: teacherIds } }, { status: 'active' });
        break;
      case 'deactivate':
        await Teacher.updateMany({ _id: { $in: teacherIds } }, { status: 'inactive' });
        break;
      case 'delete':
        await Teacher.deleteMany({ _id: { $in: teacherIds } });
        break;
      default:
        return res.status(400).json({ message: "Action non valide" });
    }
    
    res.json({ message: `Action ${action} effectuée avec succès` });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'action en masse", error: error.message });
  }
};

// === Parents ===
const getAllParents = async (req, res) => {
  try {
    const parents = await Parent.find().populate('enfants');
    res.json(parents);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des parents", error: error.message });
  }
};

const getParentById = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id).populate('enfants');
    if (!parent) {
      return res.status(404).json({ message: "Parent non trouvé" });
    }
    res.json(parent);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du parent", error: error.message });
  }
};

const createParent = async (req, res) => {
  try {
    const { nom, prenom, email, password, telephone, adresse, enfants } = req.body;
    
    const existingParent = await Parent.findOne({ email });
    if (existingParent) {
      return res.status(400).json({ message: "Un parent avec cet email existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const parent = new Parent({
      nom,
      prenom,
      email,
      password: hashedPassword,
      telephone,
      adresse,
      enfants,
      role: 'parent'
    });

    await parent.save();
    res.status(201).json({ message: "Parent créé avec succès", parent });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du parent", error: error.message });
  }
};

const updateParent = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, adresse, enfants, status } = req.body;
    
    const parent = await Parent.findById(req.params.id);
    if (!parent) {
      return res.status(404).json({ message: "Parent non trouvé" });
    }

    parent.nom = nom || parent.nom;
    parent.prenom = prenom || parent.prenom;
    parent.email = email || parent.email;
    parent.telephone = telephone || parent.telephone;
    parent.adresse = adresse || parent.adresse;
    parent.enfants = enfants || parent.enfants;
    parent.status = status || parent.status;

    await parent.save();
    res.json({ message: "Parent mis à jour avec succès", parent });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du parent", error: error.message });
  }
};

const deleteParent = async (req, res) => {
  try {
    const parent = await Parent.findByIdAndDelete(req.params.id);
    if (!parent) {
      return res.status(404).json({ message: "Parent non trouvé" });
    }
    res.json({ message: "Parent supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du parent", error: error.message });
  }
};

// === Administrateurs ===
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des administrateurs", error: error.message });
  }
};

const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Administrateur non trouvé" });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'administrateur", error: error.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { nom, prenom, email, password, telephone } = req.body;
    
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Un administrateur avec cet email existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = new Admin({
      nom,
      prenom,
      email,
      password: hashedPassword,
      telephone,
      role: 'admin'
    });

    await admin.save();
    res.status(201).json({ message: "Administrateur créé avec succès", admin });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'administrateur", error: error.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, status } = req.body;
    
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Administrateur non trouvé" });
    }

    admin.nom = nom || admin.nom;
    admin.prenom = prenom || admin.prenom;
    admin.email = email || admin.email;
    admin.telephone = telephone || admin.telephone;
    admin.status = status || admin.status;

    await admin.save();
    res.json({ message: "Administrateur mis à jour avec succès", admin });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'administrateur", error: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Administrateur non trouvé" });
    }
    res.json({ message: "Administrateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'administrateur", error: error.message });
  }
};

// ===== GESTION ACADÉMIQUE =====

// === Classes ===
const getAllClasses = async (req, res) => {
  try {
    const classes = await Course.distinct('classe');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des classes", error: error.message });
  }
};

const getClassById = async (req, res) => {
  try {
    const classe = req.params.id;
    const students = await Student.find({ classe });
    const courses = await Course.find({ classe });
    res.json({ classe, students, courses });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la classe", error: error.message });
  }
};

const createClass = async (req, res) => {
  try {
    const { nom, niveau, capacite, professeurPrincipal } = req.body;
    // Logique de création de classe
    res.status(201).json({ message: "Classe créée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la classe", error: error.message });
  }
};

const updateClass = async (req, res) => {
  try {
    const { nom, niveau, capacite, professeurPrincipal } = req.body;
    // Logique de mise à jour de classe
    res.json({ message: "Classe mise à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la classe", error: error.message });
  }
};

const deleteClass = async (req, res) => {
  try {
    // Logique de suppression de classe
    res.json({ message: "Classe supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la classe", error: error.message });
  }
};

// ===== GESTION DES DONNÉES =====

// === Notes ===
const getAllGrades = async (req, res) => {
  try {
    const grades = await Note.find().populate('etudiant').populate('cours');
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des notes", error: error.message });
  }
};

const getStudentGrades = async (req, res) => {
  try {
    const grades = await Note.find({ etudiant: req.params.studentId }).populate('cours');
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des notes", error: error.message });
  }
};

const getCourseGrades = async (req, res) => {
  try {
    const grades = await Note.find({ cours: req.params.courseId }).populate('etudiant');
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des notes", error: error.message });
  }
};

const createGrade = async (req, res) => {
  try {
    const { etudiant, cours, note, type, commentaire } = req.body;
    const grade = new Note({ etudiant, cours, note, type, commentaire });
    await grade.save();
    res.status(201).json({ message: "Note créée avec succès", grade });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la note", error: error.message });
  }
};

const updateGrade = async (req, res) => {
  try {
    const { note, type, commentaire } = req.body;
    const grade = await Note.findByIdAndUpdate(req.params.id, { note, type, commentaire }, { new: true });
    res.json({ message: "Note mise à jour avec succès", grade });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la note", error: error.message });
  }
};

const deleteGrade = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la note", error: error.message });
  }
};

const bulkUpdateGrades = async (req, res) => {
  try {
    const { grades } = req.body;
    for (const grade of grades) {
      await Note.findByIdAndUpdate(grade.id, { note: grade.note });
    }
    res.json({ message: "Notes mises à jour en masse avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour en masse", error: error.message });
  }
};

// === Absences ===
const getAllAbsences = async (req, res) => {
  try {
    const absences = await Absence.find().populate('etudiant').populate('cours');
    res.json(absences);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des absences", error: error.message });
  }
};

const getStudentAbsences = async (req, res) => {
  try {
    const absences = await Absence.find({ etudiant: req.params.studentId }).populate('cours');
    res.json(absences);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des absences", error: error.message });
  }
};

const getCourseAbsences = async (req, res) => {
  try {
    const absences = await Absence.find({ cours: req.params.courseId }).populate('etudiant');
    res.json(absences);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des absences", error: error.message });
  }
};

const createAbsence = async (req, res) => {
  try {
    const { etudiant, cours, date, motif, justifiee } = req.body;
    const absence = new Absence({ etudiant, cours, date, motif, justifiee });
    await absence.save();
    res.status(201).json({ message: "Absence créée avec succès", absence });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'absence", error: error.message });
  }
};

const updateAbsence = async (req, res) => {
  try {
    const { motif, justifiee } = req.body;
    const absence = await Absence.findByIdAndUpdate(req.params.id, { motif, justifiee }, { new: true });
    res.json({ message: "Absence mise à jour avec succès", absence });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'absence", error: error.message });
  }
};

const deleteAbsence = async (req, res) => {
  try {
    await Absence.findByIdAndDelete(req.params.id);
    res.json({ message: "Absence supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'absence", error: error.message });
  }
};

// ===== SYSTÈME =====

// === Configuration ===
const getSettings = async (req, res) => {
  try {
    // Récupérer les paramètres système depuis la base de données ou un fichier de config
    const settings = {
      schoolName: "LearnUp",
      maintenanceMode: false,
      emailNotifications: true,
      smsNotifications: false,
      backupFrequency: "daily",
      logLevel: "info"
    };
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des paramètres", error: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const settings = req.body;
    // Sauvegarder les paramètres
    res.json({ message: "Paramètres mis à jour avec succès", settings });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour des paramètres", error: error.message });
  }
};

// === Dashboard ===
const getDashboardStats = async (req, res) => {
  try {
    // Compter les utilisateurs par type
    const studentsCount = await Student.countDocuments();
    const teachersCount = await Teacher.countDocuments();
    const parentsCount = await Parent.countDocuments();
    const adminsCount = await Admin.countDocuments();
    
    // Compter les autres entités
    const coursesCount = await Course.countDocuments();
    const notesCount = await Note.countDocuments();
    const absencesCount = await Absence.countDocuments();
    const rappelsCount = await Rappel.countDocuments();
    const demandesCount = await Demande.countDocuments();
    const formationsCount = await Formation.countDocuments();
    
    const stats = {
      totalUsers: studentsCount + teachersCount + parentsCount + adminsCount,
      students: studentsCount,
      teachers: teachersCount,
      parents: parentsCount,
      admins: adminsCount,
      classes: 0, // À implémenter quand vous aurez un modèle Classe
      subjects: 0, // À implémenter quand vous aurez un modèle Matiere
      courses: coursesCount,
      notes: notesCount,
      absences: absencesCount,
      rappels: rappelsCount,
      demandes: demandesCount,
      formations: formationsCount,
      activeUsers: studentsCount + teachersCount + parentsCount + adminsCount
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques", error: error.message });
  }
};

const getRecentActivities = async (req, res) => {
  try {
    // Récupérer les activités récentes depuis la base de données
    const recentStudents = await Student.find().sort({ createdAt: -1 }).limit(3);
    const recentTeachers = await Teacher.find().sort({ createdAt: -1 }).limit(3);
    const recentCourses = await Course.find().sort({ createdAt: -1 }).limit(3);
    const recentNotes = await Note.find().sort({ createdAt: -1 }).limit(3);
    
    const activities = [];
    
    // Ajouter les nouveaux étudiants
    recentStudents.forEach(student => {
      activities.push({
        id: student._id,
        type: 'student',
        action: 'Nouvel étudiant inscrit',
        user: `${student.prenom} ${student.nom}`,
        time: new Date(student.createdAt).toLocaleString('fr-FR'),
        icon: 'FaUserGraduate',
        color: 'text-green-500',
        bgColor: 'bg-green-100'
      });
    });
    
    // Ajouter les nouveaux professeurs
    recentTeachers.forEach(teacher => {
      activities.push({
        id: teacher._id,
        type: 'teacher',
        action: 'Nouveau professeur ajouté',
        user: `${teacher.prenom} ${teacher.nom}`,
        time: new Date(teacher.createdAt).toLocaleString('fr-FR'),
        icon: 'FaChalkboardTeacher',
        color: 'text-blue-500',
        bgColor: 'bg-blue-100'
      });
    });
    
    // Ajouter les nouveaux cours
    recentCourses.forEach(course => {
      activities.push({
        id: course._id,
        type: 'course',
        action: 'Nouveau cours créé',
        user: course.matiere || 'Cours',
        time: new Date(course.createdAt).toLocaleString('fr-FR'),
        icon: 'FaBook',
        color: 'text-purple-500',
        bgColor: 'bg-purple-100'
      });
    });
    
    // Ajouter les nouvelles notes
    recentNotes.forEach(note => {
      activities.push({
        id: note._id,
        type: 'grade',
        action: 'Note ajoutée',
        user: `Note: ${note.note}/20`,
        time: new Date(note.createdAt).toLocaleString('fr-FR'),
        icon: 'FaChartBar',
        color: 'text-orange-500',
        bgColor: 'bg-orange-100'
      });
    });
    
    // Trier par date et prendre les 10 plus récentes
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    res.json(activities.slice(0, 10));
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des activités", error: error.message });
  }
};

const getSystemAlerts = async (req, res) => {
  try {
    const alerts = [
      { type: 'warning', title: 'Maintenance prévue', message: 'Maintenance système prévue ce soir à 23h' },
      { type: 'info', title: 'Nouvelle fonctionnalité', message: 'Module d\'analytics avancé disponible' },
      { type: 'success', title: 'Sauvegarde réussie', message: 'Sauvegarde automatique terminée avec succès' }
    ];
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des alertes", error: error.message });
  }
};

// Fonctions placeholder pour les autres routes
const getAllSubjects = async (req, res) => res.json([]);
const getSubjectById = async (req, res) => res.json({});
const createSubject = async (req, res) => res.json({ message: "Matière créée" });
const updateSubject = async (req, res) => res.json({ message: "Matière mise à jour" });
const deleteSubject = async (req, res) => res.json({ message: "Matière supprimée" });

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('professeur').populate('classe');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des cours", error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('professeur').populate('classe');
    if (!course) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du cours", error: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const { matiere, professeur, classe, description } = req.body;
    
    const course = new Course({
      matiere,
      professeur,
      classe,
      description
    });

    await course.save();
    res.status(201).json({ message: "Cours créé avec succès", course });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du cours", error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { matiere, professeur, classe, description } = req.body;
    
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }

    course.matiere = matiere || course.matiere;
    course.professeur = professeur || course.professeur;
    course.classe = classe || course.classe;
    course.description = description || course.description;

    await course.save();
    res.json({ message: "Cours mis à jour avec succès", course });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du cours", error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }
    res.json({ message: "Cours supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du cours", error: error.message });
  }
};

const getAllHomework = async (req, res) => res.json([]);
const getHomeworkById = async (req, res) => res.json({});
const createHomework = async (req, res) => res.json({ message: "Devoir créé" });
const updateHomework = async (req, res) => res.json({ message: "Devoir mis à jour" });
const deleteHomework = async (req, res) => res.json({ message: "Devoir supprimé" });

const getAllExams = async (req, res) => res.json([]);
const getExamById = async (req, res) => res.json({});
const createExam = async (req, res) => res.json({ message: "Examen créé" });
const updateExam = async (req, res) => res.json({ message: "Examen mis à jour" });
const deleteExam = async (req, res) => res.json({ message: "Examen supprimé" });

const getAllReminders = async (req, res) => {
  try {
    const rappels = await Rappel.find().populate('etudiant').populate('professeur');
    res.json(rappels);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des rappels", error: error.message });
  }
};

const getReminderById = async (req, res) => {
  try {
    const rappel = await Rappel.findById(req.params.id).populate('etudiant').populate('professeur');
    if (!rappel) {
      return res.status(404).json({ message: "Rappel non trouvé" });
    }
    res.json(rappel);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du rappel", error: error.message });
  }
};

const createReminder = async (req, res) => {
  try {
    const { titre, description, date, etudiant, professeur, type } = req.body;
    
    const rappel = new Rappel({
      titre,
      description,
      date,
      etudiant,
      professeur,
      type
    });

    await rappel.save();
    res.status(201).json({ message: "Rappel créé avec succès", rappel });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du rappel", error: error.message });
  }
};

const updateReminder = async (req, res) => {
  try {
    const { titre, description, date, etudiant, professeur, type } = req.body;
    
    const rappel = await Rappel.findById(req.params.id);
    if (!rappel) {
      return res.status(404).json({ message: "Rappel non trouvé" });
    }

    rappel.titre = titre || rappel.titre;
    rappel.description = description || rappel.description;
    rappel.date = date || rappel.date;
    rappel.etudiant = etudiant || rappel.etudiant;
    rappel.professeur = professeur || rappel.professeur;
    rappel.type = type || rappel.type;

    await rappel.save();
    res.json({ message: "Rappel mis à jour avec succès", rappel });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du rappel", error: error.message });
  }
};

const deleteReminder = async (req, res) => {
  try {
    const rappel = await Rappel.findByIdAndDelete(req.params.id);
    if (!rappel) {
      return res.status(404).json({ message: "Rappel non trouvé" });
    }
    res.json({ message: "Rappel supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du rappel", error: error.message });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const demandes = await Demande.find().populate('etudiant').populate('professeur');
    res.json(demandes);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des demandes", error: error.message });
  }
};

const getRequestById = async (req, res) => {
  try {
    const demande = await Demande.findById(req.params.id).populate('etudiant').populate('professeur');
    if (!demande) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }
    res.json(demande);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la demande", error: error.message });
  }
};

const updateRequest = async (req, res) => {
  try {
    const { statut, reponse } = req.body;
    
    const demande = await Demande.findById(req.params.id);
    if (!demande) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    demande.statut = statut || demande.statut;
    demande.reponse = reponse || demande.reponse;

    await demande.save();
    res.json({ message: "Demande mise à jour avec succès", demande });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la demande", error: error.message });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const demande = await Demande.findByIdAndDelete(req.params.id);
    if (!demande) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }
    res.json({ message: "Demande supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la demande", error: error.message });
  }
};

const getAllTrainings = async (req, res) => {
  try {
    const formations = await Formation.find();
    res.json(formations);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des formations", error: error.message });
  }
};

const getTrainingById = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }
    res.json(formation);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la formation", error: error.message });
  }
};

const createTraining = async (req, res) => {
  try {
    const { titre, description, prix, duree, niveau } = req.body;
    
    const formation = new Formation({
      titre,
      description,
      prix,
      duree,
      niveau
    });

    await formation.save();
    res.status(201).json({ message: "Formation créée avec succès", formation });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la formation", error: error.message });
  }
};

const updateTraining = async (req, res) => {
  try {
    const { titre, description, prix, duree, niveau } = req.body;
    
    const formation = await Formation.findById(req.params.id);
    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }

    formation.titre = titre || formation.titre;
    formation.description = description || formation.description;
    formation.prix = prix || formation.prix;
    formation.duree = duree || formation.duree;
    formation.niveau = niveau || formation.niveau;

    await formation.save();
    res.json({ message: "Formation mise à jour avec succès", formation });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la formation", error: error.message });
  }
};

const deleteTraining = async (req, res) => {
  try {
    const formation = await Formation.findByIdAndDelete(req.params.id);
    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }
    res.json({ message: "Formation supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la formation", error: error.message });
  }
};

// Fonctions système
const createBackup = async (req, res) => res.json({ message: "Sauvegarde créée" });
const restoreBackup = async (req, res) => res.json({ message: "Sauvegarde restaurée" });
const getLogs = async (req, res) => res.json([]);
const getErrorLogs = async (req, res) => res.json([]);
const getAccessLogs = async (req, res) => res.json([]);
const clearLogs = async (req, res) => res.json({ message: "Logs supprimés" });
const getSecurityStatus = async (req, res) => res.json({ status: "Secure" });
const securityScan = async (req, res) => res.json({ message: "Scan terminé" });
const getSecurityUsers = async (req, res) => res.json([]);
const blockUser = async (req, res) => res.json({ message: "Utilisateur bloqué" });
const unblockUser = async (req, res) => res.json({ message: "Utilisateur débloqué" });
const enableMaintenance = async (req, res) => res.json({ message: "Mode maintenance activé" });
const disableMaintenance = async (req, res) => res.json({ message: "Mode maintenance désactivé" });
const getMaintenanceStatus = async (req, res) => res.json({ maintenance: false });

// Fonctions analytics
const getAnalyticsOverview = async (req, res) => res.json({});
const getUserAnalytics = async (req, res) => res.json({});
const getAcademicAnalytics = async (req, res) => res.json({});
const getSystemAnalytics = async (req, res) => res.json({});
const generateUserReport = async (req, res) => res.json({});
const generateAcademicReport = async (req, res) => res.json({});
const generateFinancialReport = async (req, res) => res.json({});
const generateSystemReport = async (req, res) => res.json({});
const getPerformanceMetrics = async (req, res) => res.json({});
const getUsageMetrics = async (req, res) => res.json({});
const getErrorMetrics = async (req, res) => res.json({});

// Fonctions utilitaires
const importUsers = async (req, res) => res.json({ message: "Utilisateurs importés" });
const exportUsers = async (req, res) => res.json({});
const importCourses = async (req, res) => res.json({ message: "Cours importés" });
const exportCourses = async (req, res) => res.json({});
const sendNotification = async (req, res) => res.json({ message: "Notification envoyée" });
const getNotificationHistory = async (req, res) => res.json([]);

// Fonctions pour les classes
const addStudentsToClass = async (req, res) => res.json({ message: "Étudiants ajoutés à la classe" });
const removeStudentsFromClass = async (req, res) => res.json({ message: "Étudiants retirés de la classe" });

// Fonction legacy
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
  // Authentification Admin
  registerAdmin, loginAdmin, getAdminProfile, updateAdminProfile,
  
  // Gestion des utilisateurs
  getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent, bulkActionStudents,
  getAllTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher, bulkActionTeachers,
  getAllParents, getParentById, createParent, updateParent, deleteParent,
  getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin,
  
  // Gestion académique
  getAllClasses, getClassById, createClass, updateClass, deleteClass, addStudentsToClass, removeStudentsFromClass,
  getAllSubjects, getSubjectById, createSubject, updateSubject, deleteSubject,
  getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse,
  getAllHomework, getHomeworkById, createHomework, updateHomework, deleteHomework,
  getAllExams, getExamById, createExam, updateExam, deleteExam,
  
  // Gestion des données
  getAllGrades, getStudentGrades, getCourseGrades, createGrade, updateGrade, deleteGrade, bulkUpdateGrades,
  getAllAbsences, getStudentAbsences, getCourseAbsences, createAbsence, updateAbsence, deleteAbsence,
  getAllReminders, getReminderById, createReminder, updateReminder, deleteReminder,
  getAllRequests, getRequestById, updateRequest, deleteRequest,
  getAllTrainings, getTrainingById, createTraining, updateTraining, deleteTraining,
  
  // Système
  getSettings, updateSettings, createBackup, restoreBackup,
  getLogs, getErrorLogs, getAccessLogs, clearLogs,
  getSecurityStatus, securityScan, getSecurityUsers, blockUser, unblockUser,
  enableMaintenance, disableMaintenance, getMaintenanceStatus,
  
  // Analytics
  getAnalyticsOverview, getUserAnalytics, getAcademicAnalytics, getSystemAnalytics,
  generateUserReport, generateAcademicReport, generateFinancialReport, generateSystemReport,
  getPerformanceMetrics, getUsageMetrics, getErrorMetrics,
  
  // Utilitaires
  importUsers, exportUsers, importCourses, exportCourses,
  sendNotification, getNotificationHistory,
  
  // Dashboard
  getDashboardStats, getRecentActivities, getSystemAlerts,
  
  // Legacy
  associateOldSeancesWithCourses
};
