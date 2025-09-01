# Repository Guidelines

## Project Structure & Module Organization
- `pyproject.toml`: Python 3.13 project metadata and dependencies (FastAPI).
- `/habitual/`: Python package. Entrypoint: `habitual/main.py` (`app = FastAPI()`).

## Build, Test, and Development Commands
- Local without Docker:
  - `cd habitual/backend`
  - Install deps: `uv sync`
  - Run API: `uv run uvicorn habitual.main:app --host 0.0.0.0 --port 9009 --reload`

## Coding Style & Naming Conventions
- Python: follow PEP 8, 4-space indentation, type hints where practical.
- Naming: modules/files `snake_case`, classes `PascalCase`, functions/vars `snake_case`.
- Formatting/linting: 
  - `uv run ruff check habitual/backend`

## Testing Guidelines
- Framework: Use `pytest` with FastAPI `TestClient`.
- Layout: `habitual/backend/tests/`, files named `test_*.py`.
- Run (local): `uv run pytest -q`.
- Aim for clear unit tests around route handlers and simple integration tests for `/`.