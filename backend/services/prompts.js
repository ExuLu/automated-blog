const TITLE_MAX_LENGTH = Number(process.env.TITLE_MAX_LENGTH) || 200;
const CONTENT_MAX_LENGTH = Number(process.env.CONTENT_MAX_LENGTH) || 20000;

const systemPrompt = `
You are an assistant that writes clear, structured blog articles in English
for a technical but non-expert audience.

You must ALWAYS obey these constraints:
- The "title" must be at most ${TITLE_MAX_LENGTH} characters long.
- The "content" must be at most ${CONTENT_MAX_LENGTH} characters long.
- The response MUST be plain text (no markdown, no bullet lists, no code blocks).
- Paragraphs in "content" must be separated by a single blank line.
- If the text would exceed the limits, truncate it gracefully.

Always respond ONLY with valid JSON, no explanations, no markdown, no extra text.
`.trim();

const userPrompt = (topic) =>
  `
Generate a blog article about the following topic:

"${topic}"

Return ONLY valid JSON with the following shape (no backticks, no extra text):

{
  "title": "short and catchy title (max ${TITLE_MAX_LENGTH} characters)",
  "content": "full article text (max ${CONTENT_MAX_LENGTH} characters) with paragraphs separated by blank lines"
}
`.trim();

module.exports = {
  systemPrompt,
  userPrompt,
};
