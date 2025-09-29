You are Copilot working on the “Transcendence” stack. Produce code and config only after planning. Follow this exact phased plan, respect the ports, profiles, and acceptance checks. Stop if a phase’s checks fail.

CONTEXT & NON-NEGOTIABLES
- Single public edge: hardened NGINX reverse proxy. Everything else is internal.
- Compose profiles: dev, monitoring, elk, edge (cloudflared), debug(optional).
- Arbitrary host ports from .env; bind to 127.0.0.1. Do not hardcode ports inside containers.
- Security: non-root where possible, cap_drop ALL, read_only FS, tmpfs /tmp, no-new-privileges, TLS, HSTS, minimal CSP.
- Observability: Prometheus + exporters + Grafana + Weave Scope.
- Logging: ELK (Elasticsearch, Logstash, Kibana, Filebeat) with normalized NGINX JSON logs and fallbacks.
- Cloudflare Tunnel (edge): publish nginx:443 without host ports.
- Makefile controls profiles and prints effective ports.

.GIVEN .env (use exactly these keys)
ENV=development
APP_DEBUG=true
NGINX_HTTP_PORT=9180
NGINX_HTTPS_PORT=9443
DEV_FRONTEND_PORT=9280
DEV_BACKEND_PORT=9380
DEV_GAME_WS_PORT=9480
FRONTEND_PORT=3000
BACKEND_PORT=9000
GAME_WS_PORT=8081
GAME_WS_CONTAINER_PORT=8080
PROMETHEUS_PORT=9190
GRAFANA_PORT=9191
CADVISOR_PORT=9192
NODE_EXPORTER_PORT=9193
NGINX_EXPORTER_PORT=9194
PHP_FPM_EXPORTER_PORT=9195
ELASTICSEARCH_PORT=9196
KIBANA_PORT=9197
LOGSTASH_BEATS_PORT=5044
LOGSTASH_HTTP_PORT=9198

