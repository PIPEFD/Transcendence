# Usuarios Registrados en Transcendence

## 📊 Estado Actual

**Total de usuarios: 4**

## 👥 Lista de Usuarios

| ID | Username | Email | ELO | Estado | Creado |
|---|----------|-------|-----|--------|--------|
| 1 | testuser1 | test1@example.com | 200 | Offline | 2025-12-11 09:18:25 |
| 2 | testuser2 | test2@example.com | 200 | Offline | 2025-12-11 09:18:26 |
| 3 | testuser3 | test3@example.com | 200 | Offline | 2025-12-11 09:18:26 |
| 4 | testuser4 | test4@example.com | 200 | Offline | 2025-12-11 09:18:27 |

## 🔐 Credenciales de Acceso

Todos los usuarios comparten la misma contraseña para testing:

| Usuario | Contraseña |
|---------|-----------|
| testuser1 | Test123! |
| testuser2 | Test123! |
| testuser3 | Test123! |
| testuser4 | Test123! |

## 🌐 Acceso a la Aplicación

### Desde la misma máquina:
```
https://localhost:9443
```

### Desde otro ordenador (42 campus):
```
https://<IP-DEL-SERVIDOR>:9443
```

**Ejemplo:**
```
https://192.168.1.100:9443
```

## 📍 Información Técnica

- **Base de datos:** SQLite 3
- **Ubicación:** `/var/www/html/database/db.sqlite`
- **Contenedor:** `transcendence-backend`
- **Esquema:** Ver `backend/public/config/schema.sql`

## 🧪 Verificación de Login

Todos los usuarios se pueden loguear correctamente:

```bash
# Ejemplo de login
curl -X POST "https://localhost:9443/api/login.php" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser1","pass":"Test123!"}'
```

Respuesta esperada (éxito):
```json
{
  "success": "Login successful (test mode)",
  "details": "eyJ0eXAi...",
  "user_id": 1,
  "test_mode": true
}
```

## 📊 Estadísticas

- **Amistades activas:** 0
- **Solicitudes de amistad pendientes:** 0
- **Ranking creado:** 0
- **Códigos 2FA:** 0

## 🔄 Para Crear Nuevos Usuarios

Usar el script:
```bash
bash scripts/create-test-users.sh
```

Este script:
1. Crea usuarios directamente en SQLite
2. Verifica que existan en la BD
3. Prueba el login de cada usuario

## 🎯 Próximos Pasos

1. Acceder desde 42 campus a `https://<IP>:9443`
2. Loguear con cualquiera de los usuarios
3. Probar funcionalidades del chat
4. Crear amistades entre usuarios
5. Jugar partidas y ver ranking

## ⚙️ Notas

- Los usuarios se crean con contraseña hasheada con SHA256
- Todos tienen ELO inicial de 200
- No requieren 2FA para testing
- Los avatares aún no están asignados
