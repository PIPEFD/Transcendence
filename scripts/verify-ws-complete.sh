#!/bin/bash

# Script completo de verificación WebSocket
# Verifica WS interno y WSS externo

echo "🔍 VERIFICACIÓN COMPLETA DE WEBSOCKET"
echo "====================================="
echo ""

# 1. Verificar WS interno (game-ws:8080)
echo "📡 1. WebSocket interno: ws://game-ws:8080"
echo "   (Solo accesible entre contenedores)"
echo "   ----------------------------------------"

# Probar desde nginx hacia game-ws
echo "   Test desde nginx → game-ws:"
docker exec transcendence-nginx sh -c '
    echo "Probando conexión TCP al puerto 8080..."
    nc -zv game-ws 8080 2>&1 | grep -q "succeeded" && echo "   ✅ Puerto 8080 ABIERTO" || echo "   ❌ Puerto 8080 CERRADO"
    
    echo "   Enviando HTTP GET para verificar servidor WebSocket..."
    echo -e "GET / HTTP/1.1\r\nHost: game-ws:8080\r\n\r\n" | nc game-ws 8080 -w 2 | head -3
' 2>/dev/null

echo ""

# 2. Verificar WSS externo (localhost:9443/ws/)
echo "📡 2. WebSocket externo: wss://localhost:9443/ws/"
echo "   (Accesible desde navegador/cliente)"
echo "   ----------------------------------------"

# Test de handshake HTTP
echo "   Test de handshake WebSocket:"
curl -i -k \
    --http1.1 \
    -H "Connection: Upgrade" \
    -H "Upgrade: websocket" \
    -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
    -H "Sec-WebSocket-Version: 13" \
    https://localhost:9443/ws/ 2>&1 | head -15

echo ""

# 3. Verificar logs del servidor
echo "📊 3. Logs del servidor WebSocket (últimas 10 líneas):"
echo "   ----------------------------------------"
docker logs transcendence-game-ws --tail 10 2>&1 | grep -v "Deprecated" | grep -v "^$" || echo "   Sin logs recientes"

echo ""

# 4. Verificar procesos PHP en game-ws
echo "🔧 4. Procesos WebSocket activos:"
echo "   ----------------------------------------"
docker exec transcendence-game-ws ps aux 2>/dev/null | grep -E "php.*websocket|php.*8080" | grep -v grep || echo "   ⚠️  No se encontraron procesos WebSocket"

echo ""

# 5. Verificar configuración de nginx para proxy WebSocket
echo "⚙️  5. Configuración de proxy en nginx:"
echo "   ----------------------------------------"
docker exec transcendence-nginx grep -A 8 "location /ws/" /etc/nginx/conf.d/default.conf 2>/dev/null | head -12

echo ""

# 6. Test con wscat si está disponible
echo "🧪 6. Test con wscat (si está disponible):"
echo "   ----------------------------------------"
if command -v wscat &> /dev/null; then
    echo "   Enviando ping a WSS..."
    echo '{"type":"ping"}' | wscat -c wss://localhost:9443/ws/ -n -x 2>&1 | head -5
else
    echo "   ⚠️  wscat no instalado (npm install -g wscat)"
fi

echo ""
echo "✅ VERIFICACIÓN COMPLETADA"
echo ""
echo "📝 RESUMEN:"
echo "   WS interno:  ws://game-ws:8080 (entre contenedores)"
echo "   WSS externo: wss://localhost:9443/ws/ (navegador)"
echo ""
echo "💡 Para test interactivo:"
echo "   wscat -c wss://localhost:9443/ws/ -n"
echo "   docker logs -f transcendence-game-ws"
