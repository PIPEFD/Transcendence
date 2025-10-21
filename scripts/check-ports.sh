#!/bin/bash

# Script para verificar la disponibilidad de puertos antes de iniciar los servicios
# Autor: Equipo Transcendence
# Fecha: Septiembre 2025

# Colores para la salida
GREEN="\033[0;32m"
RED="\033[0;31m"
BLUE="\033[0;34m"
YELLOW="\033[1;33m"
NC="\033[0m"
BOLD="\033[1m"

# Banner
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     VERIFICADOR DE PUERTOS - TRANSCENDENCE     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo -e "Este script comprueba si los puertos necesarios están disponibles\n"

# Cargar variables del archivo .env
if [ -f "../.env" ]; then
    source .env
    echo -e "${GREEN}✓ Archivo .env cargado correctamente${NC}"
else
    echo -e "${RED}✗ No se encontró el archivo .env${NC}"
    exit 1
fi

# Función para verificar si un puerto está en uso
check_port() {
    local port=$1
    local service=$2
    
    # Utiliza lsof para comprobar si el puerto está en uso
    if command -v lsof &> /dev/null; then
        if lsof -i :$port -sTCP:LISTEN &> /dev/null; then
            echo -e "${RED}✗ Puerto $port ($service) - EN USO${NC}"
            return 1
        else
            echo -e "${GREEN}✓ Puerto $port ($service) - DISPONIBLE${NC}"
            return 0
        fi
    # Si lsof no está disponible, usa netstat
    elif command -v netstat &> /dev/null; then
        if netstat -tuln | grep ":$port " &> /dev/null; then
            echo -e "${RED}✗ Puerto $port ($service) - EN USO${NC}"
            return 1
        else
            echo -e "${GREEN}✓ Puerto $port ($service) - DISPONIBLE${NC}"
            return 0
        fi
    # Si ninguna de las anteriores está disponible
    else
        echo -e "${YELLOW}? Puerto $port ($service) - No se pudo verificar (instala lsof o netstat)${NC}"
        return 2
    fi
}

echo -e "\n${BOLD}Verificando puertos para servicios principales:${NC}"
check_port ${NGINX_HTTP_PORT:-9180} "NGINX HTTP"
check_port ${NGINX_HTTPS_PORT:-9443} "NGINX HTTPS"
check_port ${FRONTEND_PORT:-3000} "Frontend"
check_port ${BACKEND_PORT:-9380} "Backend"
check_port ${GAME_WS_PORT:-9999} "Game WebSocket"

echo -e "\n${BOLD}Verificando puertos para monitorización:${NC}"
check_port ${PROMETHEUS_PORT:-9581} "Prometheus"
check_port ${GRAFANA_PORT:-9582} "Grafana"
check_port ${CADVISOR_PORT:-9583} "cAdvisor"
check_port ${SCOPE_PORT:-9584} "Weave Scope"

echo -e "\n${BOLD}Verificando puertos para WAF:${NC}"
check_port ${WAF_HTTP_PORT:-9680} "WAF HTTP"
check_port ${WAF_HTTPS_PORT:-9681} "WAF HTTPS"

echo -e "\n${BOLD}Recomendaciones:${NC}"
echo -e "- Si algún puerto está en uso, modifícalo en el archivo .env"
echo -e "- Después de modificar puertos, ejecuta 'make build && make restart'"
echo -e "- Para ver qué proceso usa un puerto: 'sudo lsof -i :<puerto>'"
echo -e "- Para consultar la documentación de puertos: 'cat docs/ports.md'"

exit 0