#!/bin/bash

# =============================================================================
# Script: sync-frontend.sh
# Propósito: Sincronizar y recompilar frontend en 1 comando
# Uso: make frontend-sync
# =============================================================================

CONTAINER_NAME="transcendence-frontend"
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo -e "${CYAN}🔄 FRONTEND SYNC & REBUILD${NC}"
echo -e "${CYAN}═══════════════════════════════════════════${NC}\n"

# Verificar que el contenedor existe
if ! docker ps --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${RED}❌ Error: Contenedor '${CONTAINER_NAME}' no está corriendo${NC}"
    echo -e "${YELLOW}Inicia los contenedores con: docker-compose -f compose/docker-compose.yml up${NC}"
    exit 1
fi

# Paso 1: Recrear dist en el contenedor
echo -e "${YELLOW}🗑️  Limpiando y recreando dist en el contenedor...${NC}"
docker exec "${CONTAINER_NAME}" sh -c "rm -rf /app/dist && mkdir -p /app/dist && chmod -R 777 /app/dist" 2>/dev/null
echo -e "${GREEN}✅ Directorio dist recreado${NC}\n"

# Paso 2: Compilar TypeScript
echo -e "${YELLOW}📦 Compilando TypeScript...${NC}"
if docker exec "${CONTAINER_NAME}" npx tsc 2>&1 | grep -q "error TS"; then
    echo -e "${RED}⚠️  Errores de compilación detectados${NC}"
else
    echo -e "${GREEN}✅ TypeScript compilado sin errores${NC}"
fi
docker exec "${CONTAINER_NAME}" sh -c "chmod -R 777 /app/dist" 2>/dev/null
echo

# Paso 3: Compilar CSS
echo -e "${YELLOW}🎨 Compilando Tailwind CSS...${NC}"
docker exec "${CONTAINER_NAME}" npm run build:css 2>/dev/null || true
docker exec "${CONTAINER_NAME}" sh -c "chmod -R 777 /app/dist" 2>/dev/null
echo -e "${GREEN}✅ CSS compilado${NC}\n"

echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Frontend sync completado!${NC}"
echo -e "${GREEN}Presiona Ctrl+Shift+R para recargar el navegador${NC}"
echo -e "${GREEN}════════════════════════════════════════════${NC}"
