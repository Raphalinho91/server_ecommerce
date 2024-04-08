const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: false },
  emailIsValid: { type: Boolean, default: false },
  acceptTheTermsOfUse: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  accountGoogle: { type: Boolean, default: false },
  phoneNumber: { type: String, sparse: true, default: null },
  address: { type: String },
});

module.exports = mongoose.model("User", userSchema);
