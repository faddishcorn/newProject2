// server/routes/socialRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getFollowings,
  getFollowers,
  getSentRequests,
  getReceivedRequests,
  searchUsers,
  sendFollowRequest,
  cancelFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
  unfollowUser,
  removeFollower,
} = require("../controllers/socialControllers");

router.get("/followings", authMiddleware, getFollowings);
router.get("/followers", authMiddleware, getFollowers);
router.get("/requests/sent", authMiddleware, getSentRequests);
router.get("/requests/received", authMiddleware, getReceivedRequests);
router.get("/search", searchUsers); // 비회원도 검색 가능하도록 authMiddleware 제거

router.post("/request", authMiddleware, sendFollowRequest);
router.delete("/request/:id", authMiddleware, cancelFollowRequest);
router.post("/request/:id/accept", authMiddleware, acceptFollowRequest);
router.post("/request/:id/reject", authMiddleware, rejectFollowRequest);
router.delete("/unfollow/:id", authMiddleware, unfollowUser);
router.delete("/followers/:id", authMiddleware, removeFollower);

module.exports = router;
