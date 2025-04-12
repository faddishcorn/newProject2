const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const gptRoutes = require('./routes/gptRoutes');
const routineRoutes = require('./routes/routineRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/gpt', gptRoutes);
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/routines', routineRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(5000, () => console.log('🚀 Server running on port 5000'));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
