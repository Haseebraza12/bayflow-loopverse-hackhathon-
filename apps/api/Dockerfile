# BayFlow API image (spec 07): Railway and Docker Compose.
# Official uv multi-stage pattern: dependencies in a cached layer, the project after it; the
# runtime image has no uv, uses the same base image as the builder and runs as a non-root user.

# ---- builder: resolve and install dependencies with uv ----
FROM python:3.12-slim-trixie AS builder
COPY --from=ghcr.io/astral-sh/uv:0.12.24 /uv /uvx /bin/
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_NO_DEV=1 \
    UV_PYTHON_DOWNLOADS=0
WORKDIR /app
# 1) dependencies only: this layer is reused while pyproject.toml / uv.lock are unchanged
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-install-project
# 2) application code
COPY . .
RUN uv sync --locked

# ---- runtime: same base image (the venv's interpreter path must match), no uv, non-root ----
FROM python:3.12-slim-trixie AS runtime
RUN groupadd --system --gid 999 nonroot \
 && useradd --system --gid 999 --uid 999 --create-home nonroot
COPY --from=builder --chown=nonroot:nonroot /app /app
ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONUNBUFFERED=1
WORKDIR /app
USER nonroot
EXPOSE 4000
# ONE worker on purpose: the WebSocket hub and the rate-limit counters live in process memory (D14).
# `sh -c` expands ${PORT} (Railway injects it); `exec` hands signals to uvicorn.
# --no-access-log: the API writes its own JSON access line; --no-server-header: spec 04 Tier 1.
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-4000} --workers 1 --proxy-headers --forwarded-allow-ips='*' --no-access-log --no-server-header --timeout-graceful-shutdown 10"]
