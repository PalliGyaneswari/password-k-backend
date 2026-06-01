const { detectPatterns } = require('../transformations/patternDetector');
const { getTransformSymbol, injectSymbols } = require('../transformations/symbolEngine');
const { sha256Hash, bcryptHash } = require('../hashing/hashService');
const { SECRET_KEY } = require('../config/keys');
const pool = require('../config/db');
const crypto = require('crypto');

async function transformPassword(userInput, userId = null) {
  const sessionSalt = crypto.randomBytes(16).toString('hex');
  const patterns = detectPatterns(userInput);

  let transformed = userInput;
  for (const p of patterns) {
    const symbol = getTransformSymbol(SECRET_KEY, sessionSalt, p.letter);
    transformed = transformed.replace(p.fullMatch, p.letter + symbol);
  }

  transformed = transformed.replace(/\s+/g, '');
  transformed = injectSymbols(transformed, SECRET_KEY, sessionSalt);

  const sha256 = sha256Hash(transformed);
  const bcryptStored = await bcryptHash(transformed);

  // Save to history if user is logged in
  if (userId) {
    await pool.query(
      `INSERT INTO password_history 
       (user_id, original_input, transformed, sha256_hash, session_salt) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, userInput, transformed, sha256, sessionSalt]
    );
  }

  return { original: userInput, transformed, sha256, bcryptStored, sessionSalt };
}

module.exports = { transformPassword };