#!/usr/bin/env bash
# Script de verificación post-inicialización
# Verifica que todos los archivos y permisos estén correctos

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  VERIFICACIÓN POST-INICIALIZACIÓN         ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}"
echo ""

ERRORS=0

# Función para verificar archivo y permisos
check_file() {
    local file=$1
    local expected_perms=$2
    local description=$3
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}✗ FALTA:${NC} $description - $file"
        ((ERRORS++))
        return 1
    fi
    
    actual_perms=$(stat -c "%a" "$file" 2>/dev/null || stat -f "%Lp" "$file" 2>/dev/null)
    if [ "$actual_perms" != "$expected_perms" ]; then
        echo -e "${YELLOW}⚠ PERMISOS:${NC} $description - esperado $expected_perms, encontrado $actual_perms"
        echo -e "   ${BLUE}Archivo:${NC} $file"
        ((ERRORS++))
    else
        echo -e "${GREEN}✓${NC} $description"
    fi
}

# Verificar certificados SSL
echo -e "${BLUE}Verificando certificados SSL...${NC}"
check_file "config/ssl/privkey.pem" "644" "Clave privada SSL"
check_file "config/ssl/fullchain.pem" "644" "Certificado SSL"
check_file "config/ssl/dhparam.pem" "644" "Parámetros Diffie-Hellman"

echo ""

# Verificar secretos
echo -e "${BLUE}Verificando secretos...${NC}"
check_file "config/secrets/app_key.secret" "644" "APP_KEY"
check_file "config/secrets/jwt_secret.secret" "644" "JWT_SECRET"
check_file "config/secrets/grafana_admin_user.secret" "644" "Usuario Grafana"
check_file "config/secrets/grafana_admin_password.secret" "644" "Contraseña Grafana"
check_file "config/secrets/scope_htpasswd.secret" "644" "htpasswd Weave Scope"

echo ""

# Verificar directorios
echo -e "${BLUE}Verificando directorios...${NC}"
DIRS=(
    "config/ssl"
    "config/auth"
    "config/secrets"
    "logs/nginx"
    "backend/database"
)

for dir in "${DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} Directorio: $dir"
    else
        echo -e "${RED}✗ FALTA:${NC} Directorio: $dir"
        ((ERRORS++))
    fi
done

echo ""

# Verificar variables de entorno en .env
if [ -f ".env" ]; then
    echo -e "${BLUE}Verificando variables en .env...${NC}"
    
    REQUIRED_VARS=(
        "NGINX_HTTP_PORT"
        "NGINX_HTTPS_PORT"
        "FRONTEND_URL"
    )
    
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^${var}=" .env; then
            value=$(grep "^${var}=" .env | cut -d'=' -f2)
            echo -e "${GREEN}✓${NC} $var=$value"
        else
            echo -e "${YELLOW}⚠${NC} Variable no encontrada: $var (usando valor por defecto)"
        fi
    done
else
    echo -e "${YELLOW}⚠ Archivo .env no encontrado (se usarán valores por defecto)${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ VERIFICACIÓN COMPLETA - TODO CORRECTO${NC}"
    echo ""
    echo -e "${BLUE}Puedes iniciar los servicios con:${NC}"
    echo -e "  ${GREEN}make up${NC}"
    exit 0
else
    echo -e "${RED}❌ VERIFICACIÓN FALLIDA - $ERRORS ERRORES ENCONTRADOS${NC}"
    echo ""
    echo -e "${YELLOW}Ejecuta 'make init' para reinicializar el entorno${NC}"
    exit 1
fi
