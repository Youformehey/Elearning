// routes/rappelFaitRoutes.js
const express = require("express");
const router = express.Router();
const { markRappelAsDone } = require("../controllers/rappelFaitController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, authorizeRoles("student"), markRappelAsDone);

module.exports = router;
