#!/bin/bash

# Script para hacer login con usuarios de prueba y obtener códigos 2FA
# Uso: ./scripts/login-test-user.sh [username]

USERNAME=${1:-testuser1}
PASSWORD="Test123!"
API_URL="https://localhost:9443/api"

echo "🔐 Login como: $USERNAME"
echo "================================"

# Paso 1: Login
echo "📝 Enviando credenciales..."
login_response=$(curl -s -X POST "$API_URL/login.php" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$USERNAME\",\"pass\":\"$PASSWORD\"}" \
    -k)

echo "Respuesta: $login_response"

# Extraer user_id
user_id=$(echo "$login_response" | jq -r '.user_id // empty')
pending_2fa=$(echo "$login_response" | jq -r '.pending_2fa // empty')

if [ -z "$user_id" ] || [ "$pending_2fa" != "true" ]; then
    echo "❌ Error en el login"
    exit 1
fi

echo "✅ Login exitoso - User ID: $user_id"

# Paso 2: Obtener código 2FA de la base de datos
echo ""
echo "📧 Obteniendo código 2FA de la base de datos..."
code=$(docker exec transcendence-backend sqlite3 /var/www/html/srcs/database/database.sqlite \
    "SELECT code FROM twofa_codes WHERE user_id = $user_id ORDER BY created_at DESC LIMIT 1;" 2>/dev/null)

if [ -z "$code" ]; then
    echo "❌ No se encontró código 2FA"
    exit 1
fi

echo "✅ Código 2FA: $code"

# Paso 3: Verificar 2FA y obtener token
echo ""
echo "🔑 Verificando 2FA y obteniendo token..."
verify_response=$(curl -s -X POST "$API_URL/verify_2fa.php" \
    -H "Content-Type: application/json" \
    -d "{\"id\":$user_id,\"code\":\"$code\"}" \
    -k)

echo "Respuesta: $verify_response"

token=$(echo "$verify_response" | jq -r '.details // empty')

if [ -z "$token" ]; then
    echo "❌ Error verificando 2FA"
    exit 1
fi

echo ""
echo "================================"
echo "✅ Login completo!"
echo ""
echo "📋 Información para usar en el navegador:"
echo "   User ID: $user_id"
echo "   Token: ${token:0:50}..."
echo ""
echo "🖥️  Para usar en otro ordenador, ejecuta en la consola del navegador:"
echo ""
echo "localStorage.setItem('userId', '$user_id');"
echo "localStorage.setItem('tokenUser', '$token');"
echo "location.reload();"
echo ""
