#!/bin/bash

# Script para limpiar archivos temporales o innecesarios del proyecto
# Este script elimina archivos que no son necesarios para el funcionamiento del proyecto

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}===================================${NC}"
echo -e "${YELLOW}  LIMPIEZA DE ARCHIVOS INNECESARIOS  ${NC}"
echo -e "${YELLOW}===================================${NC}"

# Solicitar confirmación
echo -e "${RED}¡ADVERTENCIA! Este script eliminará archivos temporales y basura.${NC}"
echo "Se eliminarán los siguientes archivos:"
echo "  - Archivos de salida temporal (ouput, outfile, output.txt)"
echo "  - Archivos de documentación temporal (ComoConectarFrontConBack.txt, secrets.txt)"
echo "  - Archivos de backup o temporales en backend (activao.txt, docu.txt)"
echo "  - Makefile.temp y otros archivos duplicados o de respaldo"
echo "  - Directorios temporales y archivos de logs innecesarios"
echo

read -p "¿Está seguro que desea continuar? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Operación cancelada.${NC}"
    exit 0
fi

echo -e "${YELLOW}Iniciando limpieza de archivos innecesarios...${NC}"

# Archivos en la raíz que parecen ser temporales o innecesarios
echo -e "${BLUE}Eliminando archivos temporales en la raíz del proyecto...${NC}"
rm -f /workspaces/Transcendence/ouput
rm -f /workspaces/Transcendence/outfile
rm -f /workspaces/Transcendence/output.txt
rm -f /workspaces/Transcendence/ComoConectarFrontConBack.txt
rm -f /workspaces/Transcendence/secrets.txt
rm -f /workspaces/Transcendence/Makefile.temp
rm -f /workspaces/Transcendence/dashboard.html  # Este parece duplicado, ya que hay uno en backend/public

# Archivos en el directorio backend que parecen ser documentación temporal o basura
echo -e "${BLUE}Eliminando archivos temporales en el directorio backend...${NC}"
rm -f /workspaces/Transcendence/backend/activao.txt
rm -f /workspaces/Transcendence/backend/docu.txt
rm -f /workspaces/Transcendence/backend/SETUP.txt

# Limpiar archivos temporales y logs
echo -e "${BLUE}Eliminando archivos temporales y logs...${NC}"
find /workspaces/Transcendence -name "*.tmp" -type f -delete
find /workspaces/Transcendence -name "*.log" -type f -delete
find /workspaces/Transcendence -name "*.swp" -type f -delete
find /workspaces/Transcendence -name "*.bak" -type f -delete
find /workspaces/Transcendence -name "*~" -type f -delete

# Eliminar directorios __pycache__ (Python)
echo -e "${BLUE}Eliminando directorios de caché de Python...${NC}"
find /workspaces/Transcendence -name "__pycache__" -type d -exec rm -rf {} +  2>/dev/null || true

# Eliminar archivos .DS_Store (MacOS)
echo -e "${BLUE}Eliminando archivos .DS_Store...${NC}"
find /workspaces/Transcendence -name ".DS_Store" -type f -delete

# Eliminar archivos de compilación
echo -e "${BLUE}Eliminando archivos de compilación...${NC}"
find /workspaces/Transcendence -name "*.o" -type f -delete
find /workspaces/Transcendence -name "*.pyc" -type f -delete
find /workspaces/Transcendence -name "*.pyo" -type f -delete

echo -e "${GREEN}¡Limpieza de archivos innecesarios finalizada!${NC}"
echo -e "${YELLOW}Se han eliminado todos los archivos temporales y basura detectados.${NC}"