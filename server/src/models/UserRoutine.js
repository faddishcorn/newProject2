const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true }
});

const userRoutineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  exercises: [exerciseSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserRoutine', userRoutineSchema);
