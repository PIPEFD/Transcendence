#!/bin/bash

# Monitor en tiempo real del WebSocket
echo "📊 MONITOR WEBSOCKET EN TIEMPO REAL"
echo "===================================="
echo ""
echo "Monitoreando logs de game-ws..."
echo "Presiona Ctrl+C para salir"
echo ""
echo "---"
echo ""

# Seguir logs en tiempo real, filtrando deprecations
docker logs -f transcendence-game-ws 2>&1 | grep -v "Deprecated" | grep --line-buffered -E "auth|ping|pong|chat|game|user|online|error|Error|Auth|Connection"
