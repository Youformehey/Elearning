const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const parentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "parent", enum: ["parent"] },
  tel: { type: String, required: true },
  adresse: { type: String, default: "" },
  photo: { type: String, default: "" },
  // Relation avec les étudiants (enfants)
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student", default: [] }],
  // Informations de paiement
  paymentInfo: {
    cardNumber: { type: String, default: "" },
    expiryDate: { type: String, default: "" },
    cvv: { type: String, default: "" }
  }
}, { timestamps: true });

parentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

parentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Parent", parentSchema); 