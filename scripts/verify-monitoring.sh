#!/bin/bash

# Script de verificación completa del stack de monitoreo
# Para usar en la corrección para validar que todo funciona

set -e

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Verificación Completa del Stack de Monitoreo            ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Función para verificar servicio
check_service() {
    local url=$1
    local name=$2
    local expected_code=${3:-200}
    
    echo -ne "${CYAN}Verificando $name...${NC} "
    
    if [ "$name" = "Weave Scope" ]; then
        # Weave Scope requiere autenticación
        response=$(curl -k -s -o /dev/null -w "%{http_code}" "$url" 2>&1 || echo "000")
        if [ "$response" = "401" ] || [ "$response" = "200" ]; then
            echo -e "${GREEN}✓ Disponible${NC} (HTTP $response)"
            return 0
        fi
    else
        response=$(curl -k -s -o /dev/null -w "%{http_code}" "$url" 2>&1 || echo "000")
        if [ "$response" = "$expected_code" ]; then
            echo -e "${GREEN}✓ Disponible${NC} (HTTP $response)"
            return 0
        fi
    fi
    
    echo -e "${RED}✗ No disponible${NC} (HTTP $response)"
    return 1
}

# Función para verificar contenedor
check_container() {
    local container=$1
    local name=$2
    
    echo -ne "${CYAN}Verificando contenedor $name...${NC} "
    
    if docker ps --format "{{.Names}}" | grep -q "^${container}$"; then
        status=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "running")
        if [ "$status" = "healthy" ] || [ "$status" = "running" ]; then
            echo -e "${GREEN}✓ Running ($status)${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠ Running pero estado: $status${NC}"
            return 1
        fi
    else
        echo -e "${RED}✗ No está corriendo${NC}"
        return 1
    fi
}

echo -e "${YELLOW}═══ 1. Verificando Contenedores ═══${NC}"
echo ""

CONTAINERS_OK=0
CONTAINERS_TOTAL=0

# Servicios principales
((CONTAINERS_TOTAL++)); check_container "transcendence-nginx" "Nginx" && ((CONTAINERS_OK++)) || true
((CONTAINERS_TOTAL++)); check_container "transcendence-backend" "Backend" && ((CONTAINERS_OK++)) || true
((CONTAINERS_TOTAL++)); check_container "transcendence-frontend" "Frontend" && ((CONTAINERS_OK++)) || true
((CONTAINERS_TOTAL++)); check_container "transcendence-game-ws" "Game WebSocket" && ((CONTAINERS_OK++)) || true

echo ""
echo -e "${YELLOW}═══ 2. Verificando Stack Prometheus/Grafana ═══${NC}"
echo ""

((CONTAINERS_TOTAL++)); check_container "transcendence-prometheus" "Prometheus" && ((CONTAINERS_OK++)) || true
((CONTAINERS_TOTAL++)); check_container "transcendence-grafana" "Grafana" && ((CONTAINERS_OK++)) || true
((CONTAINERS_TOTAL++)); check_container "transcendence-cadvisor" "cAdvisor" && ((CONTAINERS_OK++)) || true
((CONTAINERS_TOTAL++)); check_container "transcendence-node-exporter" "Node Exporter" && ((CONTAINERS_OK++)) || true
((CONTAINERS_TOTAL++)); check_container "transcendence-nginx-exporter" "Nginx Exporter" && ((CONTAINERS_OK++)) || true
((CONTAINERS_TOTAL++)); check_container "transcendence-php-fpm-exporter" "PHP-FPM Exporter" && ((CONTAINERS_OK++)) || true

echo ""
echo -e "${YELLOW}═══ 3. Verificando Stack ELK ═══${NC}"
echo ""

((CONTAINERS_TOTAL++)); check_container "transcendence-elasticsearch" "Elasticsearch" && ((CONTAINERS_OK++)) || true
((CONTAINERS_TOTAL++)); check_container "transcendence-logstash" "Logstash" && ((CONTAINERS_OK++)) || true
((CONTAINERS_TOTAL++)); check_container "transcendence-kibana" "Kibana" && ((CONTAINERS_OK++)) || true

echo ""
echo -e "${YELLOW}═══ 4. Verificando Weave Scope ═══${NC}"
echo ""

((CONTAINERS_TOTAL++)); check_container "transcendence-scope" "Weave Scope" && ((CONTAINERS_OK++)) || true

