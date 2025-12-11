#!/bin/bash

# Script de acceso rápido a Grafana - Monitoreo de Contenedores
# Abre automáticamente el navegador con las credenciales

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     GRAFANA - MONITOREO DE CONTENEDORES              ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar que Grafana está corriendo
if ! docker ps | grep -q transcendence-grafana; then
    echo -e "${YELLOW}⚠️  Grafana no está corriendo${NC}"
    echo -e "${YELLOW}Iniciando servicios...${NC}"
    docker-compose -f compose/docker-compose.yml up -d grafana
    sleep 5
fi

# Obtener credenciales
GRAFANA_USER=$(cat config/secrets/grafana_admin_user 2>/dev/null || echo "admin")
GRAFANA_PASS=$(cat config/secrets/grafana_admin_password 2>/dev/null || echo "admin")

echo -e "${GREEN}✅ Grafana está corriendo${NC}"
echo ""
echo -e "${CYAN}📊 URLs de Acceso:${NC}"
echo -e "   ${BLUE}Dashboard Principal:${NC}"
echo -e "   http://localhost:3001"
echo ""
echo -e "   ${BLUE}Dashboard de Contenedores Docker:${NC}"
echo -e "   http://localhost:3001/d/transcendence-containers/transcendence-docker-containers-monitor"
echo ""
echo -e "   ${BLUE}cAdvisor (métricas directas):${NC}"
echo -e "   http://localhost:8081/cadvisor/containers/"
echo ""
echo -e "   ${BLUE}Prometheus:${NC}"
echo -e "   http://localhost:9090"
echo ""
echo -e "${CYAN}🔐 Credenciales:${NC}"
echo -e "   Usuario: ${GREEN}${GRAFANA_USER}${NC}"
echo -e "   Password: ${GREEN}${GRAFANA_PASS}${NC}"
echo ""
echo -e "${CYAN}📈 Métricas Disponibles:${NC}"
echo -e "   • CPU Usage por contenedor"
echo -e "   • Memoria (uso absoluto y porcentaje vs límite)"
echo -e "   • Network I/O (RX/TX)"
echo -e "   • Disk I/O (Read/Write)"
echo -e "   • Estado de exporters"
echo ""
echo -e "${CYAN}💡 Tip:${NC} El dashboard se actualiza automáticamente cada 5 segundos"
echo ""

# Intentar abrir el navegador (solo en entornos con GUI)
if command -v xdg-open &> /dev/null; then
    echo -e "${YELLOW}¿Abrir Grafana en el navegador? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        xdg-open "http://localhost:3001/d/transcendence-containers/transcendence-docker-containers-monitor" 2>/dev/null &
        echo -e "${GREEN}✅ Abriendo navegador...${NC}"
    fi
fi

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
