// models/RappelFait.js
const mongoose = require("mongoose");

const rappelFaitSchema = new mongoose.Schema({
  rappel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rappel",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  faitLe: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("RappelFait", rappelFaitSchema);
