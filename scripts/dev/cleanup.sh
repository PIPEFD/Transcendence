#!/bin/bash

# Script para limpiar archivos Docker Compose redundantes y subdirectorios innecesarios
# Creado para el proyecto Transcendence

# Colores para la salida
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Limpieza de archivos y directorios innecesarios ===${NC}"
echo

# Directorio base
BASE_DIR="/workspaces/Transcendence"
COMPOSE_DIR="${BASE_DIR}/compose"

# Lista de archivos Docker Compose redundantes a eliminar
COMPOSE_FILES=(
  "docker-compose.yml"
  "docker-compose.monitoring.yml"
  "docker-compose.tests.yml"
  "docker-compose.waf.yml"
  "docker-compose.optimized.yml"
)

# Lista de subdirectorios innecesarios a eliminar
SUBDIRS=(
  "elk"
  "logs"
)

# Crear directorio de respaldo
BACKUP_DIR="${BASE_DIR}/backups/cleanup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "${BACKUP_DIR}/compose"

echo -e "${YELLOW}Creando copia de seguridad en ${BACKUP_DIR}${NC}"

# Hacer copias de seguridad y eliminar archivos Docker Compose redundantes
for file in "${COMPOSE_FILES[@]}"; do
  if [ -f "${COMPOSE_DIR}/${file}" ]; then
    echo -e "${YELLOW}Respaldando ${file}...${NC}"
    cp "${COMPOSE_DIR}/${file}" "${BACKUP_DIR}/compose/"
    echo -e "${RED}Eliminando ${file}...${NC}"
    rm "${COMPOSE_DIR}/${file}"
    echo -e "${GREEN}✓ ${file} eliminado correctamente${NC}"
  else
    echo -e "${BLUE}El archivo ${file} no existe, saltando...${NC}"
  fi
done

# Hacer copias de seguridad y eliminar subdirectorios innecesarios
for dir in "${SUBDIRS[@]}"; do
  if [ -d "${COMPOSE_DIR}/${dir}" ]; then
    echo -e "${YELLOW}Respaldando directorio ${dir}...${NC}"
    mkdir -p "${BACKUP_DIR}/compose/${dir}"
    cp -R "${COMPOSE_DIR}/${dir}"/* "${BACKUP_DIR}/compose/${dir}/"
    echo -e "${RED}Eliminando directorio ${dir}...${NC}"
    rm -rf "${COMPOSE_DIR}/${dir}"
    echo -e "${GREEN}✓ Directorio ${dir} eliminado correctamente${NC}"
  else
    echo -e "${BLUE}El directorio ${dir} no existe, saltando...${NC}"
  fi
done

# Eliminar archivos de texto innecesarios
if [ -f "${COMPOSE_DIR}/texto.txt" ]; then
  echo -e "${RED}Eliminando texto.txt...${NC}"
  cp "${COMPOSE_DIR}/texto.txt" "${BACKUP_DIR}/compose/"
  rm "${COMPOSE_DIR}/texto.txt"
  echo -e "${GREEN}✓ texto.txt eliminado correctamente${NC}"
fi

if [ -f "${COMPOSE_DIR}/urls.txt" ]; then
  echo -e "${RED}Eliminando urls.txt...${NC}"
  cp "${COMPOSE_DIR}/urls.txt" "${BACKUP_DIR}/compose/"
  rm "${COMPOSE_DIR}/urls.txt"
  echo -e "${GREEN}✓ urls.txt eliminado correctamente${NC}"
fi

echo
echo -e "${GREEN}=== Limpieza completada exitosamente ===${NC}"
echo -e "${BLUE}Se ha creado una copia de seguridad en: ${BACKUP_DIR}${NC}"
echo -e "${YELLOW}Ahora el proyecto utiliza únicamente docker-compose.yml para todos los servicios.${NC}"