const mongoose = require("mongoose");

const forumMessageSchema = new mongoose.Schema({
  // Scope: either course or chapitre
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  chapitreId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapitre", default: null },
  author: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "authorModel" },
  authorModel: { type: String, required: true, enum: ["Student", "Teacher"] },
  content: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "ForumMessage", default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ForumMessage", forumMessageSchema);