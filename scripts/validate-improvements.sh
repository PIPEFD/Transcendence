#!/bin/bash

# Script para validar las mejoras implementadas en el proyecto
# - SPA fallback
# - WebSocket connection
# - i18n hot-reload

set -e

echo "🔍 Validando mejoras del proyecto Transcendence..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="${BASE_URL:-https://localhost:9443}"
WS_URL="${WS_URL:-wss://localhost:9443/ws/}"

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Test 1: SPA Fallback
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Test 1: SPA Fallback (rutas directas)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test route /game
echo "  Probando ruta directa: /game"
RESPONSE_CODE=$(curl -k -s -o /dev/null -w "%{http_code}" "$BASE_URL/game" || echo "000")
if [ "$RESPONSE_CODE" = "200" ]; then
    print_status 0 "Ruta /game devuelve 200"
else
    print_status 1 "Ruta /game devuelve $RESPONSE_CODE (esperado: 200)"
fi

# Test route /chat
echo "  Probando ruta directa: /chat"
RESPONSE_CODE=$(curl -k -s -o /dev/null -w "%{http_code}" "$BASE_URL/chat" || echo "000")
if [ "$RESPONSE_CODE" = "200" ]; then
    print_status 0 "Ruta /chat devuelve 200"
else
    print_status 1 "Ruta /chat devuelve $RESPONSE_CODE (esperado: 200)"
fi

# Test route /settings
echo "  Probando ruta directa: /settings"
RESPONSE_CODE=$(curl -k -s -o /dev/null -w "%{http_code}" "$BASE_URL/settings" || echo "000")
if [ "$RESPONSE_CODE" = "200" ]; then
    print_status 0 "Ruta /settings devuelve 200"
else
    print_status 1 "Ruta /settings devuelve $RESPONSE_CODE (esperado: 200)"
fi

echo ""

# Test 2: WebSocket connection
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Test 2: WebSocket Server (desde contenedor)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check WebSocket server health via container
if command -v docker &> /dev/null; then
    echo "  Verificando servidor WebSocket..."
    
    # Check if game-ws container is running
    WS_CONTAINER=$(docker ps --filter "name=transcendence-game-ws" --format "{{.Names}}" 2>/dev/null)
    
    if [ -n "$WS_CONTAINER" ]; then
        print_status 0 "Contenedor game-ws está corriendo"
        
        # Check if port 8080 is listening inside container
        WS_PORT_CHECK=$(docker exec "$WS_CONTAINER" sh -c "netstat -tuln 2>/dev/null | grep ':8080' || ss -tuln 2>/dev/null | grep ':8080' || echo ''" 2>/dev/null)
        
        if [ -n "$WS_PORT_CHECK" ]; then
            print_status 0 "Puerto 8080 escuchando en game-ws"
        else
            print_status 1 "Puerto 8080 no escuchando (puede estar iniciando)"
        fi
    else
        print_status 1 "Contenedor game-ws no está corriendo"
        echo -e "${YELLOW}   Ejecutar: docker-compose up -d game-ws${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Docker no disponible, saltando test de WebSocket${NC}"
fi

echo ""

# Test 3: API endpoints
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Test 3: API Endpoints"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test API base
echo "  Probando endpoint /api/"
RESPONSE_CODE=$(curl -k -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/" || echo "000")
if [ "$RESPONSE_CODE" != "000" ]; then
    print_status 0 "API endpoint accesible (código: $RESPONSE_CODE)"
else
    print_status 1 "API endpoint no responde"
fi

echo ""

# Test 4: Static assets
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Test 4: Static Assets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test main.js
echo "  Probando dist/main.js"
RESPONSE_CODE=$(curl -k -s -o /dev/null -w "%{http_code}" "$BASE_URL/dist/main.js" || echo "000")
if [ "$RESPONSE_CODE" = "200" ]; then
    print_status 0 "main.js accesible"
else
    print_status 1 "main.js no encontrado (código: $RESPONSE_CODE)"
fi

echo ""

# Test 5: Docker services
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Test 5: Docker Services Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if docker-compose is available
if command -v docker-compose &> /dev/null || command -v docker &> /dev/null; then
    # Try to get container status
    NGINX_STATUS=$(docker ps --filter "name=transcendence-nginx" --format "{{.Status}}" 2>/dev/null | head -n 1)
    FRONTEND_STATUS=$(docker ps --filter "name=transcendence-frontend" --format "{{.Status}}" 2>/dev/null | head -n 1)
    BACKEND_STATUS=$(docker ps --filter "name=transcendence-backend" --format "{{.Status}}" 2>/dev/null | head -n 1)
    GAMEWS_STATUS=$(docker ps --filter "name=transcendence-game-ws" --format "{{.Status}}" 2>/dev/null | head -n 1)
    
    if [ -n "$NGINX_STATUS" ]; then
        print_status 0 "Nginx: $NGINX_STATUS"
    else
        print_status 1 "Nginx: no running"
    fi
    
    if [ -n "$FRONTEND_STATUS" ]; then
        print_status 0 "Frontend: $FRONTEND_STATUS"
    else
        print_status 1 "Frontend: no running"
    fi
    
    if [ -n "$BACKEND_STATUS" ]; then
        print_status 0 "Backend: $BACKEND_STATUS"
    else
        print_status 1 "Backend: no running"
    fi
    
    if [ -n "$GAMEWS_STATUS" ]; then
        print_status 0 "Game-WS: $GAMEWS_STATUS"
    else
        print_status 1 "Game-WS: no running"
    fi
else
    echo -e "${YELLOW}⚠️  Docker no disponible, saltando test de servicios${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Validación completada"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Notas:"
echo "  - Si el SPA fallback falla, reconstruir el contenedor frontend"
echo "  - Si WebSocket falla, verificar que game-ws esté running"
echo "  - Para tests manuales en navegador:"
echo "    1. Abrir $BASE_URL/game y presionar F5"
echo "    2. Cambiar idioma en /language y verificar actualización"
echo "    3. Abrir /chat y enviar mensajes"
echo ""
