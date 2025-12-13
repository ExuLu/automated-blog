# Frontend (React + Vite)

Single-page app that lists AI-generated articles, shows details, and lets you request a new post. Built with React Router, served by Nginx in production, and proxies `/api` to the backend container.

## Prerequisites
- Node.js 20+ and npm.

## Local development
1) Create an env file:
```
cat > frontend/.env <<'EOF'
VITE_API_URL=http://localhost:3000/api
EOF
```
2) Install deps and run:
```
cd frontend
npm ci
npm run dev
```
Open http://localhost:5173.

## Local Docker (compose)
Run both frontend and backend with the shared compose file:
```
docker compose -f deploy/docker-compose.yml up --build
```
Set your OpenRouter API key in the env file referenced by the compose file (default `deploy/.secrets.example`, or adjust the `env_file` path) so the backend container can generate posts.

## Scripts
- `npm run dev` — Vite dev server.
- `npm run build` — production build.
- `npm run preview` — preview the built bundle.
- `npm run lint` — lint sources.
