#!/bin/bash

# Test completo del WebSocket con autenticación
echo "🧪 TEST COMPLETO DE WEBSOCKET"
echo "============================="
echo ""

# 1. Login y obtener token
echo "1️⃣  Autenticando testuser1..."
TOKEN=$(curl -k -s -X POST https://localhost:9443/api/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser1","pass":"Test123!"}' | jq -r '.details')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo "❌ Error: No se pudo obtener token"
    exit 1
fi

echo "✅ Token obtenido: ${TOKEN:0:50}..."
echo ""

# 2. Crear script de comandos WebSocket
echo "2️⃣  Preparando comandos WebSocket..."
cat > /tmp/ws-test-commands.txt << EOF
{"type":"auth","token":"$TOKEN","id":"1"}
{"type":"ping"}
{"type":"get-online-users"}
EOF

echo "✅ Comandos preparados:"
cat /tmp/ws-test-commands.txt
echo ""

# 3. Conectar al WebSocket
echo "3️⃣  Conectando a WebSocket..."
echo "   URL: wss://localhost:9443/ws/"
echo ""

# Función para test con timeout
run_ws_test() {
    local timeout_duration=5
    
    # Ejecutar wscat en background
    NODE_TLS_REJECT_UNAUTHORIZED=0 wscat -c wss://localhost:9443/ws/ < /tmp/ws-test-commands.txt &
    local ws_pid=$!
    
    # Esperar con timeout
    sleep $timeout_duration
    
    # Matar proceso si sigue vivo
    if kill -0 $ws_pid 2>/dev/null; then
        kill $ws_pid 2>/dev/null
    fi
}

echo "📡 Enviando mensajes..."
run_ws_test

echo ""
echo "4️⃣  Verificando logs del servidor..."
docker logs transcendence-game-ws --tail 15 2>&1 | grep -v "Deprecated" | tail -10

echo ""
echo "✅ TEST COMPLETADO"
echo ""
echo "💡 Para test interactivo manual:"
echo "   1. Copia el token: ${TOKEN:0:40}..."
echo "   2. Ejecuta: NODE_TLS_REJECT_UNAUTHORIZED=0 wscat -c wss://localhost:9443/ws/"
echo '   3. Envía: {"type":"auth","token":"TOKEN_AQUI","id":"1"}'
echo '   4. Envía: {"type":"ping"}'
echo '   5. Envía: {"type":"get-online-users"}'
echo ""
echo "📊 Monitorear logs:"
echo "   docker logs -f transcendence-game-ws"

# Limpiar
rm -f /tmp/ws-test-commands.txt
