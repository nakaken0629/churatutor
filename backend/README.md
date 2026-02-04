# ChuraTutor Backend

FastAPI backend for ChuraTutor application.

## Prerequisites

- Python 3.11+
- [uv](https://docs.astral.sh/uv/) package manager

## Setup

```bash
cd backend

# Install uv (if not installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create virtual environment and install dependencies
uv sync
```

## Run

```bash
# Development server with hot reload
uv run uvicorn app.main:app --reload

# Or activate venv first
source .venv/bin/activate
uvicorn app.main:app --reload
```

API will be available at http://localhost:8000

## Development

```bash
# Install with dev dependencies
uv sync --dev

# Run tests
uv run pytest

# Run linter
uv run ruff check .

# Format code
uv run ruff format .
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
