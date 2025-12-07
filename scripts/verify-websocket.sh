#!/bin/bash

# Script para verificar peticiones WebSocket (WS/WSS)
# Muestra conexiones activas, logs y tráfico en tiempo real

echo "🔍 VERIFICACIÓN DE WEBSOCKET (WS/WSS)"
echo "======================================"
echo ""

# 1. Verificar logs del servidor WebSocket
echo "📡 Logs del servidor game-ws (últimas 20 líneas):"
echo "------------------------------------------------"
docker logs transcendence-game-ws --tail 20 2>&1 | grep -v "Deprecated" || echo "⚠️  No logs disponibles"
echo ""

# 2. Verificar conexiones activas en el servidor
echo "🔗 Conexiones activas en game-ws:"
echo "--------------------------------"
docker exec transcendence-game-ws netstat -an 2>/dev/null | grep ":8080" | grep ESTABLISHED | wc -l | xargs echo "  Conexiones TCP activas:"
echo ""

# 3. Verificar logs de nginx para websocket
echo "🌐 Logs de nginx para /ws (últimas 10):"
echo "--------------------------------------"
docker exec transcendence-nginx tail -20 /var/log/nginx/access.log 2>/dev/null | grep "/ws" | tail -10 || echo "⚠️  No hay logs de /ws"
echo ""

# 4. Ver errores de WebSocket en nginx
echo "❌ Errores de WebSocket en nginx:"
echo "--------------------------------"
docker exec transcendence-nginx tail -20 /var/log/nginx/error.log 2>/dev/null | grep -i websocket || echo "✅ Sin errores de WebSocket"
echo ""

# 5. Verificar configuración del proxy WebSocket
echo "⚙️  Configuración de proxy WebSocket en nginx:"
echo "--------------------------------------------"
docker exec transcendence-nginx cat /etc/nginx/nginx.conf 2>/dev/null | grep -A 5 "location /ws" || echo "⚠️  No se encontró configuración /ws"
echo ""

# 6. Test de conectividad
echo "🧪 Test de conectividad:"
echo "----------------------"
echo "  HTTP Backend: $(curl -s -o /dev/null -w '%{http_code}' https://localhost:9443/api/health.php -k 2>/dev/null || echo 'ERROR')"
echo "  WebSocket interno: $(docker exec transcendence-nginx nc -zv game-ws 8080 2>&1 | grep -q succeeded && echo 'OK' || echo 'FAIL')"
echo ""

# 7. Monitoreo en tiempo real (opcional)
echo "📊 Para monitorear en tiempo real:"
echo "  docker logs -f transcendence-game-ws"
echo "  docker logs -f transcendence-nginx | grep ws"
echo ""
echo "🔧 Para debug detallado del WebSocket:"
echo "  websocat wss://localhost:9443/ws/ -k --header='Authorization: Bearer TOKEN'"
echo ""
echo "💡 Endpoints disponibles:"
echo "  WS interno:  ws://game-ws:8080"
echo "  WSS externo: wss://localhost:9443/ws/"
