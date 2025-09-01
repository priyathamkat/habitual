FROM python:3.13-slim

RUN apt-get update \
    && apt-get install -y curl build-essential \
    && curl -LsSf https://astral.sh/uv/install.sh | sh \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
ENV PATH="/root/.local/bin:${PATH}"

EXPOSE 9009

WORKDIR /app
COPY pyproject.toml .
RUN uv sync --no-dev
COPY . .

ENTRYPOINT ["uv", "run", "uvicorn", "habitual.main:app", "--host", "0.0.0.0", "--port", "9009"]
