require('dotenv').config();
const axios = require('axios');

async function askAI(prompt) {
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'openrouter/auto',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'Password K'
      }
    }
  );
  return response.data.choices[0].message.content;
}

async function analyzePassword(originalInput, transformedPassword) {
  const prompt = `You are a cybersecurity expert analyzing a password for strength and security.

Original input: "${originalInput}"
Transformed password: "${transformedPassword}"

Analyze this password and respond ONLY with a valid JSON object in this exact format, no extra text, no markdown, no backticks:
{
  "overallScore": <number 0-100>,
  "strengthLevel": "<Very Weak | Weak | Moderate | Strong | Very Strong>",
  "entropyBits": <estimated entropy as number>,
  "analysis": {
    "length": "<assessment of length>",
    "symbolUsage": "<assessment of symbols>",
    "patternRisk": "<any detected patterns or risks>",
    "predictability": "<how predictable is this>"
  },
  "attackSimulation": {
    "bruteForce": "<estimated time to brute force>",
    "dictionaryAttack": "<vulnerability to dictionary attack>",
    "patternAttack": "<vulnerability to pattern-based attack>"
  },
  "suggestions": [
    "<suggestion 1>",
    "<suggestion 2>",
    "<suggestion 3>"
  ],
  "riskFlags": [
    "<any red flags, empty array if none>"
  ]
}`;

  const raw = await askAI(prompt);
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

async function chatWithAI(userMessage, context = '') {
  const prompt = `You are a cybersecurity assistant for Password K, an intelligent password transformation system.

${context ? `Context: ${context}` : ''}

User question: "${userMessage}"

Answer helpfully and concisely about password security, the Password K system, or cybersecurity best practices. Keep your answer under 150 words. Reply in plain text only, no markdown.`;

  return await askAI(prompt);
}

async function getSuggestions(originalInput) {
  const prompt = `You are a password security expert. A user wants to create a strong password using this input: "${originalInput}"

Suggest 3 improved input variations that would be MORE secure when processed through a password transformation engine. The suggestions should be memorable but harder to predict.

Respond ONLY with valid JSON, no extra text, no markdown, no backticks:
{
  "suggestions": [
    { "input": "<suggestion>", "reason": "<why this is better>" },
    { "input": "<suggestion>", "reason": "<why this is better>" },
    { "input": "<suggestion>", "reason": "<why this is better>" }
  ]
}`;

  const raw = await askAI(prompt);
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

module.exports = { analyzePassword, chatWithAI, getSuggestions };