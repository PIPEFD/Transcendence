##### Transcendence — Makefile minimal y efectivo #####
# - Mantiene docker compose como backend de orquestación
# - Targets simples, mensajes claros
# - Rebuild/rollout por servicio (frontend/backend/game/nginx)
# - Scope corre bajo profile "admin"
# - Monitoring bajo profile "monitoring"

SHELL := /bin/bash

# --- Config base ---
COMPOSE        ?= docker compose
COMPOSE_FILE   ?= compose/docker-compose.yml
DC             := $(COMPOSE) -f $(COMPOSE_FILE)

# Perfiles
PROFILE_DEFAULT ?= default
PROFILE_DEV     ?= dev
PROFILE_PROD    ?= prod
PROFILE_MON     ?= monitoring
SCOPE_PROFILE   ?= admin

# Puertos (solo para mensajes)
HTTPS_PORT   ?= 9443
GRAFANA_PORT ?= 9191

# ------------- Ayuda / ASCII ----------------
.PHONY: help
help:
	@echo ""
	@echo "┌─────────────────────── Transcendence • Make ────────────────────────┐"
	@echo "│ Ciclo de vida: up, down, restart, logs, ps                         │"
	@echo "│ Build global: build / rebuild                                      │"
	@echo "│ Build/rollout por servicio:                                        │"
	@echo "│   - frontend: build-frontend / rebuild-frontend / deploy-frontend  │"
	@echo "│   - backend : build-backend  / rebuild-backend  / deploy-backend   │"
	@echo "│   - game    : build-game     / rebuild-game     / deploy-game      │"
	@echo "│   - nginx   : build-nginx    / rebuild-nginx    / deploy-nginx     │"
	@echo "│ Perfiles: up-dev / up-prod / up-monitoring / scope-up              │"
	@echo "└─────────────────────────────────────────────────────────────────────┘"
	@echo "App:     https://localhost:$(HTTPS_PORT)"
	@echo "Scope:   https://localhost:$(HTTPS_PORT)/scope/  (BasicAuth)"
	@echo "Grafana: http://localhost:$(GRAFANA_PORT)"
	@echo ""

# ------------- Ciclo de vida (profile=default) -------------
.PHONY: up down restart logs ps
up:
	@env COMPOSE_PROFILES=$(PROFILE_DEFAULT) $(DC) up -d --build
	@echo "✔ Stack (profile=$(PROFILE_DEFAULT)) arriba → https://localhost:$(HTTPS_PORT)"

down:
	@$(DC) down
	@echo "✔ Stack detenido."

restart:
	@$(DC) down
	@env COMPOSE_PROFILES=$(PROFILE_DEFAULT) $(DC) up -d --build
	@echo "✔ Stack reiniciado (profile=$(PROFILE_DEFAULT))."

logs:
	@$(DC) logs -f

ps:
	@$(DC) ps

# ------------- Perfiles útiles -------------
.PHONY: up-dev up-prod up-monitoring scope-up scope-down scope-logs
up-dev:
	@env COMPOSE_PROFILES=$(PROFILE_DEV) $(DC) up -d --build
	@echo "✔ Stack (dev) arriba."

up-prod:
	@env COMPOSE_PROFILES=$(PROFILE_PROD) $(DC) up -d --build
	@echo "✔ Stack (prod) arriba."

up-monitoring:
	@env COMPOSE_PROFILES=$(PROFILE_MON) $(DC) up -d --build
	@echo "✔ Monitoring arriba. Grafana → http://localhost:$(GRAFANA_PORT)"

scope-up:
	@env COMPOSE_PROFILES=$(SCOPE_PROFILE) $(DC) up -d --build scope
	@echo "✔ Scope arriba (profile=$(SCOPE_PROFILE)). https://localhost:$(HTTPS_PORT)/scope/"

scope-down:
	@env COMPOSE_PROFILES=$(SCOPE_PROFILE) $(DC) rm -sf scope
	@echo "✔ Scope detenido."

scope-logs:
	@env COMPOSE_PROFILES=$(SCOPE_PROFILE) $(DC) logs -f scope

