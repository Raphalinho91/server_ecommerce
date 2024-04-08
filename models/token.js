const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  email: { type: String, required: true },
  token: { type: String, required: true },
  created: { type: Date, default: Date.now },
  expired: { type: Date, default: () => new Date(+new Date() + 2*60*60*1000) } 
});

module.exports = mongoose.model('Token', tokenSchema);
