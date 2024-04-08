const mongoose = require('mongoose');

const codeForEmailSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  created: { type: Date, default: Date.now },
  expired: { type: Date, default: () => new Date(+new Date() + 5*60*1000) } 
});

module.exports = mongoose.model('CodeForEmail', codeForEmailSchema);
