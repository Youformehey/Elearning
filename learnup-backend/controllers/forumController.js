const ForumMessage = require("../models/ForumMessage");

// GET /api/forum/:courseId
exports.getMessagesByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const messages = await ForumMessage.find({ courseId })
      .populate("author", "name email")
      .sort({ createdAt: 1 });

    const formatted = messages.map((msg) => ({
      _id: msg._id,
      content: msg.content,
      senderName: msg.author?.name || "Inconnu",
      senderRole: msg.authorModel,
      // parentId: msg.parentId || null, // décommente si tu utilises parentId
      createdAt: msg.createdAt,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Erreur récupération messages :", err);
    res.status(500).json({ message: "Erreur récupération messages" });
  }
};

// POST /api/forum/:courseId
exports.postMessage = async (req, res) => {
  const { content /*, parentId */ } = req.body; // parentId optionnel
  const courseId = req.params.courseId;

  if (!content || !courseId) {
    return res.status(400).json({ message: "Contenu ou courseId manquant." });
  }

  try {
    // Assure la bonne casse pour authorModel
    const role = req.user.role?.toLowerCase() === "teacher" ? "Teacher" : "Student";

    const newMessage = await ForumMessage.create({
      courseId,
      content,
      author: req.user._id,
      authorModel: role,
      // parentId: parentId || null, // décommente si tu utilises parentId
    });

    const populated = await newMessage.populate("author", "name email");

    res.status(201).json({
      _id: populated._id,
      content: populated.content,
      senderName: populated.author?.name || "Inconnu",
      senderRole: populated.authorModel,
      // parentId: populated.parentId || null, // décommente si tu utilises parentId
      createdAt: populated.createdAt,
    });
  } catch (err) {
    console.error("Erreur enregistrement message :", err);
    res.status(400).json({ message: "Erreur enregistrement message" });
  }
};

// DELETE /api/forum/:messageId
exports.deleteMessage = async (req, res) => {
  const messageId = req.params.messageId;

  try {
    const message = await ForumMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message introuvable" });
    }

    if (message.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé à supprimer ce message" });
    }

    await message.deleteOne();

    res.status(200).json({ message: "Message supprimé avec succès" });
  } catch (err) {
    console.error("Erreur suppression message :", err);
    res.status(500).json({ message: "Erreur suppression message" });
  }
};

// PUT /api/forum/:messageId
exports.updateMessage = async (req, res) => {
  const messageId = req.params.messageId;
  const { content } = req.body;

  try {
    const message = await ForumMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message introuvable" });
    }

    if (message.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé à modifier ce message" });
    }

    message.content = content || message.content;
    await message.save();

    res.status(200).json({
      message: "Message modifié",
      data: {
        _id: message._id,
        content: message.content,
        senderRole: message.authorModel,
        updatedAt: message.updatedAt,
      },
    });
  } catch (err) {
    console.error("Erreur modification message :", err);
    res.status(500).json({ message: "Erreur modification message" });
  }
};
