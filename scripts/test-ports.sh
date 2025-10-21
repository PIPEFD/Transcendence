#!/bin/bash

# Script para probar todos los puertos de Transcendence
# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   TRANSCENDENCE PORT TESTING SCRIPT     ${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Cargar variables del .env
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Función para probar un puerto
test_port() {
    local name=$1
    local url=$2
    local expected_code=${3:-200}
    
    echo -n "Testing $name ($url)... "
    
    response=$(curl -k -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$url" 2>&1)
    
    if [ "$response" = "$expected_code" ]; then
        echo -e "${GREEN}✓ OK (HTTP $response)${NC}"
        return 0
    elif [ "$response" = "301" ] || [ "$response" = "302" ] || [ "$response" = "307" ]; then
        echo -e "${YELLOW}⟳ REDIRECT (HTTP $response)${NC}"
        return 0
    else
        echo -e "${RED}✗ FAIL (HTTP $response)${NC}"
        return 1
    fi
}

echo -e "${YELLOW}=== MAIN SERVICES ===${NC}"
test_port "NGINX HTTP" "http://localhost:${NGINX_HTTP_PORT:-9180}/" "301"
test_port "NGINX HTTPS" "https://localhost:${NGINX_HTTPS_PORT:-9443}/" "200"
test_port "Backend API Health" "https://localhost:${NGINX_HTTPS_PORT:-9443}/api/health.php" "200"

echo ""
echo -e "${YELLOW}=== MONITORING SERVICES ===${NC}"
test_port "Prometheus" "http://localhost:${PROMETHEUS_PORT:-9090}/" "200"
test_port "Grafana" "http://localhost:${GRAFANA_PORT:-3001}/" "200"
test_port "cAdvisor" "http://localhost:${CADVISOR_PORT:-8080}/containers/" "200"
test_port "Weave Scope" "http://localhost:${SCOPE_PORT:-9584}/" "200"

echo ""
echo -e "${YELLOW}=== INTERNAL SERVICES (via NGINX) ===${NC}"
test_port "Frontend (via NGINX)" "https://localhost:${NGINX_HTTPS_PORT:-9443}/" "200"
test_port "Prometheus (via NGINX)" "https://localhost:${NGINX_HTTPS_PORT:-9443}/prometheus/" "200"
test_port "Grafana (via NGINX)" "https://localhost:${NGINX_HTTPS_PORT:-9443}/grafana/" "200"
test_port "cAdvisor (via NGINX)" "https://localhost:${NGINX_HTTPS_PORT:-9443}/cadvisor/" "200"

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   TESTING COMPLETE                      ${NC}"
echo -e "${BLUE}=========================================${NC}"
