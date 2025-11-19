# 🧪 Guía de Testing del Chat - 4 Usuarios

## ✅ Setup Completado

Se han creado 4 usuarios de prueba con relaciones de amistad entre todos ellos.

## 👥 Usuarios de Prueba

| Usuario    | Password  | User ID | Token (válido por 1 hora) |
|------------|-----------|---------|---------------------------|
| testuser1  | Test123!  | 2       | Ver abajo                 |
| testuser2  | Test123!  | 3       | Ver abajo                 |
| testuser3  | Test123!  | 4       | Ver abajo                 |
| testuser4  | Test123!  | 5       | Ver abajo                 |

## 🌐 Acceso desde Múltiples Ordenadores

### Opción 1: Login Normal (Recomendado)

1. En cada ordenador, accede a: `https://<IP-DEL-SERVIDOR>:9443`
2. Haz login con uno de los usuarios de arriba
3. Ingresa el código 2FA del email

### Opción 2: Login Rápido con Tokens (Para Testing)

Para evitar el 2FA en cada prueba, usa estos comandos en la consola del navegador:

**Ordenador 1 - testuser1:**
```javascript
localStorage.setItem('userId', '2');
localStorage.setItem('tokenUser', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODEiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwODEiLCJpYXQiOjE3NjM1NDI5NzMsImV4cCI6MTc2MzU0NjU3MywiZGF0YSI6eyJ1c2VyX2lkIjoyfX0.bIot3NzfNpaxSMvrL81FrQMQSNdzELwOAazUCI6k38Y');
location.reload();
```

**Ordenador 2 - testuser2:**
```javascript
localStorage.setItem('userId', '3');
localStorage.setItem('tokenUser', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODEiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwODEiLCJpYXQiOjE3NjM1NDI5NzMsImV4cCI6MTc2MzU0NjU3MywiZGF0YSI6eyJ1c2VyX2lkIjozfX0.krehqET_nPdEp8nN-DANgCre-oNmUiLYFDBu_rt8d0s');
location.reload();
```

**Ordenador 3 - testuser3:**
```javascript
localStorage.setItem('userId', '4');
localStorage.setItem('tokenUser', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODEiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwODEiLCJpYXQiOjE3NjM1NDI5NzUsImV4cCI6MTc2MzU0NjU3NSwiZGF0YSI6eyJ1c2VyX2lkIjo0fX0.rfVNUJUh595Tj17P_lp4HVVJvjQRySOC9GflQ0Ul6vQ');
location.reload();
```

**Ordenador 4 - testuser4:**
```javascript
localStorage.setItem('userId', '5');
localStorage.setItem('tokenUser', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODEiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwODEiLCJpYXQiOjE3NjM1NDI5NzUsImV4cCI6MTc2MzU0NjU3NSwiZGF0YSI6eyJ1c2VyX2lkIjo1fX0.7VzGBIzAyx0LVUCcEAYIGczeOg_PH1jINv0vFP0DdTo');
location.reload();
```

## 🧪 Escenarios de Prueba

### 1. Conexión WebSocket
- [ ] Verifica que cada usuario se conecta correctamente
- [ ] En la consola debe aparecer: "✅ WebSocket conectado y autenticado"
- [ ] Verifica ping/pong cada 30 segundos

### 2. Estado de Usuarios (Status)
- [ ] Cuando un usuario se conecta, los demás deben ver que está "online" 🟢
- [ ] En el chat, verifica los indicadores de estado en la lista de amigos

### 3. Chat en Tiempo Real
- [ ] Usuario 1 envía mensaje a Usuario 2
- [ ] Usuario 2 debe recibir el mensaje instantáneamente
- [ ] Prueba conversación entre múltiples usuarios
- [ ] Verifica que los mensajes solo llegan al destinatario correcto

### 4. Cambio de Estado
- [ ] Cambia el estado de un usuario a "in-game" 🎮
- [ ] Los demás usuarios deben ver el cambio en tiempo real
- [ ] Estados disponibles: online, in-game, away

### 5. Desconexión
- [ ] Cuando un usuario cierra el navegador
- [ ] Los demás deben ver que está "offline" ⚫

## 🔧 Comandos Útiles

### Regenerar Tokens (si expiran después de 1 hora)
```bash
./scripts/login-test-user.sh testuser1
./scripts/login-test-user.sh testuser2
./scripts/login-test-user.sh testuser3
./scripts/login-test-user.sh testuser4
```

### Ver Logs en Tiempo Real
```bash
# WebSocket
docker logs -f transcendence-game-ws

# Backend
docker logs -f transcendence-backend

# Nginx
docker logs -f transcendence-nginx
```

### Ver Usuarios Online en la Base de Datos
```bash
docker exec transcendence-backend sqlite3 /var/www/html/srcs/database/database.sqlite \
  "SELECT user_id, username, is_online FROM users WHERE username LIKE 'testuser%';"
```

## 🌍 Acceso desde Red Local

Para probar desde otro ordenador en la misma red:

1. **Obtén la IP del servidor:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. **En el otro ordenador, accede a:**
   ```
   https://<IP-DEL-SERVIDOR>:9443
   ```

3. **Acepta el certificado SSL autofirmado** (advertencia de seguridad)

4. **Usa los tokens de arriba** para login rápido

## ⚠️ Notas Importantes

- Los tokens **expiran en 1 hora**
- Si ves error 403, regenera el token con `./scripts/login-test-user.sh`
- El WebSocket debe mostrar en consola los mensajes de ping/pong
- Todos los usuarios son amigos entre sí por defecto

## 🐛 Troubleshooting

**WebSocket no conecta:**
```bash
docker logs transcendence-game-ws --tail 50
```

**Error 502 en avatar:**
```bash
docker compose -f compose/docker-compose.yml restart nginx backend
```

**Token expirado:**
```bash
./scripts/login-test-user.sh testuser1
# Copia el nuevo token del output
```