# ------------- Build global -------------
.PHONY: build rebuild
build:
	@env COMPOSE_PROFILES=$(PROFILE_DEFAULT) $(DC) build
	@echo "✔ Build completo (default)."

rebuild:
	@env COMPOSE_PROFILES=$(PROFILE_DEFAULT) $(DC) build --no-cache --pull
	@echo "✔ Rebuild completo (--no-cache --pull)."

# ------------- Build por servicio -------------
.PHONY: build-frontend build-backend build-game build-nginx
build-frontend:
	@env COMPOSE_PROFILES=$(PROFILE_DEFAULT) $(DC) build frontend
	@echo "✔ Imagen 'frontend' construida."

build-backend:
	@env COMPOSE_PROFILES=$(PROFILE_DEFAULT) $(DC) build backend
	@echo "✔ Imagen 'backend' construida."

build-game:
	@env COMPOSE_PROFILES=$(PROFILE_DEFAULT) $(DC) build game-ws
	@echo "✔ Imagen 'game-ws' construida."

build-nginx:
	@env COMPOSE_PROFILES=$(PROFILE_DEFAULT) $(DC) build nginx
	@echo "✔ Imagen 'nginx' construida."

# ------------- Rebuild (sin caché) por servicio -------------
.PHONY: rebuild-frontend rebuild-backend rebuild-game rebuild-nginx
rebuild-frontend:
	@env COMPOSE_PROFILES=$(PROFILE_DEFAULT) $(DC) build --no-cache --pull frontend
	@echo "✔ Rebuild 'frontend' (--no-cache --pull)."

rebuild-backend:
	@env COMPOSE_PROFILES=$(PROFILE_DEFAULT) $(DC) build --no-cache --pull backend
	@echo "✔ Rebuild 'backend' (--no-cache --pull)."

rebuild-game:
	@env COMPOSE_PROFILES=$(PROFILE_DEFAULT) $(DC) build --no-cache --pull game-ws
	@echo "✔ Rebuild 'game-ws' (--no-cache --pull)."

rebuild-nginx:
	@env COMPOSE_PROFILES=$(PROFILE_DEFAULT) $(DC) build --no-cache --pull nginx
	@echo "✔ Rebuild 'nginx' (--no-cache --pull)."

# ------------- Rollout rápido (recrear sólo el servicio) -------------
# up -d --no-deps --build SERVICE : recompila si cambió Dockerfile/context y recrea contenedor sin tocar dependencias
.PHONY: deploy-frontend deploy-backend deploy-game deploy-nginx
deploy-frontend:
	@env COMPOSE_PROFILES=$(PROFILE_DEFAULT) $(DC) up -d --no-deps --build frontend
	@echo "✔ Frontend redeploy (sin tocar otros)."

deploy-backend:
	@env COMPOSE_PROFILES=$(PROFILE_DEFAULT) $(DC) up -d --no-deps --build backend
	@echo "✔ Backend redeploy (sin tocar otros)."

deploy-game:
	@env COMPOSE_PROFILES=$(PROFILE_DEFAULT) $(DC) up -d --no-deps --build game-ws
	@echo "✔ Game WS redeploy (sin tocar otros)."

deploy-nginx:
	@env COMPOSE_PROFILES=$(PROFILE_DEFAULT) $(DC) up -d --no-deps --build nginx
	@echo "✔ Nginx redeploy (sin tocar otros)."

# ------------- Utilidades -------------
.PHONY: ports clean clean-all check-ports
ports:
	@echo "== Ports efectivos =="
	-@$(DC) port nginx 80
	-@$(DC) port nginx 443
	-@$(DC) port grafana 3000
	-@$(DC) port prometheus 9090
	-@$(DC) port cadvisor 8080
	@echo "======================"

check-ports:
	@bash ./scripts/check-ports.sh || true

clean:
	@docker container prune -f >/dev/null 2>&1 || true
	@docker image prune -f     >/dev/null 2>&1 || true
	@echo "✔ Docker prune."

clean-all: clean
	@bash ./scripts/cleanup-files.sh || true
	@bash ./scripts/reset-environment.sh || true
	@echo "✔ Limpieza + reset entorno."

