const express = require("express");
const {
  getMessagesByCourse,
  postMessage,
  deleteMessage,
  updateMessage,
} = require("../controllers/forumController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Récupérer les messages et poster un nouveau message pour un cours donné
router
  .route("/:courseId")
  .get(protect, getMessagesByCourse)
  .post(protect, postMessage);

// Supprimer un message spécifique
router.delete("/message/:messageId", protect, deleteMessage);

// Modifier un message spécifique
router.put("/message/:messageId", protect, updateMessage);

module.exports = router;
