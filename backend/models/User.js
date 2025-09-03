const mongoose = require('mongoose');
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  email: { type: String, required: true, unique: true },
}, { versionKey: false }));

module.exports = User;