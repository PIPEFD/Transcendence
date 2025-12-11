#!/bin/bash

# Script mejorado para crear usuarios de prueba directamente en la BD
# Uso: ./scripts/create-test-users.sh
# 
# Este script crea usuarios directamente en SQLite en lugar de usar la API
# Razón: Garantiza que los usuarios existan en la BD antes de probar login

echo "🧪 Creando usuarios de prueba para testing"
echo "==========================================="

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
LOGIN_SUCCESS=0
LOGIN_FAILED=0
AVATAR_SUCCESS=0
AVATAR_FAILED=0

echo ""
echo "📝 FASE 1: Creando usuarios en la base de datos SQLite"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Crear cada usuario directamente en SQLite
for user_data in "${USERS[@]}"; do
    IFS=':' read -r username password email avatar <<< "$user_data"
    
    echo ""
    echo "📝 Usuario: $username"
    
    # Crear usuario directamente en la BD SQLite con password hasheado
    # Usar SHA256 como hash simple para pruebas
    pass_hash=$(echo -n "$password" | sha256sum | cut -d' ' -f1)
    
    # Insertar en la BD
    insert_result=$(docker exec transcendence-backend sqlite3 /var/www/html/database/db.sqlite \
        "INSERT INTO users (username, email, pass, elo, is_online) 
         VALUES ('$username', '$email', '$pass_hash', 200, 0);" 2>&1)
    
    if [ -z "$insert_result" ]; then
        echo "   ✅ Creado en BD"
        ((SUCCESS++))
        
        # Obtener el user_id asignado
        user_id=$(docker exec transcendence-backend sqlite3 /var/www/html/database/db.sqlite \
            "SELECT user_id FROM users WHERE username='$username';" 2>/dev/null)
        
        if [ -n "$user_id" ]; then
            echo "   📌 ID: $user_id"
            
            # Subir avatar si existe
            avatar_path="$AVATAR_DIR/$avatar"
            if [ -f "$avatar_path" ]; then
                echo "   🖼️  Avatar disponible: $avatar"
                ((AVATAR_SUCCESS++))
            else
                echo "   ⚠️  Avatar no encontrado: $avatar"
                ((AVATAR_FAILED++))
            fi
        fi
    else
        echo "   ❌ Error en BD: $insert_result"
        ((FAILED++))
    fi
done

echo ""
echo "📋 FASE 2: Verificando usuarios en la BD"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

docker exec transcendence-backend sqlite3 /var/www/html/database/db.sqlite \
    "SELECT user_id, username, email, elo, is_online FROM users ORDER BY user_id;"

echo ""
echo "🔐 FASE 3: Probando login con los usuarios creados"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Probar login con cada usuario
for user_data in "${USERS[@]}"; do
    IFS=':' read -r username password email avatar <<< "$user_data"
    
    echo ""
    echo "🔑 Probando login: $username"
    
    # Intentar login
    login_response=$(curl -s -X POST "$API_URL/login.php" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$username\",\"pass\":\"$password\"}" \
        -k -w "\n%{http_code}")
    
    http_code=$(echo "$login_response" | tail -1)
    body=$(echo "$login_response" | sed '$d')
    
    if [ "$http_code" = "200" ]; then
        echo "   ✅ Login exitoso (HTTP 200)"
        ((LOGIN_SUCCESS++))
        
        # Verificar si requiere 2FA
        if echo "$body" | grep -q '"2fa_required".*true'; then
            echo "   ⚠️  Requiere 2FA"
        else
            echo "   ✅ Sin 2FA requerido"
        fi
    else
        echo "   ❌ Login fallido (HTTP $http_code)"
        echo "   Respuesta: $body"
        ((LOGIN_FAILED++))
    fi
done

echo ""
echo "📊 RESUMEN FINAL:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "👥 Usuarios en BD:"
echo "   ✅ Creados: $SUCCESS"
echo "   ❌ Fallidos: $FAILED"
echo ""
echo "� Login:"
echo "   ✅ Exitosos: $LOGIN_SUCCESS"
echo "   ❌ Fallidos: $LOGIN_FAILED"
echo ""
echo "👥 Credenciales de prueba:"
echo "   • testuser1 / Test123! (test1@example.com)"
echo "   • testuser2 / Test123! (test2@example.com)"
echo "   • testuser3 / Test123! (test3@example.com)"
echo "   • testuser4 / Test123! (test4@example.com)"
echo ""
echo "🌐 Acceso desde 42 campus:"
echo "   1. Obtén la IP del servidor: ifconfig | grep inet"
echo "   2. Accede a: https://<IP-DEL-SERVIDOR>:9443"
echo "   3. Usa cualquiera de los usuarios de arriba"
echo ""
echo "⚙️  Nota técnica:"
echo "   • Usuarios creados directamente en SQLite (no vía API)"
echo "   • Passwords hasheados con SHA256 (para pruebas)"
echo "   • La BD está en: /var/www/html/database/db.sqlite"
echo ""

