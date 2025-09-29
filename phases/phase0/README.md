# Phase 0 — Bootstrap and Smoke Tests

Goal
- Bring up the default stack via Docker Compose, using ports and profiles configured in .env
- Verify NGINX (HTTP→HTTPS), SPA, API, WS, and monitoring endpoints work via NGINX
- Run the test profile to validate integration tests

Prerequisites
- Docker, Docker Compose v2
- OpenSSL (for self-signed certs on first init)
- .env in repo root (copy from .env.sample if missing)

How to run
1) Prepare environment (idempotent):
   - bash ./scripts/phase0-prepare.sh

2) Run acceptance checks:
   - bash ./scripts/phase0-acceptance.sh

What this does (respecting .env ports and profiles)
- Uses default profile to start core services (see compose/docker-compose.yml)
- Verifies:
  - HTTP ($NGINX_HTTP_PORT) → HTTPS ($NGINX_HTTPS_PORT) redirect
  - SPA via https://localhost:$NGINX_HTTPS_PORT/
  - API health endpoints via https://localhost:$NGINX_HTTPS_PORT/api/...
  - WebSocket availability via tester profile
  - Monitoring via NGINX subpaths (/prometheus/, /grafana/), while direct ports bind to 127.0.0.1:$PROMETHEUS_PORT, $GRAFANA_PORT
- Executes tester service (profile "test") and fails if tests fail

Acceptance criteria
- NGINX is healthy; HTTP→HTTPS returns 301/308, SPA returns 200
- API responds with 200/401/403/404 (depending on auth), no 5xx
- WebSocket test passes (handshake and basic ping via tester)
- Monitoring accessible via NGINX subpaths; direct ports bind on 127.0.0.1 only
- Tester profile completes with exit code 0

Notes
- Port values come from .env (see docs/ports.md)
- Quick links (open in a browser that trusts your local certs):
  - https://localhost:${NGINX_HTTPS_PORT:-9443}
  - https://localhost:${NGINX_HTTPS_PORT:-9443}/prometheus/
  - https://localhost:${NGINX_HTTPS_PORT:-9443}/grafana/
