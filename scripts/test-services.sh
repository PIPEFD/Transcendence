#!/bin/bash

# Colores para la salida
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔍 Iniciando pruebas de servicios..."

# Función para probar un endpoint HTTP
test_http() {
    local name=$1
    local url=$2
    local expected_code=$3
    
    echo -n "Probando $name... "
    code=$(curl -s -o /dev/null -w "%{http_code}" $url)
    
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

# Frontend
test_http "Frontend" "http://localhost:9180" 200

# Backend
test_http "Backend Health" "http://localhost:9180/api/health" 200
test_http "Backend API" "http://localhost:9180/api/status" 200

# WebSocket
test_ws "Game WebSocket" "ws://localhost:9180/ws"

echo "🔍 Probando servicios de monitorización..."

# Prometheus
test_http "Prometheus" "http://localhost:9090/-/healthy" 200

# Grafana
test_http "Grafana" "http://localhost:3001/api/health" 200

# cAdvisor
test_http "cAdvisor" "http://localhost:8080/healthz" 200

# Node Exporter
test_http "Node Exporter" "http://localhost:9100/metrics" 200

# Nginx Exporter
test_http "Nginx Exporter" "http://localhost:9113/metrics" 200

# PHP-FPM Exporter
test_http "PHP-FPM Exporter" "http://localhost:9253/metrics" 200

echo "🌐 Probando Weave Scope..."

# Weave Scope
test_http "Weave Scope" "http://localhost:9584" 200

echo "✨ Pruebas completadas"