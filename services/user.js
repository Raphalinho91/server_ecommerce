const User = require("../models/user");
const { verifyEmailCode } = require("./email");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Token = require('../models/token');
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
    throw new Error('User not found');
  }
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Incorrect password');
  }

  return user;
}

async function generateAndSaveToken(user) {
  const tokenPayload = { userId: user._id, email: user.email };
  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '2h' });
  await Token.deleteMany({ userId: user._id });

  await Token.create({
    userId: user._id,
    email: user.email,
    token: token
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
    throw new Error('User not found.');
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

module.exports = {
  findUserByEmail,
  createUser,
  authenticateUser, 
  generateAndSaveToken,
  resetPassword,
  deleteUserById,
  decodeToken,
  isAdminUser,
  getAllUsers
};
