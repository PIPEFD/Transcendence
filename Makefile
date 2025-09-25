# ======================================
# Transcendence - Makefile Simplificado
# ======================================

# Variables de configuración
COMPOSE      := docker compose -f ./compose/docker-compose.yml
COMPOSE_WAF  := docker compose -f ./compose/docker-compose.yml --profile waf
COMPOSE_TEST := docker compose -f ./compose/docker-compose.yml --profile test

# Rutas importantes
CONFIG_DIR   := ./config
SSL_DIR      := $(CONFIG_DIR)/ssl
SCRIPTS_DIR  := ./scripts
LOGS_DIR     := ./logs

# Colores para output
RED    := \033[0;31m
GREEN  := \033[0;32m
YELLOW := \033[1;33m
BLUE   := \033[0;34m
CYAN   := \033[0;36m
WHITE  := \033[1;37m
RESET  := \033[0m

# Regla por defecto
.DEFAULT_GOAL := help

# Mensaje de ayuda
help:
	@echo ""
	@echo -e "$(BLUE)╔════════════════════════════════════════════╗$(RESET)"
	@echo -e "$(BLUE)║      TRANSCENDENCE - PANEL DE CONTROL      ║$(RESET)"
	@echo -e "$(BLUE)╚════════════════════════════════════════════╝$(RESET)"
	@echo ""
	@echo -e "$(CYAN)COMANDOS BÁSICOS:$(RESET)"
	@echo -e "  $(GREEN)make$(RESET)              Muestra esta ayuda"
	@echo -e "  $(GREEN)make init$(RESET)         Inicializa el entorno completo (primera vez)"
	@echo -e "  $(GREEN)make up$(RESET)           Inicia todos los servicios"
	@echo -e "  $(GREEN)make down$(RESET)         Detiene todos los servicios"
	@echo -e "  $(GREEN)make restart$(RESET)      Reinicia todos los servicios"
	@echo -e "  $(GREEN)make logs$(RESET)         Muestra los logs de todos los servicios"
	@echo ""
	@echo -e "$(CYAN)SERVICIOS INDIVIDUALES:$(RESET)"
	@echo -e "  $(GREEN)make up-frontend$(RESET)  Inicia solo el frontend"
	@echo -e "  $(GREEN)make up-backend$(RESET)   Inicia solo el backend"
	@echo -e "  $(GREEN)make up-game$(RESET)      Inicia solo el servicio de juego"
	@echo -e "  $(GREEN)make up-nginx$(RESET)     Inicia solo el servidor nginx"
	@echo ""
	@echo -e "$(CYAN)FUNCIONES DE DESARROLLO:$(RESET)"
	@echo -e "  $(GREEN)make build$(RESET)        Construye todos los servicios"
	@echo -e "  $(GREEN)make test$(RESET)         Ejecuta pruebas automáticas"
	@echo -e "  $(GREEN)make up-waf$(RESET)       Inicia el Web Application Firewall"
	@echo ""
	@echo -e "$(CYAN)MANTENIMIENTO:$(RESET)"
	@echo -e "  $(GREEN)make clean$(RESET)        Elimina contenedores e imágenes sin usar"
	@echo -e "  $(GREEN)make reset$(RESET)        Reinicia el entorno a estado inicial (¡cuidado!)"
	@echo ""

# Inicialización del entorno completo
init: create-dirs create-certs create-env up
	@echo -e "$(GREEN)✓ Entorno inicializado y servicios iniciados$(RESET)"

# Creación de directorios
create-dirs:
	@echo -e "$(YELLOW)Creando estructura de directorios...$(RESET)"
	@mkdir -p $(CONFIG_DIR)/ssl
	@mkdir -p $(CONFIG_DIR)/auth
	@mkdir -p $(CONFIG_DIR)/cloudflare/certs
	@mkdir -p $(LOGS_DIR)/nginx
	@mkdir -p ./backend/srcs/database
	@mkdir -p ./backend/srcs/public/api/uploads
	@mkdir -p ./waf/logs

# Creación de certificados SSL si no existen
create-certs: create-dirs
	@echo -e "$(YELLOW)Verificando certificados SSL...$(RESET)"
	@if [ ! -f "$(SSL_DIR)/fullchain.pem" ] || [ ! -f "$(SSL_DIR)/privkey.pem" ]; then \
		echo -e "$(YELLOW)Generando nuevos certificados SSL...$(RESET)"; \
		openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
			-keyout $(SSL_DIR)/privkey.pem \
			-out $(SSL_DIR)/fullchain.pem \
			-subj "/C=ES/ST=Madrid/L=Madrid/O=42/OU=dev/CN=localhost"; \
		if [ ! -f "$(SSL_DIR)/dhparam.pem" ]; then \
			echo -e "$(YELLOW)Generando parámetros DH...$(RESET)"; \
			openssl dhparam -out $(SSL_DIR)/dhparam.pem 2048; \
		fi; \
		cp $(SSL_DIR)/fullchain.pem $(CONFIG_DIR)/cloudflare/certs/; \
		cp $(SSL_DIR)/privkey.pem $(CONFIG_DIR)/cloudflare/certs/; \
		cp $(SSL_DIR)/dhparam.pem $(CONFIG_DIR)/cloudflare/certs/; \
		chmod 600 $(SSL_DIR)/privkey.pem; \
		chmod 644 $(SSL_DIR)/fullchain.pem $(SSL_DIR)/dhparam.pem; \
	else \
		echo -e "$(GREEN)Certificados SSL ya existen$(RESET)"; \
	fi

# Crear/verificar archivo .env
create-env:
	@echo -e "$(YELLOW)Verificando archivo .env...$(RESET)"
	@if [ ! -f ".env" ]; then \
		echo -e "$(YELLOW)Creando archivo .env con valores predeterminados...$(RESET)"; \
		touch .env; \
		echo "# Transcendence - Configuración Principal" > .env; \
		echo "APP_ENV=development" >> .env; \
		echo "APP_DEBUG=true" >> .env; \
		echo "APP_URL=https://localhost" >> .env; \
		echo "APP_KEY=base64:$$(openssl rand -base64 32)" >> .env; \
		echo "JWT_SECRET=base64:$$(openssl rand -base64 64)" >> .env; \
		echo "JWT_EXPIRATION=86400" >> .env; \
		echo "DB_CONNECTION=sqlite" >> .env; \
		echo "DB_DATABASE=/var/www/database/database.sqlite" >> .env; \
		echo "FRONTEND_PORT=3000" >> .env; \
		echo "BACKEND_PORT=9000" >> .env; \
		echo "GAME_WS_PORT=8081" >> .env; \
		echo "SSL_CERT=/config/ssl/fullchain.pem" >> .env; \
		echo "SSL_KEY=/config/ssl/privkey.pem" >> .env; \
		echo "SSL_DHPARAM=/config/ssl/dhparam.pem" >> .env; \
	else \
		echo -e "$(GREEN)Archivo .env ya existe$(RESET)"; \
	fi

# Iniciar todos los servicios
up:
	@echo -e "$(YELLOW)Iniciando servicios...$(RESET)"
	@$(COMPOSE) up -d
	@echo -e "$(GREEN)✓ Servicios iniciados correctamente$(RESET)"
	@echo -e "$(BLUE)Accede a la aplicación en: $(WHITE)https://localhost$(RESET)"

# Iniciar servicios con WAF
up-waf:
	@echo -e "$(YELLOW)Iniciando servicios con WAF...$(RESET)"
	@$(COMPOSE_WAF) up -d
	@echo -e "$(GREEN)✓ Servicios con WAF iniciados correctamente$(RESET)"
	@echo -e "$(BLUE)WAF disponible en: $(WHITE)http://localhost:8000$(RESET) y $(WHITE)https://localhost:8443$(RESET)"

# Iniciar servicios específicos
up-frontend:
	@echo -e "$(YELLOW)Iniciando frontend...$(RESET)"
	@$(COMPOSE) up -d frontend
	@echo -e "$(GREEN)✓ Frontend disponible en: $(WHITE)http://localhost:${FRONTEND_PORT:-3000}$(RESET)"

up-backend:
	@echo -e "$(YELLOW)Iniciando backend...$(RESET)"
	@$(COMPOSE) up -d backend
	@echo -e "$(GREEN)✓ Backend iniciado en puerto: ${BACKEND_PORT:-9000}$(RESET)"

up-game:
	@echo -e "$(YELLOW)Iniciando servicio de juego...$(RESET)"
	@$(COMPOSE) up -d game-ws
	@echo -e "$(GREEN)✓ Servidor de juego disponible en puerto: ${GAME_WS_PORT:-8081}$(RESET)"

up-nginx:
	@echo -e "$(YELLOW)Iniciando servidor nginx...$(RESET)"
	@$(COMPOSE) up -d nginx
	@echo -e "$(GREEN)✓ Nginx disponible en: $(WHITE)https://localhost$(RESET)"

# Detener todos los servicios
down:
	@echo -e "$(YELLOW)Deteniendo servicios...$(RESET)"
	@$(COMPOSE) down
	@echo -e "$(GREEN)✓ Servicios detenidos$(RESET)"

# Construir todos los servicios
build:
	@echo -e "$(YELLOW)Construyendo servicios...$(RESET)"
	@$(COMPOSE) build
	@echo -e "$(GREEN)✓ Servicios construidos correctamente$(RESET)"

# Reconstruir servicios
rebuild:
	@echo -e "$(YELLOW)Reconstruyendo servicios...$(RESET)"
	@$(COMPOSE) build --no-cache
	@echo -e "$(GREEN)✓ Servicios reconstruidos correctamente$(RESET)"

# Reiniciar todos los servicios
restart: down up
	@echo -e "$(GREEN)✓ Servicios reiniciados$(RESET)"

# Ver logs de todos los servicios
logs:
	@$(COMPOSE) logs -f

# Ver estado de los servicios
ps:
	@$(COMPOSE) ps

# Ejecutar pruebas
test:
	@echo -e "$(YELLOW)Ejecutando tests...$(RESET)"
	@$(SCRIPTS_DIR)/run-tests.sh --all

# Ejecutar pruebas unitarias
test-unit:
	@echo -e "$(YELLOW)Ejecutando pruebas unitarias...$(RESET)"
	@$(SCRIPTS_DIR)/run-tests.sh --unit

# Ejecutar pruebas de integración
test-integration:
	@echo -e "$(YELLOW)Ejecutando pruebas de integración...$(RESET)"
	@$(SCRIPTS_DIR)/run-tests.sh --integration

# Limpieza de contenedores e imágenes sin usar
clean:
	@echo -e "$(YELLOW)Limpiando recursos Docker sin usar...$(RESET)"
	@docker container prune -f
	@docker image prune -f
	@echo -e "$(GREEN)✓ Limpieza completada$(RESET)"

# Reinicio completo del entorno (peligroso)
reset: down
	@echo -e "$(RED)¡ADVERTENCIA! Se eliminarán todos los datos y configuraciones.$(RESET)"
	@read -p "¿Está seguro de que desea continuar? [s/N]: " confirm; \
	if [ "$$confirm" = "s" ] || [ "$$confirm" = "S" ]; then \
		echo -e "$(YELLOW)Eliminando configuración existente...$(RESET)"; \
		rm -rf $(SSL_DIR)/*.pem; \
		rm -rf $(CONFIG_DIR)/cloudflare/certs; \
		rm -rf $(LOGS_DIR)/*; \
		rm -rf ./backend/srcs/database/*.sqlite; \
		echo -e "$(YELLOW)Eliminando volúmenes Docker...$(RESET)"; \
		docker volume prune -f; \
		echo -e "$(GREEN)✓ Entorno restablecido. Utilice 'make init' para inicializarlo nuevamente.$(RESET)"; \
	else \
		echo -e "$(BLUE)Operación cancelada.$(RESET)"; \
	fi

# Marca los objetivos que no son archivos
.PHONY: help init create-dirs create-certs create-env up up-waf up-frontend up-backend up-game up-nginx down build rebuild restart logs ps test test-unit test-integration clean reset