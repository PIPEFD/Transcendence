#!/bin/bash

# Colores para la salida
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔍 Iniciando pruebas de servicios..."

# Función para probar un endpoint HTTP/HTTPS
test_http() {
    local name=$1
    local url=$2
    local expected_code=$3
    
    echo -n "Probando $name... "
    # -k: permite certificados autofirmados
    # -L: sigue redirecciones
    code=$(curl -k -L -s -o /dev/null -w "%{http_code}" $url)
    
    if [ "$code" = "$expected_code" ]; then
        echo -e "${GREEN}OK${NC} (código $code)"
        return 0
    else
        echo -e "${RED}ERROR${NC} (código $code, esperado $expected_code)"
        return 1
    fi
}

# Función para probar un endpoint WebSocket
test_ws() {
    local name=$1
    local url=$2
    
    echo -n "Probando WebSocket $name... "
    
    # Usar wscat para probar la conexión WebSocket
    if command -v wscat >/dev/null 2>&1; then
        if echo "ping" | wscat -c $url >/dev/null 2>&1; then
            echo -e "${GREEN}OK${NC}"
            return 0
        else
            echo -e "${RED}ERROR${NC}"
            return 1
        fi
    else
        echo "wscat no instalado. Instalando..."
        npm install -g wscat
        if echo "ping" | wscat -c $url >/dev/null 2>&1; then
            echo -e "${GREEN}OK${NC}"
            return 0
        else
            echo -e "${RED}ERROR${NC}"
            return 1
        fi
    fi
}

echo "📡 Probando servicios principales..."

# Frontend (HTTPS en puerto 9443)
test_http "Frontend" "https://localhost:9443" 200

# Backend (API real que existe)
test_http "Backend API Users" "https://localhost:9443/api/users.php" 200

# WebSocket - Skip si npm no está disponible
if command -v npm >/dev/null 2>&1; then
    test_ws "Game WebSocket" "wss://localhost:9443/ws"
else
    echo "WebSocket test skipped (npm no disponible para instalar wscat)"
fi

echo "🔍 Probando servicios de monitorización..."

# Prometheus
test_http "Prometheus" "http://localhost:9090/-/healthy" 200

# Grafana
test_http "Grafana" "http://localhost:3001/api/health" 200

# cAdvisor (puerto 8081 con prefijo /cadvisor/)
test_http "cAdvisor" "http://localhost:8081/cadvisor/containers/" 200

# Node Exporter
test_http "Node Exporter" "http://localhost:9100/metrics" 200

# Nginx Exporter (verificar métricas desde Prometheus)
echo -n "Probando Nginx Exporter... "
if docker exec transcendence-prometheus wget -q -O- http://nginx-exporter:9113/metrics 2>/dev/null | grep -q "nginx_connections"; then
    echo -e "${GREEN}OK${NC} (métricas activas)"
else
    echo -e "${RED}ERROR${NC}"
fi

# PHP-FPM Exporter (puerto interno, acceder a través de docker exec)
echo -n "Probando PHP-FPM Exporter... "
if docker exec transcendence-php-fpm-exporter wget -q -O- http://localhost:9253/metrics >/dev/null 2>&1; then
    echo -e "${GREEN}OK${NC} (vía docker exec)"
else
    echo -e "${RED}ERROR${NC}"
fi

echo "🌐 Probando Weave Scope..."

# Weave Scope
test_http "Weave Scope" "http://localhost:9584" 200

echo "✨ Pruebas completadas"