const multer = require('multer');
const path = require('path');

// 저장할 위치와 파일명 지정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 프로젝트 루트/uploads 폴더에 저장
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, basename + '-' + Date.now() + ext); // 파일명-타임스탬프.확장자
  },
});

const upload = multer({ storage });

module.exports = upload;
