const express = require('express');
const router = express.Router();
const { transform, getHistory } = require('../controllers/passwordController');
const verifyToken = require('../middleware/authMiddleware');

// Public — works with or without login
router.post('/transform', verifyToken, transform);

// Protected — requires login
router.get('/history', verifyToken, getHistory);

module.exports = router;