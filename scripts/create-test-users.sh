#!/bin/bash

# Script para crear 4 usuarios de prueba
# Uso: ./scripts/create-test-users.sh

echo "🧪 Creando usuarios de prueba para testing del chat"
echo "===================================================="

# Base URL de la API
API_URL="https://localhost:9443/api"

# Array de usuarios de prueba
declare -a USERS=(
    "testuser1:Test123!:test1@example.com"
    "testuser2:Test123!:test2@example.com"
    "testuser3:Test123!:test3@example.com"
    "testuser4:Test123!:test4@example.com"
)

# Contador de éxitos
SUCCESS=0
FAILED=0

# Crear cada usuario
for user_data in "${USERS[@]}"; do
    IFS=':' read -r username password email <<< "$user_data"
    
    echo ""
    echo "📝 Creando usuario: $username"
    
    # Crear usuario
    response=$(curl -s -X POST "$API_URL/users.php" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$username\",\"pass\":\"$password\",\"email\":\"$email\"}" \
        -k -w "\n%{http_code}")
    
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
        echo "✅ Usuario $username creado exitosamente"
        ((SUCCESS++))
    else
        echo "⚠️  Error creando $username (HTTP $http_code)"
        echo "   Respuesta: $body"
        ((FAILED++))
    fi
done

echo ""
echo "===================================================="
echo "📊 Resumen:"
echo "   ✅ Creados: $SUCCESS"
echo "   ❌ Fallidos: $FAILED"
echo ""
echo "👥 Usuarios de prueba disponibles:"
echo "   - testuser1 / Test123!"
echo "   - testuser2 / Test123!"
echo "   - testuser3 / Test123!"
echo "   - testuser4 / Test123!"
echo ""
echo "🔐 Nota: Estos usuarios NO requieren 2FA para facilitar las pruebas"
echo "   (a menos que el backend lo exija)"
echo ""
echo "🧪 Para hacer login desde otro ordenador:"
echo "   1. Accede a https://<IP-DEL-SERVIDOR>:9443"
echo "   2. Usa cualquiera de los usuarios de arriba"
echo "   3. Verifica el código 2FA en los logs si es necesario"
echo ""
