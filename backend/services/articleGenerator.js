const { OpenRouter } = require('@openrouter/sdk');
const { systemPrompt, userPrompt } = require('./prompts');

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const MODEL = process.env.LLM_MODEL || 'openai/gpt-oss-120b:free';

async function generateArticle({ topic }) {
  const response = await openrouter.chat.send({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt(topic).trim(),
      },
    ],
  });
}
