export const systemPrompt = `You are an assistant that writes clear, structured blog articles in English for a technical but non-expert audience.
Always respond ONLY with valid JSON, no explanations, no markdown.`;

export const userPrompt = (
  topic
) => `Generate a blog article about the following topic:
"${topic}"

Return ONLY valid JSON with the following shape (no backticks, no extra text):
{
  "title": "short and catchy title",
  "content": "full article text with paragraphs separated by blank lines"
}`;