echo ""
echo -e "${YELLOW}═══ 5. Verificando URLs de Acceso ═══${NC}"
echo ""

URLS_OK=0
URLS_TOTAL=0

((URLS_TOTAL++)); check_service "https://localhost:9443" "Aplicación Principal" && ((URLS_OK++)) || true
((URLS_TOTAL++)); check_service "http://localhost:9090/-/healthy" "Prometheus" && ((URLS_OK++)) || true
((URLS_TOTAL++)); check_service "http://localhost:3001/api/health" "Grafana" && ((URLS_OK++)) || true
((URLS_TOTAL++)); check_service "http://localhost:9200/_cluster/health" "Elasticsearch" && ((URLS_OK++)) || true
((URLS_TOTAL++)); check_service "http://localhost:5601/api/status" "Kibana" && ((URLS_OK++)) || true
((URLS_TOTAL++)); check_service "http://localhost:9584" "Weave Scope" && ((URLS_OK++)) || true

echo ""
echo -e "${YELLOW}═══ 6. Verificando Exporters (internos) ═══${NC}"
echo ""

# Verificar que exporters responden internamente
echo -ne "${CYAN}Nginx Exporter...${NC} "
if docker exec transcendence-prometheus wget -qO- http://nginx-exporter:9113/metrics 2>/dev/null | head -1 | grep -q "HELP"; then
    echo -e "${GREEN}✓ Funcional${NC}"
else
    echo -e "${RED}✗ No responde${NC}"
fi

echo -ne "${CYAN}PHP-FPM Exporter...${NC} "
if docker exec transcendence-prometheus wget -qO- http://php-fpm-exporter:9253/metrics 2>/dev/null | head -1 | grep -q "HELP"; then
    echo -e "${GREEN}✓ Funcional${NC}"
else
    echo -e "${RED}✗ No responde${NC}"
fi

echo -ne "${CYAN}Node Exporter...${NC} "
if docker exec transcendence-prometheus wget -qO- http://node-exporter:9100/metrics 2>/dev/null | head -1 | grep -q "HELP"; then
    echo -e "${GREEN}✓ Funcional${NC}"
else
    echo -e "${RED}✗ No responde${NC}"
fi

echo -ne "${CYAN}cAdvisor...${NC} "
if docker exec transcendence-prometheus wget -qO- http://cadvisor:8080/metrics 2>/dev/null | head -1 | grep -q "HELP"; then
    echo -e "${GREEN}✓ Funcional${NC}"
else
    echo -e "${RED}✗ No responde${NC}"
fi

echo ""
echo -e "${YELLOW}═══ 7. Uso de Recursos ═══${NC}"
echo ""

echo -e "${CYAN}Resumen de memoria y CPU:${NC}"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | head -15

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Resumen de Verificación                                  ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "  ${CYAN}Contenedores:${NC} ${GREEN}$CONTAINERS_OK${NC}/${CONTAINERS_TOTAL} OK"
echo -e "  ${CYAN}URLs:${NC}         ${GREEN}$URLS_OK${NC}/${URLS_TOTAL} OK"
echo ""

if [ $CONTAINERS_OK -eq $CONTAINERS_TOTAL ] && [ $URLS_OK -eq $URLS_TOTAL ]; then
    echo -e "${GREEN}✓ Todos los servicios están operacionales${NC}"
    echo ""
    echo -e "${YELLOW}Accesos rápidos:${NC}"
    echo -e "  ${BLUE}Aplicación:${NC}    https://localhost:9443"
    echo -e "  ${BLUE}Prometheus:${NC}    http://localhost:9090"
    echo -e "  ${BLUE}Grafana:${NC}       http://localhost:3001"
    echo -e "  ${BLUE}Elasticsearch:${NC} http://localhost:9200"
    echo -e "  ${BLUE}Kibana:${NC}        http://localhost:5601"
    echo -e "  ${BLUE}Weave Scope:${NC}   http://localhost:9584"
    echo ""
    exit 0
else
    echo -e "${YELLOW}⚠ Algunos servicios no están disponibles${NC}"
    echo ""
    echo -e "${CYAN}Para iniciar todos los servicios:${NC}"
    echo -e "  make up-full"
    echo -e "  docker compose -f ./compose/docker-compose.yml --profile elk up -d"
    echo -e "  make scope-up"
    echo ""
    exit 1
fi
