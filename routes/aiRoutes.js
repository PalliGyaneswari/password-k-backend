const express = require('express');
const router = express.Router();
const { analyze, chat, suggest } = require('../controllers/aiController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/analyze', verifyToken, analyze);
router.post('/chat', verifyToken, chat);
router.post('/suggest', verifyToken, suggest);

module.exports = router;