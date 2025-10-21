#!/bin/bash

# Script para limpiar completamente el entorno y dejarlo a cero
# Este script elimina todos los contenedores, volúmenes, redes y archivos generados

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}====================================${NC}"
echo -e "${YELLOW}  LIMPIEZA COMPLETA DEL ENTORNO  ${NC}"
echo -e "${YELLOW}====================================${NC}"

# Solicitar confirmación
echo -e "${RED}¡ADVERTENCIA! Este script eliminará:${NC}"
echo "  - Todos los contenedores Docker del proyecto"
echo "  - Todos los volúmenes Docker asociados"
echo "  - Todas las redes Docker del proyecto"
echo "  - Secretos y archivos de configuración generados"
echo "  - Logs y archivos temporales"
echo
echo -e "${RED}Los datos no podrán ser recuperados después de esta operación.${NC}"
echo

read -p "¿Está seguro que desea continuar? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Operación cancelada.${NC}"
    exit 0
fi

echo -e "${YELLOW}Iniciando limpieza completa...${NC}"

# 1. Detener y eliminar todos los contenedores del proyecto
echo -e "${BLUE}Deteniendo y eliminando contenedores de Docker...${NC}"
# Detener todos los contenedores relacionados con el proyecto
CONTAINERS=$(docker ps -a --filter name=transcendence -q)
if [ -n "$CONTAINERS" ]; then
    echo "Deteniendo contenedores existentes..."
    docker stop $CONTAINERS || true
    docker rm $CONTAINERS || true
fi
# Asegurarnos que docker-compose down se ejecuta correctamente
docker compose -f compose/docker-compose.yml down --remove-orphans -v || true

# 2. Eliminar todos los volúmenes relacionados con el proyecto
echo -e "${BLUE}Eliminando volúmenes de Docker...${NC}"
VOLUMES=$(docker volume ls --filter name=transcendence -q)
if [ -n "$VOLUMES" ]; then
    docker volume rm $VOLUMES || true
fi

# 3. Eliminar redes relacionadas con el proyecto
echo -e "${BLUE}Eliminando redes de Docker...${NC}"
NETWORKS=$(docker network ls --filter name=transcendence -q)
if [ -n "$NETWORKS" ]; then
    docker network rm $NETWORKS || true
fi

# 4. Eliminar archivos generados
echo -e "${BLUE}Eliminando archivos generados y secretos...${NC}"

# Eliminar secretos
rm -rf config/secrets/* || true

# Eliminar base de datos SQLite
rm -f backend/database/database.sqlite || true

# Eliminar certificados SSL generados
rm -f config/ssl/*.pem || true

# Eliminar logs
rm -rf logs/nginx/* || true

# Eliminar archivos temporales
find . -type f -name "*.tmp" -delete || true
find . -type f -name "*.log" -delete || true
find . -type f -name "*.swp" -delete || true

# Eliminar .env si existe
rm -f .env || true

# 5. Pruning de Docker
echo -e "${BLUE}Realizando pruning de Docker...${NC}"
docker system prune -f || true

# 6. Eliminar archivos de caché de composer y node
echo -e "${BLUE}Eliminando caché de dependencias...${NC}"
rm -rf backend/vendor/* || true
rm -rf frontend/node_modules || true

echo -e "${GREEN}¡Limpieza completa finalizada!${NC}"
echo -e "${YELLOW}El entorno está listo para una nueva compilación desde cero.${NC}"
echo -e "${BLUE}Puede inicializar nuevamente con el comando:${NC} make init"