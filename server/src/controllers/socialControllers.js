// server/controllers/socialController.js

const User = require("../models/User");

// ✅ 내 팔로잉 목록 가져오기
const getFollowings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("following", "username avatar gender");
    res.json(user.following);
  } catch (err) {
    res.status(500).json({ message: "팔로잉 목록을 불러올 수 없습니다." });
  }
};

// ✅ 내 팔로워 목록 가져오기
const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("followers", "username avatar gender");
    res.json(user.followers);
  } catch (err) {
    res.status(500).json({ message: "팔로워 목록을 불러올 수 없습니다." });
  }
};

// ✅ 내가 보낸 팔로우 요청
const getSentRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("sentRequests", "username avatar gender");
    res.json(user.sentRequests);
  } catch (err) {
    res.status(500).json({ message: "보낸 요청을 불러올 수 없습니다." });
  }
};

// ✅ 내가 받은 팔로우 요청
const getReceivedRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("receivedRequests", "username avatar gender");
    res.json(user.receivedRequests);
  } catch (err) {
    res.status(500).json({ message: "받은 요청을 불러올 수 없습니다." });
  }
};

// ✅ 사용자 검색
const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.q;
    if (!keyword) return res.json([]);

    // 검색 대상 유저들
    const users = await User.find({
      username: { $regex: keyword, $options: "i" },
      _id: { $ne: req.user.id },
    }).select("username avatar gender");

    // 현재 로그인한 유저 정보 가져오기
    const me = await User.findById(req.user.id);

    // 결과 가공
    const response = users.map((target) => {
      let status = "none";
      if (me.following.includes(target._id)) {
        status = "following";
      } else if (me.sentRequests.includes(target._id)) {
        status = "requested";
      }
      return {
        id: target._id, // id 필드로 맞춰주자
        username: target.username,
        avatar: target.avatar,
        gender: target.gender,
        status, // 추가
      };
    });

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: "사용자 검색 실패" });
  }
};

// ✅ 팔로우 요청 보내기 (POST /request)
const sendFollowRequest = async (req, res) => {
  try {
    const { targetId } = req.body;
    const user = await User.findById(req.user.id);
    const target = await User.findById(targetId);

    if (!target) return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });

    if (
      user.following.includes(targetId) ||
      user.sentRequests.includes(targetId) ||
      target.receivedRequests.includes(req.user.id)
    ) {
      return res.status(400).json({ message: "이미 팔로우 요청 중이거나 팔로우 상태입니다." });
    }

    if (target.isPrivate) {
      // 비공개인 경우: 팔로우 요청
      user.sentRequests.push(targetId);
      target.receivedRequests.push(user._id);
      await user.save();
      await target.save();
      res.json({ message: "팔로우 요청을 보냈습니다." });
    } else {
      // 공개인 경우: 바로 팔로우 관계 맺기
      user.following.push(targetId);
      target.followers.push(user._id);
      await user.save();
      await target.save();
      res.json({ message: "바로 팔로우 완료되었습니다." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "요청을 보낼 수 없습니다." });
  }
};

// ✅ 팔로우 요청 취소
const cancelFollowRequest = async (req, res) => {
  try {
    const targetId = req.params.id;
    const user = await User.findById(req.user.id);
    const target = await User.findById(targetId);

    user.sentRequests = user.sentRequests.filter((id) => id.toString() !== targetId);
    target.receivedRequests = target.receivedRequests.filter((id) => id.toString() !== req.user.id);

    await user.save();
    await target.save();

    res.json({ message: "팔로우 요청을 취소했습니다." });
  } catch (err) {
    res.status(500).json({ message: "요청을 취소할 수 없습니다." });
  }
};

// ✅ 팔로우 요청 수락
const acceptFollowRequest = async (req, res) => {
  try {
    const targetId = req.params.id;
    const user = await User.findById(req.user.id);
    const target = await User.findById(targetId);

    user.followers.push(targetId);
    target.following.push(user._id);

    user.receivedRequests = user.receivedRequests.filter((id) => id.toString() !== targetId);
    target.sentRequests = target.sentRequests.filter((id) => id.toString() !== req.user.id);

    await user.save();
    await target.save();

    res.json({ message: "요청을 수락했습니다." });
  } catch (err) {
    res.status(500).json({ message: "요청 수락 중 오류 발생." });
  }
};

// ✅ 팔로우 요청 거절
const rejectFollowRequest = async (req, res) => {
  try {
    const targetId = req.params.id;
    const user = await User.findById(req.user.id);
    const target = await User.findById(targetId);

    user.receivedRequests = user.receivedRequests.filter((id) => id.toString() !== targetId);
    target.sentRequests = target.sentRequests.filter((id) => id.toString() !== req.user.id);

    await user.save();
    await target.save();

    res.json({ message: "요청을 거절했습니다." });
  } catch (err) {
    res.status(500).json({ message: "요청 거절 중 오류 발생." });
  }
};

// ✅ 언팔로우
const unfollowUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const user = await User.findById(req.user.id);
    const target = await User.findById(targetId);

    user.following = user.following.filter((id) => id.toString() !== targetId);
    target.followers = target.followers.filter((id) => id.toString() !== req.user.id);

    await user.save();
    await target.save();

    res.json({ message: "언팔로우 완료." });
  } catch (err) {
    res.status(500).json({ message: "언팔로우 중 오류 발생." });
  }
};

// ✅ 팔로워 삭제
const removeFollower = async (req, res) => {
  try {
    const targetId = req.params.id;
    const user = await User.findById(req.user.id);
    const target = await User.findById(targetId);

    if (!target) return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });

    // 나를 팔로우한 사람 목록에서 제거
    user.followers = user.followers.filter((id) => id.toString() !== targetId);

    // 그 사람의 following 목록에서도 나를 제거
    target.following = target.following.filter((id) => id.toString() !== req.user.id);

    await user.save();
    await target.save();

    res.json({ message: "팔로워 삭제 완료" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "팔로워 삭제 중 오류 발생" });
  }
};

// ✅ 함수들 export
module.exports = {
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
};
