const bcrypt = require('bcrypt');
const User = require('../models/User');

const signup = async (req, res) => {
  const { username, email, password } = req.body;

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
    });

    await newUser.save();

    res.status(201).json({ message: '회원가입 성공' });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
};

module.exports = { signup };
