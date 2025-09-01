# Repository Guidelines

## Project Structure & Module Organization
- App Router in `app/` (`layout.tsx`, `page.tsx`, global styles in `app/globals.css`).
- Config: `next.config.ts`, TypeScript via `tsconfig.json`.
- Scripts in `package.json`: `dev`, `build`, `start`.

## Development & Build Commands
- Local:
  - `cd habitual/frontend`
  - Install deps: `npm ci`
  - Dev server: `npm run dev` → http://localhost:3003
- Docker (Compose):
  - Dev: `./run.sh dev` (service `frontend-dev`, hot reload, bind mount)
  - Prod: `./run.sh prod` (service `frontend-prod`, optimized image)

## Coding Style & Naming
- TypeScript + React 19, Next.js 15.
- Prefer function components and hooks; files in `camelCase` or `kebab-case` under `app/` routes.
- Formatting: Prettier is recommended (not enforced); keep imports ordered and avoid default exports for components when possible.

## Testing Guidelines
- Not configured yet. Suggested tools: React Testing Library + Vitest or Playwright for E2E.
- Place tests under `habitual/frontend/__tests__/` or colocation near components.

## Notes
- Node modules are stored in a named volume (`habitual-frontend-node_modules`) in dev to avoid host permission issues.
- For API calls, backend runs at `http://localhost:9009` in dev; consider using environment variables (`NEXT_PUBLIC_API_BASE`).
