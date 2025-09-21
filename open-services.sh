#!/bin/bash

# Script para abrir todos los servicios de Transcendence
# Uso: ./open-services.sh [chec    # cAdvisor
    show_service "cAdvisor" "Métricas de contenedores Docker" "http://localhost:8080/cadvisor/" "https://localhost/cadvisor/" "$debug"debug]

# Colores para la terminal
GREEN="\033[0;32m"
RED="\033[0;31m"
BLUE="\033[0;34m"
YELLOW="\033[1;33m"
NC="\033[0m" # No Color
BOLD="\033[1m"
UNDERLINE="\033[4m"

# Función para imprimir banner
print_banner() {
    echo -e "\n┌─────────────────────────────────────────────┐"
    echo -e "│${BOLD}                                             ${NC}│"
    echo -e "│${BOLD}       TRANSCENDENCE MONITORING PANEL        ${NC}│"
    echo -e "│${BOLD}                                             ${NC}│"
    echo -e "└─────────────────────────────────────────────┘\n\n"
}

print_banner

# Función para verificar si un servicio está disponible
check_service() {
    local url=$1
    local debug=$2
    
    if [ "$debug" = "true" ]; then
        echo -e "\n${YELLOW}DEBUG: Verificando URL: $url${NC}"
        local response=$(curl -s -k -w "\n%{http_code}" $url)
        local body=$(echo "$response" | head -n -1)
        local status_code=$(echo "$response" | tail -n 1)
        echo -e "${YELLOW}DEBUG: Código de respuesta: $status_code${NC}"
        echo -e "${YELLOW}DEBUG: Cuerpo de la respuesta: $body${NC}\n"
        
        if [[ $status_code == "200" || $status_code == "302" || $status_code == "301" || $status_code == "401" || $status_code == "403" || $status_code == "307" ]]; then
            return 0  # Servicio disponible
        else
            return 1  # Servicio no disponible
        fi
    else
        local response=$(curl -s -k -o /dev/null -w "%{http_code}" $url)
        
        if [[ $response == "200" || $response == "302" || $response == "301" || $response == "401" || $response == "403" || $response == "307" ]]; then
            return 0  # Servicio disponible
        else
            return 1  # Servicio no disponible
        fi
    fi
}

# Función para mostrar un servicio
show_service() {
    local name=$1
    local description=$2
    local direct_url=$3
    local proxy_url=${4:-""}
    local debug=${5:-"false"}

    echo -e "┌─── ${BOLD}$name${NC} ───────────────────────────────────"
    echo -e "│ $description"

    if check_service "$direct_url" "$debug"; then
        echo -e "│ ${GREEN}● DISPONIBLE${NC}"
        echo -e "│ ${BLUE}▶ Puerto directo: $direct_url${NC}"
        if [ ! -z "$proxy_url" ]; then
            echo -e "│ ${BLUE}▶ Proxy HTTPS: $proxy_url${NC}"
        fi
    else
        echo -e "│ ${RED}✕ NO DISPONIBLE${NC}"
        echo -e "│ ${BLUE}▶ URL: $direct_url${NC}"
    fi
    echo -e "└───────────────────────────────────────────────\n"
}

# Función para abrir una URL en el navegador
open_url() {
    "$BROWSER" "$1" &>/dev/null &
}

# Comprobación de servicios
check_services() {
    local debug=${1:-"false"}
    echo "Verificando todos los servicios..."
    echo ""
    
    # Frontend
    show_service "Frontend" "Interfaz principal de la aplicación" "http://localhost:3000" "https://localhost/" "$debug"
    
    # Backend API
    show_service "Backend API" "API para la aplicación Transcendence" "https://localhost/api/health.php" "" "$debug"
    
    # Prometheus
    show_service "Prometheus" "Sistema de monitorización y alertas" "http://localhost:9090" "https://localhost/prometheus/" "$debug"
    
    # Grafana
    show_service "Grafana" "Visualización de métricas y análisis" "http://localhost:3001" "https://localhost/grafana" "$debug"
    
    # cAdvisor
    show_service "cAdvisor" "Métricas de contenedores Docker" "http://localhost:8080/cadvisor/" "https://localhost/cadvisor/" "$debug"
    
    # Websocket
    show_service "WebSocket Game" "Servidor WebSocket para el juego" "http://localhost:8081" "" "$debug"
}

# Comprobación de argumentos
if [ "$1" = "check" ]; then
    check_services "false"
    exit 0
fi

if [ "$1" = "debug" ]; then
    check_services "true"
    exit 0
fi

# Menú principal
echo "SERVICIOS DISPONIBLES:"
echo "1) Frontend - Interfaz principal (Puerto 3000)"
echo "2) Backend API - Endpoints de la API"
echo "3) Prometheus - Monitorización (Puerto 9090)"
echo "4) Grafana - Dashboards (Puerto 3001)"
echo "5) cAdvisor - Métricas de contenedores (Puerto 8080)"
echo "6) Dashboard de Monitoreo"
echo "7) Comprobar y abrir todos los servicios"
echo "0) Salir"
echo ""
read -p "Selecciona una opción (0-7): " option

case $option in
    1)
        open_url "http://localhost:3000"
        ;;
    2)
        open_url "https://localhost/api/health.php"
        ;;
    3)
        open_url "http://localhost:9090"
        ;;
    4)
        open_url "http://localhost:3001"
        ;;
    5)
        open_url "http://localhost:8080/cadvisor/"
        ;;
    6)
        open_url "https://localhost/dashboard.html"
        ;;
    7)
        check_services
        echo "¿Deseas abrir todos los servicios disponibles? (s/n): "
        read -p "" confirm
        if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
            open_url "http://localhost:3000"
            open_url "https://localhost/api/health.php"
            open_url "http://localhost:9090"
            open_url "http://localhost:3001"
            open_url "http://localhost:8080/cadvisor/"
            open_url "https://localhost/dashboard.html"
        fi
        ;;
    0)
        echo "Saliendo..."
        exit 0
        ;;
    *)
        echo "Opción inválida"
        exit 1
        ;;
esac

echo "Servicio abierto en el navegador."
