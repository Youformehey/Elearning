const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Admin = require("../models/Admin");

const roleModelMap = {
  student: Student,
  teacher: Teacher,
  admin: Admin,
};

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Non autorisé : token manquant." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const id = decoded._id || decoded.id;
    const role = decoded.role.toLowerCase();

    const Model = roleModelMap[role];
    if (!Model) {
      return res.status(403).json({ message: "Rôle utilisateur invalide." });
    }

    const user = await Model.findById(id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable." });
    }

    user.role = role;
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé : rôle insuffisant." });
    }
    next();
  };
};

module.exports = {
  protect,
  authorizeRoles,
};
