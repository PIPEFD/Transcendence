#!/bin/bash

# Colores para la salida
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Directorio base
BASE_DIR="/workspaces/Transcendence"

# Función para mostrar la ayuda
show_help() {
    echo -e "${BLUE}Script de Pruebas Automatizadas - Transcendence${NC}"
    echo
    echo "Uso: $0 [opciones]"
    echo
    echo "Opciones:"
    echo "  --unit          Ejecutar pruebas unitarias"
    echo "  --integration   Ejecutar pruebas de integración"
    echo "  --all           Ejecutar todas las pruebas"
    echo "  --help          Mostrar esta ayuda"
    echo
}

# Función para ejecutar pruebas unitarias
run_unit_tests() {
    echo -e "${YELLOW}Ejecutando pruebas unitarias...${NC}"
    cd "$BASE_DIR"
    python3 -m pytest tests/test_unit.py -v
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✓ Todas las pruebas unitarias pasaron correctamente${NC}"
    else
        echo -e "${RED}✗ Algunas pruebas unitarias fallaron${NC}"
    fi
    
    return $exit_code
}

# Función para ejecutar pruebas de integración
run_integration_tests() {
    echo -e "${YELLOW}Verificando que los servicios estén en ejecución...${NC}"
    
    # Verificar si docker-compose está ejecutándose
    if ! docker compose -f "$BASE_DIR/compose/docker-compose.yml" ps | grep -q "Up"; then
        echo -e "${RED}Los servicios no están en ejecución. Iniciando servicios...${NC}"
        docker compose -f "$BASE_DIR/compose/docker-compose.yml" up -d
        
        # Esperar a que los servicios estén listos
        echo -e "${YELLOW}Esperando a que los servicios estén listos...${NC}"
        sleep 20
    fi
    
    echo -e "${YELLOW}Ejecutando pruebas de integración...${NC}"
    cd "$BASE_DIR"
    python3 -m pytest tests/test_integration.py tests/test_connectivity.py -v
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✓ Todas las pruebas de integración pasaron correctamente${NC}"
    else
        echo -e "${RED}✗ Algunas pruebas de integración fallaron${NC}"
    fi
    
    return $exit_code
}

# Función para ejecutar todas las pruebas
run_all_tests() {
    local unit_exit_code=0
    local integration_exit_code=0
    
    run_unit_tests
    unit_exit_code=$?
    
    run_integration_tests
    integration_exit_code=$?
    
    if [ $unit_exit_code -eq 0 ] && [ $integration_exit_code -eq 0 ]; then
        echo -e "${GREEN}✓ Todas las pruebas pasaron correctamente${NC}"
        return 0
    else
        echo -e "${RED}✗ Algunas pruebas fallaron${NC}"
        return 1
    fi
}

# Si no hay argumentos, mostrar la ayuda
if [ $# -eq 0 ]; then
    show_help
    exit 0
fi

# Procesar argumentos
case "$1" in
    --unit)
        run_unit_tests
        exit $?
        ;;
    --integration)
        run_integration_tests
        exit $?
        ;;
    --all)
        run_all_tests
        exit $?
        ;;
    --help)
        show_help
        exit 0
        ;;
    *)
        echo -e "${RED}Opción no reconocida: $1${NC}"
        show_help
        exit 1
        ;;
esac