const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { JWT_SECRET } = require('../config/keys');

async function registerUser(username, email, password) {
  // Check if user already exists
  const [existing] = await pool.query(
    'SELECT id FROM users WHERE email = ? OR username = ?',
    [email, username]
  );
  if (existing.length > 0) {
    throw new Error('Username or email already exists');
  }

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 12);

  // Insert new user
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    [username, email, passwordHash]
  );

  return { userId: result.insertId, username, email };
}

async function loginUser(email, password) {
  // Find user by email
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  if (rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = rows[0];

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { token, username: user.username, userId: user.id };
}

module.exports = { registerUser, loginUser };