// server/src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  height:   { type: Number },
  weight:   { type: Number },
  gender:   { type: String },
  birthdate:{ type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
