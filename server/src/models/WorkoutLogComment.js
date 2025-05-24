// server/models/WorkoutLogComment.js
const mongoose = require("mongoose");

const workoutLogCommentSchema = new mongoose.Schema({
  workoutUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // 운동 기록 주인
  writerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // 댓글 작성자
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WorkoutLogComment", workoutLogCommentSchema);
