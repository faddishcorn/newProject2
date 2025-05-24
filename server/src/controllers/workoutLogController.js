// server/controllers/workoutLogController.js

const WorkoutLogComment = require("../models/WorkoutLogComment");
const Routine = require("../models/Routine");
const User = require("../models/User");
const mongoose = require("mongoose");

// ✅ 운동 기록 날짜 목록 가져오기
const getWorkoutDates = async (req, res) => {
  try {
    const userId = req.params.userId;
    const routines = await Routine.find({ userId });
    const dates = routines.map((routine) => routine.date);
    res.json(dates);
  } catch (error) {
    console.error("운동 기록 날짜 조회 오류:", error);
    res
      .status(500)
      .json({ message: "운동 기록 날짜를 가져오는 데 실패했습니다." });
  }
};

// ✅ 특정 날짜 운동 기록 가져오기
const getWorkoutLogByDate = async (req, res) => {
  try {
    const { userId, date } = req.params;
    const log = await Routine.findOne({ userId, date });

    if (!log) return res.json([]);

    res.json(log.routines);
  } catch (error) {
    console.error("운동 기록 조회 오류:", error);
    res.status(500).json({ message: "운동 기록을 가져오는 데 실패했습니다." });
  }
};

// ✅ 댓글 목록 가져오기
const getComments = async (req, res) => {
  try {
    const workoutUserId = new mongoose.Types.ObjectId(req.params.userId); // 💥 진짜 변환

    const comments = await WorkoutLogComment.find({ workoutUserId }).populate(
      "writerUserId",
      "username avatar",
    );

    const formatted = comments.map((comment) => ({
      id: comment._id,
      userId: comment.writerUserId._id,
      username: comment.writerUserId.username,
      avatar: comment.writerUserId.avatar,
      content: comment.content,
      createdAt: comment.createdAt,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("댓글 조회 오류:", error);
    res.status(500).json({ message: "댓글을 가져오는 데 실패했습니다." });
  }
};

// 댓글 작성하기
const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const workoutUserId = req.params.userId;
    const writerUserId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
    }

    const newComment = new WorkoutLogComment({
      workoutUserId,
      writerUserId,
      content,
    });
    await newComment.save();

    // populate는 save 이후에
    const populatedComment = await newComment.populate(
      "writerUserId",
      "username avatar",
    );

    // 여기서 최종적으로 한번만 응답
    res.status(201).json({
      id: populatedComment._id,
      userId: populatedComment.writerUserId._id,
      username: populatedComment.writerUserId.username,
      avatar: populatedComment.writerUserId.avatar,
      content: populatedComment.content,
      createdAt: populatedComment.createdAt,
    });
  } catch (error) {
    console.error("댓글 작성 오류:", error);
    res.status(500).json({ message: "댓글 작성에 실패했습니다." });
  }
};

// ✅ 댓글 수정하기
const updateComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;

    const comment = await WorkoutLogComment.findById(commentId);

    if (!comment)
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });

    if (comment.writerUserId.toString() !== req.user.id) {
      return res.status(403).json({ message: "수정 권한이 없습니다." });
    }

    comment.content = content;
    await comment.save();

    res.json({ message: "댓글이 수정되었습니다." });
  } catch (error) {
    console.error("댓글 수정 오류:", error);
    res.status(500).json({ message: "댓글 수정에 실패했습니다." });
  }
};

// ✅ 댓글 삭제하기
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const comment = await WorkoutLogComment.findById(commentId);

    if (!comment)
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });

    const workoutOwnerId = comment.workoutUserId.toString(); // 운동기록 주인
    const currentUserId = req.user.id;

    if (
      comment.writerUserId.toString() !== currentUserId &&
      workoutOwnerId !== currentUserId
    ) {
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
    }

    await WorkoutLogComment.findByIdAndDelete(commentId);

    res.json({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    console.error("댓글 삭제 오류:", error);
    res.status(500).json({ message: "댓글 삭제에 실패했습니다." });
  }
};

// ✅ 최종 export
module.exports = {
  getWorkoutDates,
  getWorkoutLogByDate,
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
