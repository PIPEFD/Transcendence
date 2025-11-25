#!/bin/bash

# Script para subir avatares a los usuarios de prueba
# Uso: ./scripts/upload-test-avatars.sh

echo "🖼️  Subiendo avatares a usuarios de prueba"
echo "===================================================="

# Base URL de la API
API_URL="https://localhost:9443/api"

# Directorio de avatares
AVATAR_DIR="frontend/assets"

# Array de usuarios de prueba con sus avatares
declare -a USERS=(
    "testuser1:Test123!:avatar_11.png"
    "testuser2:Test123!:avatar_12.png"
    "testuser3:Test123!:avatar_13.png"
    "testuser4:Test123!:avatar_14.png"
)

# Contadores
SUCCESS=0
FAILED=0

# Procesar cada usuario
for user_data in "${USERS[@]}"; do
    IFS=':' read -r username password avatar <<< "$user_data"
    
    echo ""
    echo "📝 Procesando usuario: $username"
    
    avatar_path="$AVATAR_DIR/$avatar"
    
    if [ ! -f "$avatar_path" ]; then
        echo "   ⚠️  Archivo de avatar no encontrado: $avatar_path"
        ((FAILED++))
        continue
    fi
    
    echo "🔑 Autenticando..."
    
    # Hacer login para obtener token
    login_response=$(curl -s -X POST "$API_URL/login.php" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$username\",\"pass\":\"$password\"}" \
        -k)
    
    echo "   Respuesta login: $login_response"
    
    # El token puede estar en "token" o en "details" dependiendo de la API
    token=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [ -z "$token" ]; then
        token=$(echo "$login_response" | grep -o '"details":"[^"]*"' | cut -d'"' -f4)
    fi
    
    if [ -n "$token" ]; then
        echo "   ✅ Autenticado correctamente"
        
        # Extraer user_id de la respuesta de login
        user_id=$(echo "$login_response" | grep -o '"user_id":[0-9]*' | grep -o '[0-9]*')
        
        if [ -z "$user_id" ]; then
            echo "   ⚠️  No se pudo obtener user_id del login"
            ((FAILED++))
            continue
        fi
        
        echo "🖼️  Subiendo avatar $avatar (user_id: $user_id)..."
        
        # Subir avatar
        upload_response=$(curl -s -X POST "$API_URL/upload.php" \
            -H "Authorization: Bearer $token" \
            -F "avatar=@$avatar_path" \
            -F "user_id=$user_id" \
            -k -w "\n%{http_code}")
        
        upload_code=$(echo "$upload_response" | tail -1)
        upload_body=$(echo "$upload_response" | sed '$d')
        
        echo "   HTTP Code: $upload_code"
        echo "   Respuesta: $upload_body"
        
        if [ "$upload_code" = "200" ] || [ "$upload_code" = "201" ]; then
            echo "   ✅ Avatar subido correctamente"
            ((SUCCESS++))
        else
            echo "   ⚠️  Error subiendo avatar (HTTP $upload_code)"
            ((FAILED++))
        fi
    else
        echo "   ⚠️  Error: No se pudo obtener token de autenticación"
        echo "   Respuesta completa: $login_response"
        ((FAILED++))
    fi
done

echo ""
echo "===================================================="
echo "📊 Resumen:"
echo "   ✅ Avatares subidos: $SUCCESS"
echo "   ❌ Fallidos: $FAILED"
echo ""

if [ $SUCCESS -eq 4 ]; then
    echo "✨ Todos los avatares han sido subidos correctamente"
else
    echo "⚠️  Algunos avatares no pudieron ser subidos"
    echo "💡 Tip: Verifica que los usuarios existan y las credenciales sean correctas"
fi
echo ""
