const CryptoJS = require('crypto-js');
const bcrypt = require('bcrypt');

// SHA256 for transformation fingerprint
function sha256Hash(password) {
  return CryptoJS.SHA256(password).toString();
}

// bcrypt for final secure storage
async function bcryptHash(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(plainText, bcryptStored) {
  return await bcrypt.compare(plainText, bcryptStored);
}

module.exports = { sha256Hash, bcryptHash, verifyPassword };