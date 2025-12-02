#!/bin/bash

# Script para crear 4 usuarios de prueba con avatares
# Uso: ./scripts/create-test-users.sh

echo "🧪 Creando usuarios de prueba para testing del chat"
echo "===================================================="

# Base URL de la API
API_URL="https://localhost:9443/api"

# Obtener directorio raíz del proyecto
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Directorio de avatares
AVATAR_DIR="$PROJECT_ROOT/frontend/assets"

# Array de usuarios de prueba con sus avatares
declare -a USERS=(
    "testuser1:Test123!:test1@example.com:avatar_11.png"
    "testuser2:Test123!:test2@example.com:avatar_12.png"
    "testuser3:Test123!:test3@example.com:avatar_13.png"
    "testuser4:Test123!:test4@example.com:avatar_14.png"
)

# Contadores
SUCCESS=0
FAILED=0
AVATAR_SUCCESS=0
AVATAR_FAILED=0

# Crear cada usuario
for user_data in "${USERS[@]}"; do
    IFS=':' read -r username password email avatar <<< "$user_data"
    
    echo ""
    echo "📝 Creando usuario: $username"
    
    # Crear usuario
    response=$(curl -s -X POST "$API_URL/users.php" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$username\",\"pass\":\"$password\",\"email\":\"$email\"}" \
        -k -w "\n%{http_code}")
    
    http_code=$(echo "$response" | tail -1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
        echo "✅ Usuario $username creado exitosamente"
        ((SUCCESS++))
        
        # Extraer user_id de la respuesta
        user_id=$(echo "$body" | grep -o '"user_id":[0-9]*' | grep -o '[0-9]*')
        
        if [ -n "$user_id" ]; then
            # Subir avatar
            avatar_path="$AVATAR_DIR/$avatar"
            if [ -f "$avatar_path" ]; then
                echo "🖼️  Subiendo avatar $avatar para $username (ID: $user_id)..."
                
                # Primero hacer login para obtener token
                login_response=$(curl -s -X POST "$API_URL/login.php" \
                    -H "Content-Type: application/json" \
                    -d "{\"username\":\"$username\",\"pass\":\"$password\"}" \
                    -k)
                
                token=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
                if [ -z "$token" ]; then
                    token=$(echo "$login_response" | grep -o '"details":"[^"]*"' | cut -d'"' -f4)
                fi
                
                if [ -n "$token" ]; then
                    # Subir avatar
                    upload_response=$(curl -s -X POST "$API_URL/upload.php" \
                        -H "Authorization: Bearer $token" \
                        -F "avatar=@$avatar_path" \
                        -F "user_id=$user_id" \
                        -k -w "\n%{http_code}")
                    
                    upload_code=$(echo "$upload_response" | tail -1)
                    
                    if [ "$upload_code" = "200" ] || [ "$upload_code" = "201" ]; then
                        echo "   ✅ Avatar subido correctamente"
                        ((AVATAR_SUCCESS++))
                    else
                        echo "   ⚠️  Error subiendo avatar (HTTP $upload_code)"
                        ((AVATAR_FAILED++))
                    fi
                else
                    echo "   ⚠️  No se pudo obtener token para subir avatar"
                    ((AVATAR_FAILED++))
                fi
            else
                echo "   ⚠️  Archivo de avatar no encontrado: $avatar_path"
                ((AVATAR_FAILED++))
            fi
        fi
    else
        echo "⚠️  Error creando $username (HTTP $http_code)"
        echo "   Respuesta: $body"
        ((FAILED++))
    fi
done

echo ""
echo "===================================================="
echo "📊 Resumen:"
echo "   👥 Usuarios:"
echo "      ✅ Creados: $SUCCESS"
echo "      ❌ Fallidos: $FAILED"
echo "   🖼️  Avatares:"
echo "      ✅ Subidos: $AVATAR_SUCCESS"
echo "      ❌ Fallidos: $AVATAR_FAILED"
echo ""
echo "👥 Usuarios de prueba disponibles:"
echo "   - testuser1 / Test123! (avatar_11.png)"
echo "   - testuser2 / Test123! (avatar_12.png)"
echo "   - testuser3 / Test123! (avatar_13.png)"
echo "   - testuser4 / Test123! (avatar_14.png)"
echo ""
echo "🔐 Nota: Estos usuarios NO requieren 2FA para facilitar las pruebas"
echo "   (a menos que el backend lo exija)"
echo ""
echo "🧪 Para hacer login desde otro ordenador:"
echo "   1. Accede a https://<IP-DEL-SERVIDOR>:9443"
echo "   2. Usa cualquiera de los usuarios de arriba"
echo "   3. Verifica el código 2FA en los logs si es necesario"
echo ""
