# ======================================
# Game WebSocket Makefile
# ======================================

.PHONY: install test clean

# Comandos principales
install: ## Instala dependencias
	composer install

test: ## Ejecuta tests
	./vendor/bin/phpunit

clean: ## Limpia archivos generados
	rm -rf vendor
	rm -rf composer.lock