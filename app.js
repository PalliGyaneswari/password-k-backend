const express = require('express');
const cors = require('cors');
const limiter = require('./middleware/rateLimiter');
const passwordRoutes = require('./routes/passwordRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://password-k.vercel.app' // your Vercel URL
  ],
  credentials: true
}));

app.use(express.json());
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health', (req, res) =>
  res.json({ status: 'Password K alive 🔥' })
);

module.exports = app;