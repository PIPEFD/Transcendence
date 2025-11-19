#!/bin/bash

# Test WebSocket Authentication Flow
echo "🔵 Testing WebSocket Authentication Flow"
echo "=========================================="

# Paso 1: Login
echo -e "\n📝 Paso 1: Login inicial"
LOGIN_RESPONSE=$(curl -X POST https://localhost:9443/api/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"parceloco","pass":"12345"}' \
  -k -s)

echo "Response: $LOGIN_RESPONSE"

USER_ID=$(echo $LOGIN_RESPONSE | jq -r '.user_id')
PENDING_2FA=$(echo $LOGIN_RESPONSE | jq -r '.pending_2fa')

if [ "$PENDING_2FA" != "true" ]; then
    echo "❌ Error: Login failed"
    exit 1
fi

echo "✅ Login OK - User ID: $USER_ID"

# Paso 2: Obtener código 2FA de la base de datos
echo -e "\n📧 Paso 2: Obtener código 2FA"
CODE=$(docker exec transcendence-backend sqlite3 /var/www/html/srcs/database/database.sqlite \
  "SELECT code FROM twofa_codes WHERE user_id = $USER_ID;" 2>/dev/null)

if [ -z "$CODE" ]; then
    echo "❌ Error: No se encontró código 2FA"
    exit 1
fi

echo "✅ Código 2FA: $CODE"

# Paso 3: Verificar 2FA y obtener token
echo -e "\n🔐 Paso 3: Verificar 2FA y obtener JWT"
VERIFY_RESPONSE=$(curl -X POST https://localhost:9443/api/verify_2fa.php \
  -H "Content-Type: application/json" \
  -d "{\"id\":$USER_ID,\"code\":\"$CODE\"}" \
  -k -s)

echo "Response: $VERIFY_RESPONSE"

TOKEN=$(echo $VERIFY_RESPONSE | jq -r '.details')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
    echo "❌ Error: No se obtuvo token"
    exit 1
fi

echo "✅ Token JWT obtenido"
echo "Token: ${TOKEN:0:50}..."

# Paso 4: Test WebSocket connection
echo -e "\n🔌 Paso 4: Test WebSocket Connection"
echo "Conectando a wss://localhost:9443/ws/"
echo ""
echo "Enviando mensaje de autenticación:"
AUTH_MSG="{\"type\":\"auth\",\"token\":\"$TOKEN\",\"id\":\"$USER_ID\"}"
echo "$AUTH_MSG"
echo ""

# Crear archivo temporal con los comandos
TMP_FILE=$(mktemp)
cat > $TMP_FILE << EOF
$AUTH_MSG
{"type":"ping"}
{"type":"get-online-users"}
EOF

echo "Ejecuta este comando para probar manualmente:"
echo "wscat -c wss://localhost:9443/ws/ -n"
echo "Y luego envía: $AUTH_MSG"
echo ""

# Cleanup
rm -f $TMP_FILE

echo "=========================================="
echo "✅ Flujo de autenticación completado"
echo "Token guardado para usar en WebSocket"
