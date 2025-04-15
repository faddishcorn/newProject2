const express = require('express');
const router = express.Router();
const { getMyRoutines, createRoutine, deleteRoutine, updateRoutine, saveRoutineHistory } = require('../controllers/routineController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getMyRoutines);
router.post('/', authMiddleware, createRoutine);
router.delete('/:id', authMiddleware, deleteRoutine);
router.put('/:id', authMiddleware, updateRoutine);
router.post('/history', authMiddleware, saveRoutineHistory);
module.exports = router;
