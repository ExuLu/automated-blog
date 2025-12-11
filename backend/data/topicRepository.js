const fs = require('fs');
const path = require('path');

let topics = [];
const FILE_PATH = path.join(__dirname, 'topics.json');

const DEFAULT_TOPIC = 'AI role in modern technologies';

try {
  const raw = fs.readFileSync(FILE_PATH, 'utf-8');
  const parsed = JSON.parse(raw);

  if (Array.isArray(parsed)) {
    topics = parsed
      .filter((t) => typeof t === 'string')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  } else {
    console.error(
      'topics.json does not contain an array. Using empty topics list.'
    );
    topics = [];
  }
} catch (err) {
  if (err.code === 'ENOENT') {
    console.log('topics.json not found. Creating an empty file...');
    fs.writeFileSync(FILE_PATH, '[]', 'utf-8');
    topics = [];
  } else {
    console.error('Error reading topics.json:', err);
    topics = [];
  }
}

function getRandomTopic() {
  if (!topics.length) {
    return DEFAULT_TOPIC;
  }

  const index = Math.floor(Math.random() * topics.length);
  return topics[index];
}

module.exports = { getRandomTopic, DEFAULT_TOPIC };
