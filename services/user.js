const User = require("../models/user");
const { verifyEmailCode } = require("./email");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Token = require("../models/token");
const JWT_SECRET = process.env.JWT_SECRET;

const saltRounds = 10;

async function findUserByEmail(email) {
  const user = await User.findOne({ email: email });
  return user;
}

async function createUser(userData, code) {
  await verifyEmailCode(userData.email, code);
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
  const user = new User({
    ...userData,
    password: hashedPassword,
    emailIsValid: true,
  });
  await user.save();
  return user;
}

async function authenticateUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Utilisateur introuvable !");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Mot de passe incorrect !");
  }

  return user;
}

async function createUserGoogle(email, firstName, lastName) {
  const hashedPassword = await bcrypt.hash(
    "*Password_Securised-For$Account§Google99!",
    saltRounds
  );
  const newUser = new User({
    email,
    firstName,
    lastName,
    password: hashedPassword,
    emailIsValid: true,
    acceptTheTermsOfUse: true,
    accountGoogle: true,
  });
  await newUser.save();
  return newUser;
}

async function generateAndSaveToken(user) {
  const tokenPayload = { userId: user._id, email: user.email };
  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "2h" });
  await Token.deleteMany({ email: user.email });

  await Token.create({
    userId: user._id,
    email: user.email,
    token: token,
  });

  return token;
}

async function resetPassword(email, newPassword, code) {
  await verifyEmailCode(email, code);
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  const updatedUser = await User.findOneAndUpdate(
    { email: email },
    { password: hashedPassword },
    { new: true }
  );
  if (!updatedUser) {
    throw new Error("Utilisateur introuvable !");
  }
  return updatedUser;
}

const deleteUserById = async (userId) => {
  const result = await User.findByIdAndDelete(userId);
  return result;
};

const decodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    console.error("Erreur lors du décodage du token:", error);
    return null;
  }
};

const isAdminUser = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    return user.isAdmin;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'admin:", error);
    return false;
  }
};

const getAllUsers = async () => {
  return await User.find({});
};

const isUser = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    return user;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'admin:", error);
    return false;
  }
};

const getJustOneUser = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

const updateUser = async (userId, userData) => {
  return User.findByIdAndUpdate(userId, userData, { new: true });
};

module.exports = {
  findUserByEmail,
  createUser,
  authenticateUser,
  generateAndSaveToken,
  resetPassword,
  deleteUserById,
  decodeToken,
  isAdminUser,
  getAllUsers,
  getJustOneUser,
  isUser,
  updateUser,
  createUserGoogle,
};
