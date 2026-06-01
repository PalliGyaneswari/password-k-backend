const { seededRandom } = require('../seed/cyrb128');

// Extended unicode-safe symbol set
const SYMBOL_SET = [
  '₩', '@', '#', '%', '&', '!', '*',
  '€', '£', '¥', '§', '†', '‡', '¶',
  '∆', 'Ω', 'π', 'Σ', 'λ', 'μ'
];

function getTransformSymbol(secretKey, sessionSalt, letter) {
  const seed = `${secretKey}:${sessionSalt}:${letter}`;
  const rand = seededRandom(seed);
  const index = Math.floor(rand() * SYMBOL_SET.length);
  return SYMBOL_SET[index];
}

function injectSymbols(password, secretKey, sessionSalt) {
  const seed = `${secretKey}:${sessionSalt}:inject`;
  const rand = seededRandom(seed);

  // Inject 1-3 symbols at seeded positions
  const count = Math.floor(rand() * 3) + 1;
  let result = password.split('');

  for (let i = 0; i < count; i++) {
    const pos = Math.floor(rand() * (result.length + 1));
    const sym = SYMBOL_SET[Math.floor(rand() * SYMBOL_SET.length)];
    result.splice(pos, 0, sym);
  }

  return result.join('');
}

module.exports = { getTransformSymbol, injectSymbols };