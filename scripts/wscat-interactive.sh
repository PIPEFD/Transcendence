#!/bin/bash

# Test interactivo de WebSocket
# Este script permite ver la comunicación bidireccional

echo "🔌 CONEXIÓN WEBSOCKET INTERACTIVA"
echo "=================================="
echo ""
echo "📡 Conectando a wss://localhost:9443/ws/"
echo ""
echo "💬 Mensajes de ejemplo que puedes enviar:"
echo '   {"type":"ping"}'
echo '   {"type":"auth","token":"YOUR_JWT_TOKEN"}'
echo '   {"type":"get-online-users"}'
echo '   {"type":"chat","userId":1,"receiverId":2,"message":"Hola"}'
echo ""
echo "⚠️  Presiona Ctrl+C para salir"
echo ""
echo "---"
echo ""

# Abrir conexión interactiva con wscat
wscat -c wss://localhost:9443/ws/ -n
