.PHONY: up down logs

COMPOSE_FILE := ../compose/docker-compose.yml
DOCKER_COMPOSE := docker compose

up:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up -d --build

down:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down

logs:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) logs -f

clean:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down --rmi all --volumes --remove-orphans

setup: ## Configura el proyecto por primera vez (instala dependencias y autoriza Gmail)
	@echo "--- Paso 1: Instalando dependencias de Composer... ---"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) run --rm backend composer install
	@echo "\n--- Paso 2: Levantando los contenedores necesarios... ---"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up -d --build backend frontend nginx
	@echo "\n--- Paso 3: Ejecutando el script de configuración de Gmail... ---"
	@echo ">>> A continuación, se te pedirá que copies una URL en tu navegador y pegues un código de vuelta. <<<"
	@sleep 3
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec backend php public/api/auth/gmail_api/setup_gmail.php
	chmod 666 public/api/auth/gmail_api/google_token.json || true