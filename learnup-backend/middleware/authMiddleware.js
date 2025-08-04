const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Admin = require("../models/Admin");
const Parent = require("../models/Parent");

const roleModelMap = {
  student: Student,
  teacher: Teacher,
  admin: Admin,
  parent: Parent,
};

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Non autorisé : token manquant." });
    }

    const token = authHeader.split(" ")[1];
    
    // Token de test pour le développement
    if (token === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk5YzY5YzY5YzY5YzY5YzY5YzY5YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNDY5NzIwMCwiZXhwIjoxNzA0NzgzNjAwfQ.example') {
      console.log('🔧 Token de test détecté - Bypass d\'authentification pour le développement');
      req.user = {
        _id: '507f1f77bcf86cd799439011',
        role: 'admin',
        nom: 'Admin',
        prenom: 'Test'
      };
      return next();
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Sécurité : vérifie que le rôle est bien présent dans le token
    if (!decoded.role) {
      console.error('❌ Token invalide : rôle manquant');
      return res.status(403).json({ message: "Token invalide : rôle utilisateur manquant." });
    }

    const id = decoded._id || decoded.id || decoded.userId;
    const role = decoded.role.toLowerCase();

    console.log('🔍 Token décodé:', { id, role });

    const Model = roleModelMap[role];
    if (!Model) {
      console.log('❌ Rôle invalide:', role);
      return res.status(403).json({ message: "Rôle utilisateur invalide." });
    }

    const user = await Model.findById(id).select("-password");
    if (!user) {
      console.log('❌ Utilisateur non trouvé:', { id, role, Model: Model.modelName });
      return res.status(401).json({ message: "Utilisateur introuvable." });
    }

    user.role = role;
    req.user = user;
    console.log('✅ Utilisateur authentifié:', { id: user._id, role: user.role, name: user.name });

    next();
  } catch (error) {
    console.error('❌ Erreur d\'authentification:', error.message);
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      console.warn('⛔ Accès refusé :', {
        userRole: req.user?.role,
        allowed: allowedRoles
      });
      return res.status(403).json({ message: "Accès refusé : rôle insuffisant." });
    }
    next();
  };
};

// Middleware spécifique pour les admins
const admin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: "Accès refusé : droits administrateur requis." });
  }
  next();
};

// Middleware spécifique pour les professeurs
const teacher = (req, res, next) => {
  if (!req.user || req.user.role !== 'teacher') {
    return res.status(403).json({ message: "Accès refusé : droits professeur requis." });
  }
  next();
};

// Middleware spécifique pour les étudiants
const student = (req, res, next) => {
  if (!req.user || req.user.role !== 'student') {
    return res.status(403).json({ message: "Accès refusé : droits étudiant requis." });
  }
  next();
};

// Middleware spécifique pour les parents
const parent = (req, res, next) => {
  if (!req.user || req.user.role !== 'parent') {
    return res.status(403).json({ message: "Accès refusé : droits parent requis." });
  }
  next();
};

module.exports = {
  protect,
  authorizeRoles,
  admin,
  teacher,
  student,
  parent,
};
