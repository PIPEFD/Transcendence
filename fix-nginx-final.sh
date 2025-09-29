#!/bin/bash
# Script para arreglar la configuración de NGINX y otros problemas

set -e

echo "Aplicando correcciones finales a la configuración del proyecto..."

# Corregimos el archivo api_proxy.conf (quitamos todas las directivas no permitidas)
echo "Corrigiendo api_proxy.conf..."
cat > /workspaces/Transcendence/nginx/snippets/api_proxy.conf << 'EOF'
# API Proxy Configuration - Common headers for API
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_connect_timeout 300;
proxy_send_timeout 300;
proxy_read_timeout 300;
EOF

# Corregimos el archivo ws_proxy.conf (quitamos proxy_pass)
echo "Corrigiendo ws_proxy.conf..."
cat > /workspaces/Transcendence/nginx/snippets/ws_proxy.conf << 'EOF'
# WebSocket Proxy Configuration - Common settings for WebSocket 
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_connect_timeout 300s;
proxy_send_timeout 300s;
proxy_read_timeout 300s;
EOF

# Corregimos el archivo app.conf para incluir rewrite dentro de la directiva location
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
        # Remove the /api/ prefix before passing to backend
        rewrite ^/api/(.*)$ /$1 break;
        
        # Pass requests to backend service
        proxy_pass http://backend:9000;
        
        # Include API proxy configuration
        include /etc/nginx/snippets/api_proxy.conf;
        
        # Rate limiting for API
        limit_req zone=api_limit burst=20 nodelay;
    }
    
    # WebSocket location
    location /ws/ {
        # Pass to WebSocket server
        proxy_pass http://game-ws:9010;
        
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

# También creamos el archivo monitoring.conf si no existe
echo "Creando monitoring.conf..."
mkdir -p /workspaces/Transcendence/nginx/snippets/
cat > /workspaces/Transcendence/nginx/snippets/monitoring.conf << 'EOF'
# Monitoring endpoints for metrics
location /stub_status {
    stub_status;
    allow 127.0.0.1;
    deny all;
}

location /metrics {
    allow 127.0.0.1;
    deny all;
    proxy_pass http://nginx-exporter:9113/metrics;
}
EOF

# Aseguramos que el archivo proxy_common.conf exista y tenga el contenido correcto
echo "Creando proxy_common.conf..."
cat > /workspaces/Transcendence/nginx/snippets/proxy_common.conf << 'EOF'
# Common proxy headers used across all proxy configurations
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_redirect off;
EOF

echo "Correcciones finales aplicadas correctamente."
echo "Ahora puedes reiniciar los servicios con: make restart"