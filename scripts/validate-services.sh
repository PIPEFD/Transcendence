#!/bin/bash

# Script de validación completa de servicios Transcendence
# Prueba cada endpoint con curl y reporta el estado

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   VALIDACIÓN COMPLETA DE SERVICIOS - TRANSCENDENCE    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Función para validar endpoint
validate_endpoint() {
    local name="$1"
    local url="$2"
    local expected_code="${3:-200}"
    local description="$4"
    
    echo -e "${CYAN}┌─────────────────────────────────────────────────────${NC}"
    echo -e "${CYAN}│ Servicio: ${WHITE}$name${NC}"
    echo -e "${CYAN}│ Endpoint: ${WHITE}$url${NC}"
    echo -e "${CYAN}│ Descripción: ${description}${NC}"
    echo -e "${CYAN}└─────────────────────────────────────────────────────${NC}"
    
    # Realizar petición
    response=$(curl -sk -o /dev/null -w "%{http_code}|%{time_total}|%{size_download}" --connect-timeout 5 --max-time 10 "$url" 2>&1)
    
    # Extraer datos
    http_code=$(echo "$response" | cut -d'|' -f1)
    time_total=$(echo "$response" | cut -d'|' -f2)
    size=$(echo "$response" | cut -d'|' -f3)
    
    # Validar respuesta
    if [[ "$http_code" == "$expected_code" ]] || [[ "$http_code" == "301" ]] || [[ "$http_code" == "302" ]]; then
        echo -e "   ${GREEN}✓ Estado: HTTP $http_code${NC}"
        echo -e "   ${GREEN}✓ Tiempo: ${time_total}s${NC}"
        echo -e "   ${GREEN}✓ Tamaño: ${size} bytes${NC}"
        echo -e "   ${GREEN}✓ ÉXITO${NC}"
        return 0
    else
        echo -e "   ${RED}✗ Estado: HTTP $http_code${NC}"
        echo -e "   ${RED}✗ Esperado: HTTP $expected_code${NC}"
        echo -e "   ${RED}✗ FALLO${NC}"
        return 1
    fi
    echo ""
}

# Contadores
total=0
success=0
failed=0

# Función para incrementar contadores
count_result() {
    total=$((total + 1))
    if [ $? -eq 0 ]; then
        success=$((success + 1))
    else
        failed=$((failed + 1))
    fi
    echo ""
}

echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  SERVICIOS PRINCIPALES (via NGINX)${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo ""

# Frontend
validate_endpoint \
    "Frontend" \
    "https://localhost:9443/" \
    "200" \
    "Aplicación web principal (SPA)"
count_result

# Backend API - Health Check
validate_endpoint \
    "Backend API - Health" \
    "https://localhost:9443/api/health.php" \
    "200" \
    "Health check de la API backend"
count_result

# Backend API - Users endpoint (puede fallar sin autenticación)
validate_endpoint \
    "Backend API - Users List" \
    "https://localhost:9443/api/users/" \
    "401" \
    "Endpoint de usuarios (requiere autenticación)"
count_result

# Game WebSocket - Info
validate_endpoint \
    "Game WebSocket - Info" \
    "https://localhost:9443/ws/" \
    "200" \
    "Información del servicio WebSocket de juego"
count_result

echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  SERVICIOS DE MONITOREO (Acceso Directo)${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo ""

# Prometheus
validate_endpoint \
    "Prometheus" \
    "http://localhost:9090/-/healthy" \
    "200" \
    "Sistema de recolección de métricas"
count_result

validate_endpoint \
    "Prometheus - Targets" \
    "http://localhost:9090/api/v1/targets" \
    "200" \
    "Estado de targets configurados"
count_result

# Grafana
validate_endpoint \
    "Grafana - Health" \
    "http://localhost:3001/api/health" \
    "200" \
    "Sistema de visualización de métricas"
count_result

validate_endpoint \
    "Grafana - Login" \
    "http://localhost:3001/login" \
    "200" \
    "Página de login de Grafana"
count_result

# cAdvisor
validate_endpoint \
    "cAdvisor - Containers" \
    "http://localhost:8081/cadvisor/containers/" \
    "200" \
    "Métricas de contenedores Docker"
count_result

validate_endpoint \
    "cAdvisor - Docker" \
    "http://localhost:8081/cadvisor/docker/" \
    "200" \
    "Información de Docker"
count_result

# Weave Scope
validate_endpoint \
    "Weave Scope - UI" \
    "http://localhost:4040/" \
    "200" \
    "Visualización de topología de contenedores"
count_result

validate_endpoint \
    "Weave Scope - API" \
    "http://localhost:4040/api" \
    "200" \
    "API de Weave Scope"
count_result

echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  SERVICIOS DE MONITOREO (via NGINX)${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo ""

# Prometheus via Nginx
validate_endpoint \
    "Prometheus (via Nginx)" \
    "https://localhost:9443/prometheus/-/healthy" \
    "401" \
    "Prometheus detrás de autenticación básica"
count_result

# Grafana via Nginx
validate_endpoint \
    "Grafana (via Nginx)" \
    "https://localhost:9443/grafana/" \
    "200" \
    "Grafana accesible vía proxy reverso"
count_result

# cAdvisor via Nginx
validate_endpoint \
    "cAdvisor (via Nginx)" \
    "https://localhost:9443/cadvisor/" \
    "200" \
    "cAdvisor accesible vía proxy reverso"
count_result

echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  EXPORTERS (Prometheus Metrics)${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo ""

# Node Exporter (interno)
validate_endpoint \
    "Node Exporter - Metrics" \
    "http://localhost:9090/api/v1/query?query=up{job=\"node-exporter\"}" \
    "200" \
    "Métricas del sistema host"
count_result

# Nginx Exporter
validate_endpoint \
    "Nginx Exporter - Status" \
    "http://localhost:9090/api/v1/query?query=up{job=\"nginx\"}" \
    "200" \
    "Métricas de Nginx"
count_result

# PHP-FPM Exporter
validate_endpoint \
    "PHP-FPM Exporter - Status" \
    "http://localhost:9090/api/v1/query?query=up{job=\"php-fpm\"}" \
    "200" \
    "Métricas de PHP-FPM"
count_result

echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  NGINX - Endpoints Internos${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo ""

# Nginx Status (desde dentro del contenedor)
echo -e "${CYAN}┌─────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}│ Servicio: ${WHITE}Nginx Status (interno)${NC}"
echo -e "${CYAN}│ Descripción: Estadísticas internas de Nginx${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────${NC}"
status_output=$(docker exec transcendence-nginx wget -qO- http://localhost:8080/nginx_status 2>&1)
if [ $? -eq 0 ]; then
    echo -e "   ${GREEN}✓ Nginx Status activo${NC}"
    echo "$status_output" | sed 's/^/   /'
    success=$((success + 1))
else
    echo -e "   ${RED}✗ No se pudo acceder al status de Nginx${NC}"
    failed=$((failed + 1))
fi
total=$((total + 1))
echo ""

echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  CONECTIVIDAD ENTRE CONTENEDORES${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo ""

# Backend desde Nginx
echo -e "${CYAN}┌─────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}│ Test: ${WHITE}Nginx → Backend${NC}"
echo -e "${CYAN}│ Descripción: Conectividad entre Nginx y Backend${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────${NC}"
backend_test=$(docker exec transcendence-nginx wget -qO- http://backend:9000/api/health.php 2>&1)
if [ $? -eq 0 ]; then
    echo -e "   ${GREEN}✓ Nginx puede acceder a Backend${NC}"
    success=$((success + 1))
else
    echo -e "   ${RED}✗ No se pudo conectar Nginx → Backend${NC}"
    failed=$((failed + 1))
fi
total=$((total + 1))
echo ""

# Frontend desde Nginx
echo -e "${CYAN}┌─────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}│ Test: ${WHITE}Nginx → Frontend${NC}"
echo -e "${CYAN}│ Descripción: Conectividad entre Nginx y Frontend${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────${NC}"
frontend_test=$(docker exec transcendence-nginx wget -qO- http://frontend:3000/index.html 2>&1 | head -n 1)
if [ $? -eq 0 ]; then
    echo -e "   ${GREEN}✓ Nginx puede acceder a Frontend${NC}"
    success=$((success + 1))
else
    echo -e "   ${RED}✗ No se pudo conectar Nginx → Frontend${NC}"
    failed=$((failed + 1))
fi
total=$((total + 1))
echo ""

# Grafana desde Nginx
echo -e "${CYAN}┌─────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}│ Test: ${WHITE}Nginx → Grafana${NC}"
echo -e "${CYAN}│ Descripción: Conectividad entre Nginx y Grafana${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────${NC}"
grafana_test=$(docker exec transcendence-nginx wget -qO- http://grafana:3000/api/health 2>&1)
if [ $? -eq 0 ]; then
    echo -e "   ${GREEN}✓ Nginx puede acceder a Grafana${NC}"
    echo "   Respuesta: $grafana_test" | sed 's/^/   /'
    success=$((success + 1))
else
    echo -e "   ${RED}✗ No se pudo conectar Nginx → Grafana${NC}"
    failed=$((failed + 1))
fi
total=$((total + 1))
echo ""

# Prometheus scraping backend
echo -e "${CYAN}┌─────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}│ Test: ${WHITE}Prometheus → PHP-FPM Exporter${NC}"
echo -e "${CYAN}│ Descripción: Prometheus recolectando métricas de backend${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────${NC}"
prom_test=$(docker exec transcendence-prometheus wget -qO- http://php-fpm-exporter:9253/metrics 2>&1 | head -n 5)
if [ $? -eq 0 ]; then
    echo -e "   ${GREEN}✓ Prometheus puede acceder a PHP-FPM Exporter${NC}"
    success=$((success + 1))
else
    echo -e "   ${RED}✗ No se pudo conectar Prometheus → PHP-FPM Exporter${NC}"
    failed=$((failed + 1))
fi
total=$((total + 1))
echo ""

# Resumen final
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    RESUMEN FINAL                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${CYAN}Total de pruebas:${NC}     $total"
echo -e "  ${GREEN}✓ Exitosas:${NC}          $success"
echo -e "  ${RED}✗ Fallidas:${NC}          $failed"
echo ""

# Calcular porcentaje
percentage=$((success * 100 / total))

if [ $percentage -eq 100 ]; then
    echo -e "  ${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "  ${GREEN}  🎉 TODOS LOS SERVICIOS FUNCIONANDO CORRECTAMENTE  ${NC}"
    echo -e "  ${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
elif [ $percentage -ge 80 ]; then
    echo -e "  ${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "  ${YELLOW}  ⚠️  LA MAYORÍA DE SERVICIOS FUNCIONAN ($percentage%)  ${NC}"
    echo -e "  ${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
else
    echo -e "  ${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "  ${RED}  ❌ MÚLTIPLES SERVICIOS CON PROBLEMAS ($percentage%)  ${NC}"
    echo -e "  ${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
fi
echo ""

# Exit code basado en resultado
if [ $failed -eq 0 ]; then
    exit 0
else
    exit 1
fi
