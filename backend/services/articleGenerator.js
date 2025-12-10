const dotenv = require('dotenv');
const { systemPrompt, userPrompt } = require('./prompts');
dotenv.config();

const MODEL = process.env.LLM_MODEL;
const API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = process.env.OPENROUTER_URL;

if (!API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not set');
}
if (!MODEL) {
  throw new Error('LLM_MODEL is not set');
}
if (!OPENROUTER_URL) {
  throw new Error('OPENROUTER_URL is not set');
}

async function generateArticle(topic) {
  const body = {
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: userPrompt(topic).trim(),
      },
    ],
  };

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.error?.message ||
      `OpenRouter request failed with status ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }

  const rawContent = data.choices?.[0]?.message?.content;

  if (!rawContent) {
    throw new Error('LLM returned empty content');
  }

  let article;
  try {
    article = JSON.parse(rawContent);
  } catch (err) {
    console.log('Raw model content:', rawContent);
    throw new Error('Failed to parse article JSON from LLM');
  }

  return article;
}

module.exports = generateArticle;
