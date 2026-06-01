const { transformPassword } = require('../services/transformService');
const pool = require('../config/db');

async function transform(req, res) {
  try {
    const { input } = req.body;
    if (!input || !input.trim())
      return res.status(400).json({ error: 'Input is required' });

    const userId = req.user?.userId || null;
    const result = await transformPassword(input, userId);

    res.json({
      transformed: result.transformed,
      sha256: result.sha256,
      sessionSalt: result.sessionSalt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Transformation failed' });
  }
}

async function getHistory(req, res) {
  try {
    const userId = req.user.userId;
    const [rows] = await pool.query(
      `SELECT original_input, transformed, sha256_hash, created_at 
       FROM password_history 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 20`,
      [userId]
    );
    res.json({ history: rows });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch history' });
  }
}

module.exports = { transform, getHistory };