function detectPatterns(input) {
  // Matches patterns like "h h", "p p", "k k"
  const patternRegex = /\b([a-zA-Z])\s+\1\b/g;
  const patterns = [];
  let match;
  while ((match = patternRegex.exec(input)) !== null) {
    patterns.push({
      fullMatch: match[0],   // e.g. "h h"
      letter: match[1],      // e.g. "h"
      index: match.index
    });
  }
  return patterns;
}

module.exports = { detectPatterns };