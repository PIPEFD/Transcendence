#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

echo "== Phase 0: prepare =="
echo "Repo: $ROOT_DIR"

require() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

require docker
require openssl

if docker compose version >/dev/null 2>&1; then
  : # ok
else
  echo "Docker Compose V2 CLI not found (docker compose)."
  exit 1
fi

# Ensure .env exists (respect ports and profiles defined by user)
if [ ! -f ".env" ]; then
  if [ -f ".env.sample" ]; then
    echo "Creating .env from .env.sample..."
    cp .env.sample .env
  else
    echo "No .env or .env.sample found."
    exit 1
  fi
fi

# Show key ports from .env for visibility
set +e
source ./.env 2>/dev/null
set -e
echo "Using ports:"
echo "  NGINX_HTTP_PORT=${NGINX_HTTP_PORT:-9180}"
echo "  NGINX_HTTPS_PORT=${NGINX_HTTPS_PORT:-9443}"
echo "  PROMETHEUS_PORT=${PROMETHEUS_PORT:-9190} (127.0.0.1)"
echo "  GRAFANA_PORT=${GRAFANA_PORT:-9191} (127.0.0.1)"

# One-time init (idempotent): creates dirs, certs, .env defaults if missing, then brings up stack
echo "Running make init (idempotent)..."
make init

echo "Phase 0 prepare: done."
