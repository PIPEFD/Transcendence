.PHONY: up down logs

COMPOSE_FILE := ../compose/docker-compose.yml

up:
	docker-compose -f $(COMPOSE_FILE) up -d --build

down:
	docker-compose -f $(COMPOSE_FILE) down

logs:
	docker-compose -f $(COMPOSE_FILE) logs -f

clean:
	docker-compose -f $(COMPOSE_FILE) down --rmi all --volumes --remove-orphans

setup: ## Configura el proyecto por primera vez (instala dependencias y autoriza Gmail)
	@echo "--- Paso 1: Instalando dependencias de Composer... ---"
	docker-compose -f $(COMPOSE_FILE) run --rm backend composer install
	@echo "\n--- Paso 2: Levantando los contenedores necesarios... ---"
	docker-compose -f $(COMPOSE_FILE) up -d --build backend frontend nginx
	@echo "\n--- Paso 3: Ejecutando el script de configuración de Gmail... ---"
	@echo ">>> A continuación, se te pedirá que copies una URL en tu navegador y pegues un código de vuelta. <<<"
	@sleep 3
	docker-compose -f $(COMPOSE_FILE) exec backend php api/auth/gmail_api/setup_gmail.php
	chmod 666 srcs/public/config/google_token.json