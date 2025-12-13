# Backend (Express API)

Express service that stores and serves articles, generates new posts via OpenRouter, and can auto-create one article per day with `node-cron`.

## Features
- REST API to list, fetch, create, and generate articles.
- File-backed persistence (`ARTICLES_PATH`) so content survives restarts.
- Optional daily scheduler controlled by env flags.
- CORS locked to the configured frontend origin and rate limiting on `/api/*`.

## Prerequisites
- Node.js 20+ and npm.
- An OpenRouter API key.

## Local development (without Docker)
1) Create an env file:
```
cat > backend/.env <<'EOF'
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
OPENROUTER_URL=https://openrouter.ai/api/v1/chat/completions
LLM_MODEL=mistralai/devstral-2512:free
OPENROUTER_API_KEY=replace-with-your-key
ARTICLES_PATH=./data/articles.json
ENABLE_DAILY_GENERATION=false
ARTICLE_CRON=0 9 * * *
TITLE_MAX_LENGTH=200
CONTENT_MAX_LENGTH=20000
EOF
```
2) Storage: `ARTICLES_PATH` points to `backend/data/articles.json`, which is created automatically if missing; no extra folder setup is needed locally.
3) Install deps and run (note: `npm run dev` forces `ENABLE_DAILY_GENERATION=false` via the script):
```
cd backend
npm ci
npm run dev
```

## Local Docker (compose)
Use the root-level compose file:
```
docker compose -f deploy/docker-compose.yml up --build
```
The compose file references an `env_file`; create it (default path is `.secrets.example` in `deploy/`, or change the path) with:
```
OPENROUTER_API_KEY=your-key-here
```
All other backend env values are baked into `deploy/docker-compose.yml`. The container writes `articles.json` to the mounted volume `/app/persistence`.

On the EC2 host, `/opt/automated-blog/.secrets` should also store only `OPENROUTER_API_KEY`; the remaining env vars are defined inside the Compose files. Ensure `/opt/automated-blog/persistence` exists so the backend can create `/app/persistence/articles.json` on first write.

## API
- `GET /api/articles` — list all articles.
- `GET /api/articles/:id` — fetch one by UUID.
- `POST /api/articles` — create with `{"title","content"}` (trimmed, length-limited).
- `POST /api/articles/generate` — generate and persist from `{"topic": "text"}` using OpenRouter.

Errors return JSON with `status` and `message`.

## Scheduling
- Enabled only when `ENABLE_DAILY_GENERATION=true`.
- Cron expression: `ARTICLE_CRON` (default `0 9 * * *`).
- Topics come from `backend/data/topics.json`; falls back to the default topic when empty.
