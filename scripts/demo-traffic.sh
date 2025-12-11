#!/bin/bash

# Script para generar tráfico de prueba para demostración en la corrección
# Este script hace requests a la aplicación para generar métricas visibles

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Generador de Tráfico para Demostración de Monitoreo     ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

BASE_URL="https://localhost:9443"
REQUESTS_PER_ENDPOINT=20
DELAY=0.2  # Segundos entre requests

# Verificar que los servicios estén corriendo
echo -e "${YELLOW}Verificando servicios...${NC}"
if ! curl -k -s "$BASE_URL" > /dev/null; then
    echo -e "${YELLOW}⚠ La aplicación no está disponible en $BASE_URL${NC}"
    echo -e "${YELLOW}Ejecuta: make up-full${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Servicios disponibles${NC}"
echo ""

# Función para hacer requests
make_requests() {
    local endpoint=$1
    local description=$2
    local count=$3
    
    echo -e "${BLUE}➜ $description${NC}"
    for i in $(seq 1 $count); do
        curl -k -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint" 2>&1 | \
            xargs -I {} echo -ne "${GREEN}.${NC}"
        sleep $DELAY
    done
    echo ""
}

echo -e "${YELLOW}Generando tráfico HTTP...${NC}"
echo ""

# Página principal
make_requests "/" "Página principal (HTML)" $REQUESTS_PER_ENDPOINT

# Assets estáticos
make_requests "/assets/logo.svg" "Logo SVG" 10
make_requests "/assets/css/main.css" "CSS principal" 10
make_requests "/assets/js/app.js" "JavaScript principal" 10

# API endpoints (generarán algunos 404, lo cual es bueno para ver errores)
make_requests "/api/users" "API - Listar usuarios" 15
make_requests "/api/health" "API - Health check" 15
make_requests "/api/stats" "API - Estadísticas" 10

# Generar algunos errores intencionalmente
echo -e "${YELLOW}Generando algunos errores (404/500) para variedad...${NC}"
make_requests "/nonexistent" "Páginas inexistentes (404)" 5
make_requests "/api/invalid" "Endpoints inválidos" 5
echo ""

# WebSocket test (si existe)
echo -e "${BLUE}➜ Testeando WebSocket${NC}"
for i in {1..5}; do
    wscat -c "wss://localhost:9443/ws" -x '{"type":"ping"}' --no-check 2>/dev/null || true
    echo -ne "${GREEN}.${NC}"
    sleep 0.5
done
echo ""
echo ""

echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Tráfico generado exitosamente!                          ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Ahora puedes ver las métricas en:${NC}"
echo -e "  ${BLUE}Prometheus:${NC} http://localhost:9090"
echo -e "  ${BLUE}Grafana:${NC}    http://localhost:3001"
echo -e "  ${BLUE}Kibana:${NC}     http://localhost:5601"
echo -e "  ${BLUE}Weave Scope:${NC} http://localhost:9584"
echo ""
echo -e "${YELLOW}Queries útiles en Prometheus:${NC}"
echo -e "  ${GREEN}rate(nginx_http_requests_total[1m])${NC}"
echo -e "  ${GREEN}nginx_connections_active${NC}"
echo -e "  ${GREEN}container_memory_usage_bytes{name=~\"transcendence.*\"}${NC}"
echo ""
