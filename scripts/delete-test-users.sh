#!/bin/bash

# Script para eliminar los 4 usuarios de prueba
# Uso: ./scripts/delete-test-users.sh

echo "🗑️  Eliminando usuarios de prueba"
echo "===================================================="

# Base URL de la API
API_URL="https://localhost:9443/api"

# Array de usuarios de prueba
declare -a USERS=(
    "testuser1:Test123!"
    "testuser2:Test123!"
    "testuser3:Test123!"
    "testuser4:Test123!"
)

# Contadores
SUCCESS=0
FAILED=0

# Eliminar cada usuario
for user_data in "${USERS[@]}"; do
    IFS=':' read -r username password <<< "$user_data"
    
    echo ""
    echo "🔑 Autenticando usuario: $username"
    
    # Hacer login para obtener token
    login_response=$(curl -s -X POST "$API_URL/login.php" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$username\",\"pass\":\"$password\"}" \
        -k)
    
    token=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    user_id=$(echo "$login_response" | grep -o '"user_id":[0-9]*' | grep -o '[0-9]*')
    
    if [ -n "$token" ] && [ -n "$user_id" ]; then
        echo "   ✅ Autenticado correctamente (ID: $user_id)"
        echo "🗑️  Eliminando usuario $username..."
        
        # Eliminar usuario
        delete_response=$(curl -s -X DELETE "$API_URL/users.php?id=$user_id" \
            -H "Authorization: Bearer $token" \
            -k -w "\n%{http_code}")
        
        http_code=$(echo "$delete_response" | tail -1)
        body=$(echo "$delete_response" | sed '$d')
        
        if [ "$http_code" = "200" ] || [ "$http_code" = "204" ]; then
            echo "   ✅ Usuario $username eliminado exitosamente"
            ((SUCCESS++))
        else
            echo "   ⚠️  Error eliminando $username (HTTP $http_code)"
            echo "   Respuesta: $body"
            ((FAILED++))
        fi
    else
        echo "   ⚠️  Error autenticando $username - No se puede eliminar"
        ((FAILED++))
    fi
done

echo ""
echo "===================================================="
echo "📊 Resumen:"
echo "   ✅ Eliminados: $SUCCESS"
echo "   ❌ Fallidos: $FAILED"
echo ""

if [ $SUCCESS -eq 4 ]; then
    echo "✨ Todos los usuarios de prueba han sido eliminados correctamente"
else
    echo "⚠️  Algunos usuarios no pudieron ser eliminados"
fi
echo ""
