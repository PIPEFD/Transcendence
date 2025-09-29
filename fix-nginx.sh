#!/bin/bash
# Script para arreglar la configuración de NGINX y otros problemas

set -e

echo "Aplicando correcciones a la configuración del proyecto..."

# 1. Primero hacemos backup de los archivos que vamos a modificar
echo "Creando copias de seguridad..."
mkdir -p /workspaces/Transcendence/backups/nginx/snippets
mkdir -p /workspaces/Transcendence/backups/nginx/conf.d
cp /workspaces/Transcendence/nginx/snippets/api_proxy.conf /workspaces/Transcendence/backups/nginx/snippets/
cp /workspaces/Transcendence/nginx/snippets/ws_proxy.conf /workspaces/Transcendence/backups/nginx/snippets/
cp /workspaces/Transcendence/nginx/conf.d/app.conf /workspaces/Transcendence/backups/nginx/conf.d/

# 2. Corregimos el archivo api_proxy.conf (quitamos la directiva location)
echo "Corrigiendo api_proxy.conf..."
cat > /workspaces/Transcendence/nginx/snippets/api_proxy.conf << 'EOF'
# API Proxy Configuration - Common settings for API locations
# Remove the /api/ prefix before passing to backend
rewrite ^/api/(.*)$ /$1 break;

# Pass requests to backend service
proxy_pass http://backend:9000;

# Include common proxy headers
include /etc/nginx/snippets/proxy_common.conf;

# Timeouts
proxy_connect_timeout 300;
proxy_send_timeout 300;
proxy_read_timeout 300;

# Rate limiting for API
limit_req zone=api_limit burst=20 nodelay;
EOF

# 3. Corregimos el archivo ws_proxy.conf (quitamos la directiva location)
echo "Corrigiendo ws_proxy.conf..."
cat > /workspaces/Transcendence/nginx/snippets/ws_proxy.conf << 'EOF'
# WebSocket Proxy Configuration - Common settings for WebSocket locations
proxy_pass http://game-ws:9010;

# WebSocket specific settings
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";

# Include common proxy headers
include /etc/nginx/snippets/proxy_common.conf;

# WebSocket specific timeouts
proxy_connect_timeout 300s;
proxy_send_timeout 300s;
proxy_read_timeout 300s;
EOF

# 4. Corregimos el archivo app.conf para incluir los snippets dentro de las directivas location
echo "Corrigiendo app.conf..."
cat > /workspaces/Transcendence/nginx/conf.d/app.conf << 'EOF'
# Main application server
server {
    listen 80;
    listen [::]:80;
    
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    server_name localhost;
    
    # SSL configuration
    ssl_certificate /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;
    
    # Include monitoring endpoints
    include /etc/nginx/snippets/monitoring.conf;
    
    # Root directory for frontend static files
    root /var/www/html;
    index index.html;
    
    # API locations
    location /api/ {
        # Include API proxy configuration
        include /etc/nginx/snippets/api_proxy.conf;
    }
    
    # WebSocket location
    location /ws/ {
        # Include WebSocket proxy configuration
        include /etc/nginx/snippets/ws_proxy.conf;
    }
    
    # Frontend location
    location / {
        # Try serving static files, or forward to frontend
        try_files $uri $uri/ @frontend;
    }
    
    # Frontend fallback
    location @frontend {
        proxy_pass http://frontend:3000;
        include /etc/nginx/snippets/proxy_common.conf;
    }
}
EOF

echo "Correcciones aplicadas correctamente."
echo "Ahora puedes reiniciar los servicios con: make restart"