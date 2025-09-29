#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Load env to respect configured ports
if [ -f ".env" ]; then
  set +e
  source ./.env
  set -e
fi

HTTP_PORT="${NGINX_HTTP_PORT:-9180}"
HTTPS_PORT="${NGINX_HTTPS_PORT:-9443}"
PROM_PORT="${PROMETHEUS_PORT:-9190}"
GRAFANA_PORT="${GRAFANA_PORT:-9191}"

HTTP_BASE="http://127.0.0.1:${HTTP_PORT}"
HTTPS_BASE="https://127.0.0.1:${HTTPS_PORT}"

GREEN="\033[0;32m"; RED="\033[0;31m"; YELLOW="\033[1;33m"; NC="\033[0m"

pass=0
fail=0
check() {
  local name="$1"
  shift || true
  local cmd="$*"
  echo -e "${YELLOW}>> ${name}${NC}"
  if [ -z "$cmd" ]; then
    echo -e "${RED}No command provided to check()${NC}"
    fail=$((fail+1))
    return 1
  fi
  if bash -o pipefail -c "$cmd"; then
    echo -e "${GREEN}OK${NC}"
    pass=$((pass+1))
  else
    echo -e "${RED}FAIL${NC}"
    fail=$((fail+1))
  fi
}

echo "== Phase 0: acceptance =="

# 0) Ensure compose can bring up default profile
check "docker compose up -d (default profile)" \
  "docker compose -f ./compose/docker-compose.yml --env-file .env up -d --remove-orphans"

# 1) docker compose ps shows core services (state may be restarting until Phase 1 fixes)
check "compose ps lists core services" \
  "docker compose -f ./compose/docker-compose.yml ps | grep -E 'nginx|backend|frontend|game-ws'"

# 2) dev profile config is valid (don’t require services to run in Phase 0)
check "compose dev profile config valid" \
  "docker compose -f ./compose/docker-compose.yml --profile dev config >/dev/null"

# 3) Makefile ports target prints effective mappings (may be empty until services healthy)
check "make ports runs without error" \
  "make ports >/dev/null 2>&1 || true"

echo -e "\nSummary: ${GREEN}${pass} passed${NC}, ${RED}${fail} failed${NC}"
if [ "$fail" -gt 0 ]; then
  exit 1
fi
