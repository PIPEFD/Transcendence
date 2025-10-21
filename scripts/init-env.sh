#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Base directory
BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/.."

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   Inicializando Proyecto Transcendence   ${NC}"
echo -e "${BLUE}=========================================${NC}"
echo

# 1. Crear directorios necesarios
echo -e "${YELLOW}Creando directorios necesarios...${NC}"
mkdir -p $BASE_DIR/config/ssl
mkdir -p $BASE_DIR/config/auth
mkdir -p $BASE_DIR/config/secrets
mkdir -p $BASE_DIR/config/cloudflare/certs
mkdir -p $BASE_DIR/nginx/certs
mkdir -p $BASE_DIR/logs/nginx
mkdir -p $BASE_DIR/backend/srcs/database
mkdir -p $BASE_DIR/backend/srcs/public/api/uploads

# 2. Generar certificados SSL si no existen
if [ ! -f "$BASE_DIR/config/ssl/fullchain.pem" ]; then
    echo -e "${YELLOW}Generando certificados SSL...${NC}"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout $BASE_DIR/config/ssl/privkey.pem \
      -out $BASE_DIR/config/ssl/fullchain.pem \
      -subj "/C=ES/ST=Madrid/L=Madrid/O=42/OU=dev/CN=localhost"
else
    echo -e "${GREEN}Certificados SSL ya existen${NC}"
fi

# 3. Generar parámetros DH para SSL si no existen
if [ ! -f "$BASE_DIR/config/ssl/dhparam.pem" ]; then
    echo -e "${YELLOW}Generando parámetros Diffie-Hellman...${NC}"
    openssl dhparam -out $BASE_DIR/config/ssl/dhparam.pem 2048
else
    echo -e "${GREEN}Parámetros DH ya existen${NC}"
fi

# 4. Establecer permisos correctos
echo -e "${YELLOW}Configurando permisos...${NC}"
chmod -R 755 $BASE_DIR/config
chmod 600 $BASE_DIR/config/ssl/privkey.pem
chmod 644 $BASE_DIR/config/ssl/fullchain.pem
chmod 644 $BASE_DIR/config/ssl/dhparam.pem

# 5. Crear enlaces simbólicos para compatibilidad
echo -e "${YELLOW}Creando enlaces simbólicos...${NC}"
ln -sf ../../config/ssl/privkey.pem $BASE_DIR/nginx/certs/privkey.pem
ln -sf ../../config/ssl/fullchain.pem $BASE_DIR/nginx/certs/fullchain.pem
ln -sf ../../config/ssl/dhparam.pem $BASE_DIR/nginx/certs/dhparam.pem

# Copiar certificados a la carpeta de Cloudflare
echo -e "${YELLOW}Copiando certificados a la carpeta de Cloudflare...${NC}"
cp $BASE_DIR/config/ssl/privkey.pem $BASE_DIR/config/cloudflare/certs/privkey.pem
cp $BASE_DIR/config/ssl/fullchain.pem $BASE_DIR/config/cloudflare/certs/fullchain.pem
cp $BASE_DIR/config/ssl/dhparam.pem $BASE_DIR/config/cloudflare/certs/dhparam.pem

# 6. Generar claves de la aplicación si no existen
if [ ! -f "$BASE_DIR/config/secrets/app.key" ] || [ ! -f "$BASE_DIR/config/secrets/jwt.key" ]; then
    echo -e "${YELLOW}Generando claves de aplicación...${NC}"
    openssl rand -base64 32 > $BASE_DIR/config/secrets/app.key
    openssl rand -base64 32 > $BASE_DIR/config/secrets/jwt.key
else
    echo -e "${GREEN}Claves de aplicación ya existen${NC}"
fi

# 7. Verificar que Docker está instalado
echo -e "${YELLOW}Verificando Docker...${NC}"
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker y/o Docker Compose no están instalados${NC}"
    echo "Por favor, instale Docker y Docker Compose antes de continuar"
    exit 1
fi

# 8. Preparar el entorno de la base de datos
echo -e "${YELLOW}Preparando entorno de base de datos...${NC}"
touch $BASE_DIR/backend/srcs/database/database.sqlite
chmod 666 $BASE_DIR/backend/srcs/database/database.sqlite

# 9. Crear/actualizar archivo .env
echo -e "${YELLOW}Configurando archivo .env...${NC}"
ENV_FILE="$BASE_DIR/.env"

# Crear o sobrescribir el archivo .env
cat > "$ENV_FILE" << EOL
# Transcendence - Configuración Principal
APP_ENV=development
APP_DEBUG=true
APP_URL=https://localhost

# Claves de seguridad
APP_KEY=$(cat "$BASE_DIR/config/secrets/app_key.secret" 2>/dev/null || echo "base64:$(openssl rand -base64 32)")
JWT_SECRET=$(cat "$BASE_DIR/config/secrets/jwt_secret.secret" 2>/dev/null || echo "$(openssl rand -base64 32)")

# Puertos de servicios
FRONTEND_PORT=3000
BACKEND_PORT=9000
GAME_WS_PORT=6001
GRAFANA_PORT=3001
PROMETHEUS_PORT=9090
ELASTICSEARCH_PORT=9200
KIBANA_PORT=5601

# Configuración de Base de Datos
DB_CONNECTION=sqlite
DB_DATABASE=/app/srcs/database/database.sqlite

# Configuración de servicios
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# Configuración de correo
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@transcendence.local"
MAIL_FROM_NAME="Transcendence"
EOL

echo -e "${GREEN}Archivo .env configurado correctamente${NC}"

# Cargar variables de entorno
export APP_ENV=development
export APP_DEBUG=true
export FRONTEND_PORT=3000
export BACKEND_PORT=9000

# 10. Iniciar servicios
echo -e "${YELLOW}Iniciando servicios...${NC}"
cd $BASE_DIR/compose && docker-compose down && docker-compose up -d

echo -e "${GREEN}¡Inicialización completada con éxito!${NC}"
echo
echo -e "${BLUE}Para acceder a la aplicación, visite:${NC}"
echo -e "  ${YELLOW}https://localhost${NC}"
echo
echo -e "${BLUE}Credenciales predeterminadas de Grafana:${NC}"
echo -e "  Usuario: ${YELLOW}admin${NC}"
echo -e "  Contraseña: ${YELLOW}admin${NC}"
echo
echo -e "Prometheus: http://localhost:${PROMETHEUS_PORT:-9090}\n"