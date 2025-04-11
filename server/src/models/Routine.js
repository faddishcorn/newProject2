// models/Routine.js
const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false }, // ✅ 완료 여부
});

const routineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now }, // 수행한 날짜 (루틴 1일 1개 제한에 사용됨)
  routine: [exerciseSchema],
});

module.exports = mongoose.model('Routine', routineSchema);
