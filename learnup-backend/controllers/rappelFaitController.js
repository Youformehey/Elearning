// controllers/rappelFaitController.js
const RappelFait = require("../models/RappelFait");

const markRappelAsDone = async (req, res) => {
  const studentId = req.user.id;
  const { rappelId } = req.body;

  try {
    let rappelFait = await RappelFait.findOne({ rappel: rappelId, student: studentId });
    if (!rappelFait) {
      rappelFait = await RappelFait.create({ rappel: rappelId, student: studentId });
    }
    res.status(200).json({ message: "Rappel marqué comme fait.", rappelFait });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { markRappelAsDone };
