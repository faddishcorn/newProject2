const express = require('express');
const { signup } = require('../controllers/authController');
const {login} = require('../controllers/authController');
const { getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);

module.exports = router;
