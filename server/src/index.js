const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const gptRoutes = require('./routes/gptRoutes');
const routineRoutes = require('./routes/routineRoutes');
const socialRoutes = require('./routes/socialRoutes');
const userRoutes = require('./routes/userRoutes');
const workoutLogRoutes = require('./routes/workoutLogRoutes');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL, // origin 주소
  credentials: true, // 쿠키 허용
}));
app.use('/uploads', cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}), express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use('/api/gpt', gptRoutes);
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/routines', routineRoutes);
app.use('/api/social', socialRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/users', userRoutes);
app.use('/api/workout-logs', workoutLogRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(5000, () => console.log('🚀 Server running on port 5000'));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
