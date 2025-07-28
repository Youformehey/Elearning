const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  classe: { type: String, required: true },
  role: { type: String, default: "student", enum: ["student"] },
  photo: { type: String, default: "" },
  tel: { type: String, default: "" },
  adresse: { type: String, default: "" },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course", default: [] }],
  // Relation avec les parents
  parents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Parent", default: [] }],
}, { timestamps: true });

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Student", studentSchema);
