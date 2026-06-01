const { analyzePassword, chatWithAI, getSuggestions } = require('../services/aiService');

async function analyze(req, res) {
  try {
    const { originalInput, transformedPassword } = req.body;
    if (!originalInput || !transformedPassword)
      return res.status(400).json({ error: 'Both fields required' });
    const result = await analyzePassword(originalInput, transformedPassword);
    res.json(result);
  } catch (err) {
    console.error('AI analyze error:', err.message);
    res.status(500).json({ error: 'AI analysis failed' });
  }
}

async function chat(req, res) {
  try {
    const { message, context } = req.body;
    if (!message)
      return res.status(400).json({ error: 'Message is required' });
    const reply = await chatWithAI(message, context);
    res.json({ reply });
  } catch (err) {
    console.error('AI chat error:', err.message);
    res.status(500).json({ error: 'AI chat failed' });
  }
}

async function suggest(req, res) {
  try {
    const { input } = req.body;
    if (!input)
      return res.status(400).json({ error: 'Input is required' });
    const result = await getSuggestions(input);
    res.json(result);
  } catch (err) {
    console.error('AI suggest error:', err.message);
    res.status(500).json({ error: 'AI suggestions failed' });
  }
}

module.exports = { analyze, chat, suggest };