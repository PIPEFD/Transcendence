#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Directorio de configuración
CONFIG_DIR="/workspaces/Transcendence/config"
mkdir -p "$CONFIG_DIR"

# Generar una contraseña aleatoria segura
generate_password() {
    openssl rand -base64 32
}

# Generar un token JWT seguro
generate_jwt_secret() {
    openssl rand -hex 64
}

echo -e "${YELLOW}Generando credenciales seguras...${NC}"

# Generar .env desde .env.example con valores seguros
if [ -f .env.example ]; then
    echo -e "${YELLOW}Generando .env desde .env.example...${NC}"
    cp .env.example .env
    
    # Reemplazar valores sensibles con valores seguros
    sed -i "s/change_this_to_a_secure_secret_key/$(generate_jwt_secret)/" .env
    sed -i "s/secret_password_change_me/$(generate_password)/" .env
    sed -i "s/change_this_to_secure_api_key/$(generate_password)/" .env
    sed -i "s/change_this_to_secure_csrf_token/$(generate_jwt_secret)/" .env
    sed -i "s/change_this_password/$(generate_password)/" .env
    
    echo -e "${GREEN}✓ Archivo .env generado con credenciales seguras${NC}"
fi

# Generar archivo de contraseñas para Nginx/Prometheus
echo -e "${YELLOW}Generando credenciales para Prometheus...${NC}"
PROMETHEUS_PASSWORD=$(generate_password)
#!/bin/bash
set -e

# Directorios para credenciales
SECRETS_DIR="config/secrets"
AUTH_DIR="config/auth"
OAUTH_DIR="$SECRETS_DIR/google"
mkdir -p "$SECRETS_DIR" "$AUTH_DIR" "$OAUTH_DIR"

# Generar APP_KEY si no existe
if [ ! -f "$SECRETS_DIR/app.key" ]; then
    openssl rand -hex 32 > "$SECRETS_DIR/app.key"
    chmod 600 "$SECRETS_DIR/app.key"
fi

# Generar JWT Secret Key si no existe
if [ ! -f "$SECRETS_DIR/jwt.key" ]; then
    openssl rand -base64 64 | tr -d '\n' > "$SECRETS_DIR/jwt.key"
    chmod 600 "$SECRETS_DIR/jwt.key"
fi

# Generar credenciales para Prometheus/Grafana si no existen
if [ ! -f "$AUTH_DIR/.htpasswd" ]; then
    # Generar contraseña aleatoria
    ADMIN_PASS=$(openssl rand -hex 12)
    # Crear archivo htpasswd para Nginx auth
    echo "admin:$(openssl passwd -apr1 $ADMIN_PASS)" > "$AUTH_DIR/.htpasswd"
    chmod 600 "$AUTH_DIR/.htpasswd"
    # Guardar credenciales en archivo de texto
    echo "Prometheus/Grafana credentials:" > "$SECRETS_DIR/monitoring_credentials.txt"
    echo "Username: admin" >> "$SECRETS_DIR/monitoring_credentials.txt"
    echo "Password: $ADMIN_PASS" >> "$SECRETS_DIR/monitoring_credentials.txt"
    chmod 600 "$SECRETS_DIR/monitoring_credentials.txt"
fi

# Generar .env si no existe
if [ ! -f ".env" ]; then
    APP_KEY=$(cat "$SECRETS_DIR/app.key")
    JWT_KEY=$(cat "$SECRETS_DIR/jwt.key")
    cat > .env << EOF
# Environment
ENV=development
APP_DEBUG=true

# Application
APP_KEY=$APP_KEY
JWTsecretKey=$JWT_KEY

# Ports
NGINX_HTTP_PORT=80
NGINX_HTTPS_PORT=443
BACKEND_PORT=9000
FRONTEND_PORT=3000
GRAFANA_PORT=3001

# Database
DB_CONNECTION=sqlite
DB_DATABASE=/var/www/database/database.sqlite
EOF
    chmod 600 .env
fi

echo "✅ Credenciales generadas en $SECRETS_DIR/"
echo "✅ Archivo de autenticación creado en $AUTH_DIR/"
echo -e "${GREEN}✓ Credenciales de Prometheus generadas${NC}"
echo "Usuario: admin"
echo "Contraseña: $PROMETHEUS_PASSWORD"

# Guardar credenciales en un archivo seguro
echo -e "${YELLOW}Guardando credenciales en archivo seguro...${NC}"
CREDENTIALS_FILE="$CONFIG_DIR/credentials.txt"
echo "# Credenciales generadas $(date)" > "$CREDENTIALS_FILE"
echo "# ¡MANTENER ESTE ARCHIVO SEGURO!" >> "$CREDENTIALS_FILE"
echo "Prometheus:" >> "$CREDENTIALS_FILE"
echo "  Usuario: admin" >> "$CREDENTIALS_FILE"
echo "  Contraseña: $PROMETHEUS_PASSWORD" >> "$CREDENTIALS_FILE"

echo -e "${GREEN}✓ Credenciales guardadas en $CREDENTIALS_FILE${NC}"
echo -e "${YELLOW}IMPORTANTE: Guarda una copia segura de las credenciales y elimina $CREDENTIALS_FILE${NC}"