const express = require('express');
const router = express.Router();
const { generateRoutine } = require('../controllers/gptController');

router.post('/generate-routine', generateRoutine);
router.get('/test', (req, res) => {
  res.send("라우터 연결 OK");
});
module.exports = router;
