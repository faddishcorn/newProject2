const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// ✅ 내 프로필 조회
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // 비밀번호 제외
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "프로필 조회 실패" });
  }
});

// ✅ 내 프로필 수정
router.put(
  "/profile",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      const {
        username,
        email,
        gender,
        birthdate,
        height,
        weight,
        isPrivate,
        password,
        newPassword,
      } = req.body;

      if (username) user.username = username;
      if (email) user.email = email;
      if (gender !== undefined)
        user.gender =
          gender === "private" || gender === "" || gender === "null"
            ? null
            : gender;
      if (birthdate !== undefined)
        user.birthdate =
          birthdate === "private" || birthdate === "" || birthdate === "null"
            ? null
            : birthdate;
      if (height !== undefined)
        user.height =
          height === "private" || height === "" || height === "null"
            ? null
            : height;
      if (weight !== undefined)
        user.weight =
          weight === "private" || weight === "" || weight === "null"
            ? null
            : weight;
      if (isPrivate !== undefined) user.isPrivate = isPrivate === "true"; // 문자열 변환

      // 비밀번호 변경
      if (newPassword) {
        if (!password) {
          return res
            .status(400)
            .json({ message: "현재 비밀번호를 입력해주세요." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res
            .status(400)
            .json({ message: "현재 비밀번호가 일치하지 않습니다." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedNewPassword;
      }

      // avatar 업데이트
      if (req.file && req.file.path) {
        user.avatar = req.file.path;
      }

      if (req.body.avatarDelete === "true") {
        user.avatar = null;
      }

      await user.save();

      res.json({ message: "프로필 업데이트 완료", user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "프로필 업데이트 실패" });
    }
  },
);

// ✅ 회원 탈퇴
router.delete("/account", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: "계정이 삭제되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "계정 삭제 실패" });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const currentUserId = req.user.id; // authMiddleware에서 토큰 파싱해서 req.user에 저장
    const isFollowing = user.followers.includes(currentUserId); // 이 유저의 followers 목록에 내가 있는지 확인
    res.json({
      ...user.toObject(), // user를 plain JS 객체로 변환해서 펼치고
      isFollowing, // 🔥 추가
    });
  } catch (error) {
    console.error("다른 사용자 프로필 조회 오류:", error);
    res
      .status(500)
      .json({ message: "사용자 정보를 가져오는 데 실패했습니다." });
  }
});

module.exports = router;
