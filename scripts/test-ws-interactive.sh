#!/bin/bash

echo "🔌 WebSocket Interactive Test"
echo "=============================="
echo ""
echo "Ejecuta los siguientes comandos manualmente:"
echo ""
echo "1. Conectar al WebSocket:"
echo "   wscat -c wss://localhost:9443/ws/ -n"
echo ""
echo "2. Autenticar (copia y pega):"
TOKEN=$(curl -s -X POST https://localhost:9443/api/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"parceloco","pass":"12345"}' -k | jq -r '.user_id' | \
  xargs -I {} docker exec transcendence-backend sqlite3 /var/www/html/srcs/database/database.sqlite \
  "SELECT code FROM twofa_codes WHERE user_id = {};" 2>/dev/null | \
  xargs -I {} curl -s -X POST https://localhost:9443/api/verify_2fa.php \
  -H "Content-Type: application/json" \
  -d "{\"id\":1,\"code\":\"{}\"}" -k | jq -r '.details')

echo "{\"type\":\"auth\",\"token\":\"$TOKEN\",\"id\":\"1\"}"
echo ""
echo "3. Probar ping:"
echo '{"type":"ping"}'
echo ""
echo "4. Ver usuarios online:"
echo '{"type":"get-online-users"}'
echo ""
echo "5. Cambiar status:"
echo '{"type":"set-status","status":"in-game"}'
echo ""
echo "=============================="
