#!/bin/bash

# Test WebSocket con wscat (WS y WSS)
# Uso: ./test-wscat.sh [ws|wss|both]

MODE="${1:-both}"

echo "🔌 TEST WEBSOCKET CON WSCAT"
echo "============================"
echo ""

# Función para test WSS (externo con SSL)
test_wss() {
    echo "📡 Test WSS (externo con SSL):"
    echo "   URL: wss://localhost:9443/ws/"
    echo "   Esperando conexión..."
    echo ""
    
    # Crear script temporal para enviar mensajes automáticamente
    cat > /tmp/ws-test-commands.txt << 'EOF'
{"type":"auth","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo5NDQzIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6OTQ0MyIsImlhdCI6MTczMzE3MjAwMCwiZXhwIjoxNzY0NzA4MDAwLCJkYXRhIjp7InVzZXJfaWQiOjF9fQ.test"}
{"type":"ping"}
{"type":"get-online-users"}
EOF
    
    echo "Enviando mensajes de test..."
    timeout 5s wscat -c wss://localhost:9443/ws/ -n < /tmp/ws-test-commands.txt 2>&1 || echo "⚠️  Timeout o error en conexión WSS"
    echo ""
    rm -f /tmp/ws-test-commands.txt
}

# Función para test WS interno (sin SSL)
test_ws_internal() {
    echo "📡 Test WS interno (game-ws directo):"
    echo "   Probando desde dentro del contenedor nginx..."
    echo ""
    
    docker exec transcendence-nginx sh -c '
        echo "{\"type\":\"ping\"}" | timeout 3s nc game-ws 8080 2>&1 | head -5
    ' || echo "⚠️  No se pudo conectar al WS interno"
    echo ""
}

# Función para test WS desde host (sin SSL) - no disponible por seguridad
test_ws_external() {
    echo "⚠️  WS sin SSL no está expuesto externamente (solo WSS)"
    echo "   WS interno solo accesible entre contenedores"
    echo ""
}

# Ejecutar tests según el modo
case "$MODE" in
    wss)
        test_wss
        ;;
    ws)
        test_ws_internal
        ;;
    both)
        test_wss
        echo "---"
        echo ""
        test_ws_internal
        ;;
    *)
        echo "❌ Modo inválido: $MODE"
        echo "Uso: $0 [ws|wss|both]"
        exit 1
        ;;
esac

echo "✅ Tests completados"
echo ""
echo "💡 Para test interactivo:"
echo "   wscat -c wss://localhost:9443/ws/ -n"
echo ""
echo "📊 Logs en vivo:"
echo "   docker logs -f transcendence-game-ws"
echo "   docker logs -f transcendence-nginx | grep ws"
