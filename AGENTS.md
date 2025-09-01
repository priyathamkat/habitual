# Repository Guidelines

## Project Structure & Modules
- `habitual/backend/`: FastAPI service (Python 3.13, uv/uvicorn).
- `habitual/frontend/`: Next.js 15 app (Node 20/24, TypeScript).
- `docker-compose.yml`: Dev and prod services via profiles.
- Scripts: `./run.sh` (start), `./stop.sh` (stop).
  - Sub-guides: see `habitual/backend/AGENTS.md` and `habitual/frontend/AGENTS.md`.

## Build, Run, and Profiles
- Dev (hot reload): `./run.sh dev`
  - Frontend: http://localhost:3003
  - Backend:  http://localhost:9009 (example: `curl :9009/`)
- Prod (optimized): `./run.sh prod`
- Stop all: `./stop.sh`
- Rebuild images: `docker compose --profile "*" build`

## Volumes & Permissions
- Named volumes isolate tool artifacts from the host:
  - `habitual-backend-venv` → container `.venv`
  - `habitual-frontend-node_modules` → container `node_modules`
- This avoids root-owned files on your host bind mounts. If `.venv/` or `node_modules/` exist locally from earlier runs, delete them safely in your workspace before restarting.

## Commit & PR Guidelines
- Use concise, imperative subjects (≤72 chars). Prefer Conventional Commits.
  - Examples: `feat(api): add /habits endpoint`, `chore(frontend): bump next to 15.5.2`.
- PRs: include purpose, linked issues, local test notes, and screenshots/logs if UI changes.
- Validate: `./run.sh prod` should build and expose 3003 (frontend) and 9009 (backend) without errors.

## Security & Config
- Never commit secrets. Prefer environment variables and Compose overrides for local-only config.
- Exposed ports: 3003 (frontend), 9009 (backend). Review before publishing any deployment files.
