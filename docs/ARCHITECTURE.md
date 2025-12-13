# Architecture

## System overview
The platform exposes a minimal API that creates and serves blog posts, plus a SPA frontend that renders the list and detail views. Articles are persisted to a JSON file mounted into the backend container so they survive restarts. AI content is generated through OpenRouter, and a cron job can create one article per day using rotating topics.

## Components
- **Frontend (React + Vite + Nginx)**: React Router SPA with pages for list (`/articles`) and detail (`/articles/:id`). Talks to the backend via `VITE_API_URL` (defaults to `/api`). Built assets are served by Nginx with a single proxy rule that forwards `/api` to the backend service.
- **Backend (Express)**: `app.js` wires CORS (locked to `FRONTEND_ORIGIN`), Helmet, rate limiting (100/hr per IP on `/api`), JSON parsing, and article routes. Controllers delegate to a file-based repository and to services for generation.
- **Data layer (file-backed)**:
  - `backend/data/articleRepository.js` keeps articles in-memory and syncs them to the JSON file at `ARTICLES_PATH` (path must exist on disk). Articles get UUID ids and ISO timestamps.
  - `backend/data/topics.json` plus `topicRepository` provide a random topic fallback; when empty, `DEFAULT_TOPIC` is used.
- **Generation service**: `services/articleGenerator.js` calls OpenRouter (model: `LLM_MODEL`, endpoint: `OPENROUTER_URL`, key: `OPENROUTER_API_KEY`) with structured prompts (`services/prompts.js`). The response is parsed for JSON and validated for presence before saving.
- **Scheduler**: `services/articleScheduler.js` uses `node-cron` with `ARTICLE_CRON` (default `0 9 * * *`). It only runs when `ENABLE_DAILY_GENERATION=true`.

## Data flow
- **List / read**: `GET /api/articles` returns the in-memory list; `GET /api/articles/:id` validates UUIDs and returns a single entry.
- **Manual create**: `POST /api/articles` validates title/content length (configurable via `TITLE_MAX_LENGTH` and `CONTENT_MAX_LENGTH`), appends to memory, then writes the JSON file. On write failure the last item is dropped.
- **Generate + persist**: `POST /api/articles/generate` validates `topic`, calls the generator, and then writes the file. Errors propagate with HTTP status codes when available from OpenRouter.
- **Scheduled create**: cron picks a random topic, generates, and writes to file. Logs success or failure to stdout for host-level collection.

## Deployment topology
- **Images**: Separate Dockerfiles for frontend and backend. Frontend is a multi-stage build (Node builder → Nginx runtime). Backend is a Node 20 Alpine image.
- **CI/CD**: GitHub Actions workflows use self-hosted CodeBuild runners. Pushes to `backend/**` or `frontend/**` build images and push to ECR repos `production/backend` and `production/frontend` (timestamp tag + `latest`).
- **Delivery**: Manual `workflow_dispatch` deploy jobs copy the relevant Compose file from `deploy/` to `/opt/automated-blog/` on the EC2 host, log into ECR, and run `docker compose up -d`.
- **Runtime (EC2)**: Expected to have an external Docker network `automated-blog`, a persistent folder `/opt/automated-blog/persistence` mounted to `/app/persistence` for the backend, and a secrets file `/opt/automated-blog/.secrets` supplying all backend env vars. The frontend talks to the backend service name `blog-backend` on that network.

## Reliability and safeguards
- Input validation for article fields, UUID checks, and topic trimming guard the API boundary.
- Rate limiting and Helmet reduce basic abuse surface; CORS pins allowed origin.
- File writes are awaited; on failure the in-memory article is removed to avoid drift.
- Scheduler is opt-in via env and logs each attempt; cron expression is configurable for throttling.

## Limitations and follow-ups
- Article storage is a single JSON file; it is not transactional and must sit on a durable volume. Moving to Postgres or SQLite would improve integrity and concurrency.
- Missing structured logging/metrics; add Winston/OTel and ship logs to CloudWatch.
- No health/readiness endpoints; add `/healthz` and `/readyz` for load balancers and deploy checks.
- Deployment Compose files assume the network and directories exist; consider provisioning scripts or IaC to create them automatically.***
