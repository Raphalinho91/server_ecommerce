require('dotenv').config();
const mongoose = require('mongoose');

const databaseURL = process.env.DATABASE;

const connectDB = async () => {
  try {
    await mongoose.connect(databaseURL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Could not connect to MongoDB', err);
    process.exit(1); 
  }
};

module.exports = connectDB;
