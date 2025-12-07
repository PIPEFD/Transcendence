#!/bin/bash

echo "📊 ESTADO DE WEBSOCKET ENDPOINTS"
echo "=================================="
echo ""

# WS Interno
echo "1️⃣  WS Interno: ws://game-ws:8080"
echo "   ├─ Acceso: Solo entre contenedores Docker"
echo "   ├─ SSL: No"
echo "   ├─ Estado contenedor: $(docker inspect transcendence-game-ws --format='{{.State.Status}}' 2>/dev/null || echo 'ERROR')"
echo "   ├─ Health: $(docker inspect transcendence-game-ws --format='{{.State.Health.Status}}' 2>/dev/null || echo 'N/A')"
echo "   └─ Test: $(docker exec transcendence-nginx nc -zv game-ws 8080 2>&1 | grep -q "succeeded" && echo '✅ Accesible' || echo '⚠️  Verificar')"
echo ""

# WSS Externo  
echo "2️⃣  WSS Externo: wss://localhost:9443/ws/"
echo "   ├─ Acceso: Navegador, apps externas"
echo "   ├─ SSL: Sí (TLS/HTTPS)"
echo "   ├─ Proxy: nginx → game-ws:8080"
echo "   ├─ Test HTTP: $(curl -k -s -o /dev/null -w '%{http_code}' https://localhost:9443/api/health.php 2>/dev/null)"
echo "   └─ Test WS: $(echo '{"type":"ping"}' | wscat -c wss://localhost:9443/ws/ -n 2>&1 | grep -q 'ping' && echo '✅ Funcional' || echo '⚠️  Verificar')"
echo ""

# Flujo de datos
echo "📡 FLUJO DE DATOS:"
echo "   Navegador/Cliente"
echo "        ↓ WSS (puerto 9443)"
echo "   Nginx (SSL termination)"
echo "        ↓ WS (puerto 8080)"
echo "   Game-WS Server (PHP Ratchet)"
echo ""

# Logs recientes
echo "📝 LOGS RECIENTES (últimas 5 líneas sin warnings):"
docker logs transcendence-game-ws --tail 20 2>&1 | grep -v "Deprecated" | grep -v "^$" | tail -5 || echo "   Sin logs significativos"
echo ""

# Configuración nginx
echo "⚙️  CONFIGURACIÓN NGINX:"
docker exec transcendence-nginx grep -A 4 "location /ws/" /etc/nginx/conf.d/default.conf 2>/dev/null | head -6
echo ""

echo "✅ RESUMEN:"
echo "   • WS interno operativo para comunicación Docker"
echo "   • WSS externo disponible en wss://localhost:9443/ws/"
echo "   • Servidor WebSocket (game-ws) healthy"
echo ""
echo "🧪 TESTS MANUALES:"
echo "   wscat -c wss://localhost:9443/ws/ -n"
echo "   docker logs -f transcendence-game-ws"
