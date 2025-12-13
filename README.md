# Auto-Generated Blog

Full-stack sample for the "Auto-Generated Blog" challenge. The app serves AI-written posts, lets you request a new one on demand, and schedules a daily post. It is split into a React frontend and an Express backend, each shipped as a separate Docker image and deployed to EC2.

## Highlights
- Lists articles and shows details; generates new posts from a topic via OpenRouter.
- Daily cron (opt-in) to auto-create one article using predefined topics.
- File-backed storage so posts survive container restarts when the volume is mounted.
- CI builds images on pushes and deploys to EC2 with Docker Compose.

## Project map
- `frontend/` — React SPA (Nginx runtime). See `frontend/README.md` for setup and commands.
- `backend/` — Express API, OpenRouter client, cron scheduler. See `backend/README.md`.
- `deploy/` — Compose files for EC2 (`backend.docker-compose.yml`, `frontend.docker-compose.yml`) and a local-only compose (`docker-compose.yml`).
- `.github/workflows/` — Image build and deploy pipelines.
- `docs/ARCHITECTURE.md` — Data flow, components, and infra notes.

## Deployment overview
- Images are built and pushed to ECR from GitHub Actions (backend and frontend jobs separately).
- Manual deploy workflows copy the Compose files to the EC2 host and run `docker compose up -d`.
- On the server, `/opt/automated-blog/.secrets` stores only the OpenRouter API key; other env values live in the Compose files. The backend container mounts `/opt/automated-blog/persistence` to keep `articles.json` durable (the file will be created automatically when the folder exists).

## Documentation
- Frontend usage and env: `frontend/README.md`
- Backend usage, API, and scheduling: `backend/README.md`
- Architecture details: `docs/ARCHITECTURE.md`
