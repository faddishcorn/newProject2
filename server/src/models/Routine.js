const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false },
});

const routineSchema = new mongoose.Schema({
  title: { type: String, required: true }, // 루틴 이름 (선택)
  exercises: [exerciseSchema],
  createdAt: { type: Date, default: Date.now },
});

const dailyRoutineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // ex: '2025-04-10' (하루 단위로 저장)
  routines: [routineSchema],
});

module.exports = mongoose.model("DailyRoutine", dailyRoutineSchema);
