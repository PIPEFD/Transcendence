#!/bin/bash

# Script para hacer que todos los usuarios de prueba sean amigos entre sí
# Esto facilita probar el chat

echo "👥 Configurando relaciones de amistad entre usuarios de prueba"
echo "=============================================================="

# Ejecutar SQL directamente en la base de datos
docker exec transcendence-backend sqlite3 /var/www/html/srcs/database/database.sqlite << 'EOF'
-- Primero, obtener los IDs de los usuarios de prueba
-- Luego crear relaciones de amistad bidireccionales

-- Asumiendo que los usuarios tienen IDs consecutivos, ajusta según sea necesario
-- testuser1 (ID 3) <-> testuser2 (ID 4)
INSERT OR IGNORE INTO friends (user_id, friend_id) 
SELECT u1.user_id, u2.user_id 
FROM users u1, users u2 
WHERE u1.username = 'testuser1' AND u2.username = 'testuser2';

INSERT OR IGNORE INTO friends (user_id, friend_id) 
SELECT u1.user_id, u2.user_id 
FROM users u1, users u2 
WHERE u1.username = 'testuser2' AND u2.username = 'testuser1';

-- testuser1 <-> testuser3
INSERT OR IGNORE INTO friends (user_id, friend_id) 
SELECT u1.user_id, u2.user_id 
FROM users u1, users u2 
WHERE u1.username = 'testuser1' AND u2.username = 'testuser3';

INSERT OR IGNORE INTO friends (user_id, friend_id) 
SELECT u1.user_id, u2.user_id 
FROM users u1, users u2 
WHERE u1.username = 'testuser3' AND u2.username = 'testuser1';

-- testuser1 <-> testuser4
INSERT OR IGNORE INTO friends (user_id, friend_id) 
SELECT u1.user_id, u2.user_id 
FROM users u1, users u2 
WHERE u1.username = 'testuser1' AND u2.username = 'testuser4';

INSERT OR IGNORE INTO friends (user_id, friend_id) 
SELECT u1.user_id, u2.user_id 
FROM users u1, users u2 
WHERE u1.username = 'testuser4' AND u2.username = 'testuser1';

-- testuser2 <-> testuser3
INSERT OR IGNORE INTO friends (user_id, friend_id) 
SELECT u1.user_id, u2.user_id 
FROM users u1, users u2 
WHERE u1.username = 'testuser2' AND u2.username = 'testuser3';

INSERT OR IGNORE INTO friends (user_id, friend_id) 
SELECT u1.user_id, u2.user_id 
FROM users u1, users u2 
WHERE u1.username = 'testuser3' AND u2.username = 'testuser2';

-- testuser2 <-> testuser4
INSERT OR IGNORE INTO friends (user_id, friend_id) 
SELECT u1.user_id, u2.user_id 
FROM users u1, users u2 
WHERE u1.username = 'testuser2' AND u2.username = 'testuser4';

INSERT OR IGNORE INTO friends (user_id, friend_id) 
SELECT u1.user_id, u2.user_id 
FROM users u1, users u2 
WHERE u1.username = 'testuser4' AND u2.username = 'testuser2';

-- testuser3 <-> testuser4
INSERT OR IGNORE INTO friends (user_id, friend_id) 
SELECT u1.user_id, u2.user_id 
FROM users u1, users u2 
WHERE u1.username = 'testuser3' AND u2.username = 'testuser4';

INSERT OR IGNORE INTO friends (user_id, friend_id) 
SELECT u1.user_id, u2.user_id 
FROM users u1, users u2 
WHERE u1.username = 'testuser4' AND u2.username = 'testuser3';

-- Mostrar resultado
SELECT 'Relaciones de amistad creadas:' as info;
SELECT u1.username as usuario, u2.username as amigo
FROM friends f
JOIN users u1 ON f.user_id = u1.user_id
JOIN users u2 ON f.friend_id = u2.user_id
WHERE u1.username LIKE 'testuser%'
ORDER BY u1.username, u2.username;
EOF

echo ""
echo "✅ Relaciones de amistad configuradas"
echo ""
