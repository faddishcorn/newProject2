// server/routes/workoutLogRoutes.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const workoutLogController = require("../controllers/workoutLogController");

// ✅ 운동 기록 날짜 목록 가져오기
router.get("/dates/:userId", workoutLogController.getWorkoutDates);

// ✅ 운동 기록 댓글 가져오기
router.get("/:userId/comments", workoutLogController.getComments);

// ✅ 운동 기록 댓글 작성 (로그인 필요)
router.post(
  "/:userId/comments",
  authMiddleware,
  workoutLogController.createComment,
);

// ✅ 운동 기록 댓글 수정 (로그인 필요)
router.put(
  "/comments/:commentId",
  authMiddleware,
  workoutLogController.updateComment,
);

// ✅ 운동 기록 댓글 삭제 (로그인 필요)
router.delete(
  "/comments/:commentId",
  authMiddleware,
  workoutLogController.deleteComment,
);

// ✅ 특정 날짜 운동 기록 가져오기
router.get("/:userId/:date", workoutLogController.getWorkoutLogByDate);

module.exports = router;
