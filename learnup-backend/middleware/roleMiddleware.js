const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("Authorization header:", req.headers.authorization);
console.log("Decoded user in protect:", req.user);
console.log("User role in authorizeRoles:", req.user.role);

    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden: insufficient rights" });
    }
    next();
  };
};

module.exports = authorizeRoles;