REPO STRUCTURE (generate)
compose/docker-compose.yml
nginx/{Dockerfile,nginx.conf,conf.d/{proxy.conf,security.conf,status.conf}}
frontend/{Dockerfile,nginx.conf}
backend/{Dockerfile,php-fpm.d/zzz-pool.conf,php/conf.d/{prod.ini,opcache.ini}}
game-ws/{Dockerfile,app/server.js}
monitoring/{prometheus.yml,grafana/provisioning/{datasources/datasource.yml,dashboards/*.json}}
exporters/* (wire official images in compose)
weave/scope.htpasswd (placeholder; real via secrets)
elk/{elasticsearch/**,logstash/**,kibana/**,filebeat/**,ilm/logs-30d-hot.json}
cloudflared/config.yml
scripts/{mkcert.sh,wait-for.sh}
Makefile
README.md

ROUTING (implement in NGINX)
- "/" -> frontend:${FRONTEND_PORT}
- "/api/" -> php-fpm:9000 (FastCGI; correct SCRIPT_FILENAME/PATH_INFO)
- "/ws" -> game-ws:${GAME_WS_PORT} (Upgrade/Connection, WS timeouts)
- Logs: access JSON with fields sufficient for ELK; error warn.
- Security headers: HSTS, CSP minimal, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy same-origin, Permissions-Policy minimal.

COMPOSE RULES
- nginx (core): 
  ports:
    - "127.0.0.1:${NGINX_HTTP_PORT:-0}:80"
    - "127.0.0.1:${NGINX_HTTPS_PORT:-0}:443"
  networks: [edge, internal]
- frontend (profile dev): 
  ports: ["127.0.0.1:${DEV_FRONTEND_PORT:-0}:${FRONTEND_PORT}"]
- game-ws (profile dev): 
  ports: ["127.0.0.1:${DEV_GAME_WS_PORT:-0}:${GAME_WS_PORT}"]
- backend: internal only; expose 9000 to internal; no host ports.
- monitoring (profile monitoring): prometheus, grafana, node-exporter, cadvisor, nginx-exporter, php-fpm-exporter, weave-scope. Ports loopback-only if defined.
- elk (profile elk): elasticsearch, logstash, kibana, filebeat. Loopback ports if defined.
- edge (profile edge): cloudflared; no host ports; route public traffic to nginx:443.
- Networks: internal, monitoring, edge.
- Secrets: read from ./secrets via files; never bake into images.

PHASED PLAN (execute in order; each phase must include code + acceptance checks)
Phase 0 — Base & Profiles
- Compose with profiles; Makefile controlling COMPOSE_PROFILES; `.gitignore` for data/secrets.
- Acceptance:
  - `docker compose -f compose/docker-compose.yml --env-file .env up -d`
  - `make up`, `make up PROFILES="dev"`, `make ports` show bindings.

Phase 1 — NGINX Proxy (edge)
- Apply/replace fix-nginx-final.sh logic; split proxy/security/status; TLS self-signed if missing.
- Acceptance:
  - `nginx -t` inside container OK.
  - `curl -I http://127.0.0.1:${NGINX_HTTP_PORT}/` -> 200.
  - WS handshake via `/ws` -> HTTP/1.1 101.

Phase 2 — WebSocket Service (game-ws)
- Choose a single WS stack (keep Node WS already planned). Implement /healthz, ping/pong, graceful shutdown.
- Acceptance:
  - `curl http://game-ws:${GAME_WS_PORT}/healthz` internal -> 200.
  - Handshake 101 through NGINX `/ws`.

Phase 3 — Secrets
- Use env + files in ./secrets with 0600 perms; never commit. Scripts to generate secrets safely.
- Acceptance:
  - Repo grep finds no secrets.
  - Services read secrets from files at runtime.

Phase 4 — Monitoring
- Wire exporters + Prometheus targets; provision Grafana dashboards.
- Acceptance:
  - `curl -I http://127.0.0.1:${PROMETHEUS_PORT}/-/ready` -> 200.
  - Grafana reachable (loopback) and dashboards display data.

Phase 5 — ELK
- Filebeat autodiscover Docker/container logs; Logstash pipelines (nginx json→enrich + fallback grok; php-fpm grok; app json).
- Acceptance:
  - ES/Kibana up; indices `logs-*` appear after traffic.
  - Kibana dashboards show parsed fields.

Phase 6 — Security & WAF
- Integrate ModSecurity + OWASP CRS; exclusions for legit endpoints.
- Acceptance:
  - Obvious SQLi/XSS payloads blocked; app flows unaffected.
  - Block/allow metrics visible (Prom/ELK).

Phase 7 — Frontend↔Backend Integration
- Frontend uses relative `/api/*`; error handling and UX messages.
- Acceptance:
  - Smoke tests for login/register/chat/game through proxy pass.


Phase 8 — Docs & Hardening
- README with run modes (profiles), ports, diagrams, troubleshooting; maintenance targets (`make cleanup-files`, `make reset`).
- Acceptance:
  - New dev can run stack end-to-end with 3 commands and pass smoke tests.

MAKEFILE (required targets)
- up / down / restart / rebuild / ps / logs / ports / status
- up-dev, up-monitoring, up-elk, up-edge, up-all (wrappers setting PROFILES)
- `ports` uses `docker compose port` to print effective bindings.

TEST SNIPPETS (generate as scripts or README)
- Core: `curl -I http://127.0.0.1:${NGINX_HTTP_PORT}/`
- API: `curl -I http://127.0.0.1:${NGINX_HTTP_PORT}/api/health`
- WS: `curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" http://127.0.0.1:${NGINX_HTTP_PORT}/ws | head -n 1`
- Monitoring: Prom /-/ready; Grafana /login.
- ELK: ES cluster health; `_cat/indices logs-*`.

GITHUB ISSUES (create one per phase)
- For each phase: Title, Description (what & why), Checklist (deliverables), Acceptance (commands & expected results).

ACTION
1) Generate/modify all files per structure above with concise comments answering: ports/exposure, networks, security, observability, cloudflare, make UX.
2) Enforce the phased sequence and include acceptance blocks in README.
3) Output a short “What changed & why” summary at the end.
