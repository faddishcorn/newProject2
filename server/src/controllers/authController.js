const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signup = async (req, res) => {
  const { username, email, password, height, weight, gender, birthdate } = req.body;

  try {
    // 사용자 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: '이미 가입된 이메일입니다.' });

    // 비밀번호 암호화
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 사용자 생성
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      height,
      weight,
      gender,
      birthdate,
    });

    await newUser.save();

    res.status(201).json({ message: '회원가입 성공' });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "존재하지 않는 이메일입니다." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // 배포환경에서만 secure 적용
      sameSite: 'Strict', // CSRF 방어용
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    res.status(200).json({ message: "로그인 성공" });
  } catch (err) {
    console.error("로그인 에러:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
  res.status(200).json({ message: '로그아웃 성공' });
};

const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password")
  res.json(user)
}

module.exports = { signup, login, logout, getMe };
