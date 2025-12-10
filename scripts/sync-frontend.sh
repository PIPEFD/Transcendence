#!/bin/bash

# =============================================================================
# Script: sync-frontend.sh
# Propósito: Sincronizar cambios del frontend y recompilar en 1 comando
# Uso: make frontend-sync
# =============================================================================

CONTAINER_NAME="transcendence-frontend"
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo -e "${CYAN}🔄 SINCRONIZANDO FRONTEND${NC}"
echo -e "${CYAN}═══════════════════════════════════════════${NC}\n"

# Verificar que el contenedor existe
if ! docker ps --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${RED}❌ Error: Contenedor '${CONTAINER_NAME}' no está corriendo${NC}"
    exit 1
fi

# Recompilar TypeScript
echo -e "${YELLOW}🔨 Recompilando TypeScript...${NC}"
if docker exec "${CONTAINER_NAME}" npm run build:ts 2>&1 | grep -q "error TS"; then
    echo -e "${RED}❌ Error de compilación${NC}"
    exit 1
fi
echo -e "${GREEN}✅ TypeScript compilado${NC}\n"

# Recompilar CSS
echo -e "${YELLOW}🎨 Recompilando CSS...${NC}"
docker exec "${CONTAINER_NAME}" npm run build:css 2>/dev/null
echo -e "${GREEN}✅ CSS compilado${NC}\n"

echo -e "${YELLOW}💡 Próximos pasos:${NC}"
echo -e "   1. ${CYAN}Ctrl + Shift + R${NC} en tu navegador (hard refresh)"
echo -e "   2. O ejecuta: ${CYAN}make frontend-purge${NC}\n"

echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 ¡Frontend sincronizado!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
