const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // ✅ 쿠키에서 가져오기!

  if (!token) {
    return res.status(401).json({ message: '인증 토큰이 없습니다' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ req.user에 디코딩 결과 저장
    next();
  } catch (err) {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다' });
  }
};

module.exports = authMiddleware;