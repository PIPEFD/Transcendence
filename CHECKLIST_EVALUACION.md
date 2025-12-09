# ✅ CHECKLIST PRÁCTICA - Pre-Evaluación ft_transcendence

**Usar este documento como lista de verificación antes de la defensa**

---

## 🚨 URGENTE (P0) - HACER PRIMERO

### [ ] 1. Verificar Git History (10 min)

```bash
cd /ruta/a/Transcendence
git log --all --full-history -- "*.secret" "*.env" "*.pem" "google_oauth_client.json"
```

**✅ OK:** No encuentra archivos  
**❌ ALERTA:** Si encuentra commits → Limpiar history con git filter-branch  

---

### [ ] 2. Sanitización XSS (2-3 horas)

**Backend PHP - Añadir a todos los outputs de usuario:**

Archivos a modificar:
- [ ] `backend/public/api/users.php`
- [ ] `backend/public/api/header.php`
- [ ] `backend/public/api/matches.php`
- [ ] `backend/public/api/friends.php`
- [ ] `backend/public/api/ladder.php`

Ejemplo:
```php
// Cambiar TODAS las líneas así:
echo json_encode(['username' => $username]);

// Por esto:
echo json_encode(['username' => htmlspecialchars($username, ENT_QUOTES, 'UTF-8')]);
```

**Frontend TypeScript - Cambiar innerHTML por textContent:**

Archivos a revisar:
- [ ] `frontend/src/views/Profile.ts`
- [ ] `frontend/src/views/Profile1.ts`
- [ ] `frontend/src/views/Chat.ts`
- [ ] `frontend/src/views/MatchHistory.ts`
- [ ] `frontend/src/views/Header.ts`

Ejemplo:
```typescript
// EVITAR:
element.innerHTML = `<p>${username}</p>`;

// USAR:
element.textContent = username;
// O para HTML complejo, sanitizar primero
```

---

### [ ] 3. Verificar Navegación SPA (30 min)

**Prueba manual:**

1. [ ] Abrir https://localhost:9443
2. [ ] Navegar: Home → Register → Menu → Game → Profile
3. [ ] **Hacer clic en botón BACK del navegador**
4. [ ] ¿Vuelve a la vista anterior SIN recargar página? 
   - [ ] ✅ SÍ → OK
   - [ ] ❌ NO → Aplicar fix abajo

**Fix si es necesario:**

Archivo: `frontend/src/main.ts`

Buscar la función `router()` y añadir DESPUÉS:

```typescript
// Añadir estas 3 líneas al final del archivo main.ts:
window.addEventListener('popstate', () => {
  router();
});
```

---

### [ ] 4. Despliegue Completo desde Cero (30 min)

```bash
# Limpiar todo:
make clean-all

# Inicializar desde cero:
make init

# Esperar a que termine (puede tardar 3-5 minutos)
```

**Verificar:**
- [ ] Comando termina sin errores
- [ ] `docker ps` muestra todos los servicios running
- [ ] Todos los healthchecks pasan (columna STATUS: healthy)
- [ ] https://localhost:9443 accesible

---

### [ ] 5. Probar Funcionalidad Básica (15 min)

- [ ] Abrir https://localhost:9443
- [ ] Aceptar certificado auto-firmado
- [ ] **Registro:** Crear nuevo usuario
- [ ] **Login:** Iniciar sesión con usuario creado
- [ ] **Juego 1v1:** 
  - [ ] Navegar a Game → 1v1 Local
  - [ ] Jugar partida completa (hasta 3 puntos)
  - [ ] Controles funcionan: W/S (Player 1), ↑/↓ (Player 2)
- [ ] **SPA:** Usar botón Back del navegador → Funciona
- [ ] **Consola (F12):** Sin errores JavaScript críticos

---

### [ ] 6. Probar en Firefox (15 min)

- [ ] Abrir Firefox (última versión)
- [ ] Ir a https://localhost:9443
- [ ] Aceptar certificado
- [ ] Registro → Login → Jugar 1v1
- [ ] Verificar que todo funciona igual que en Chrome

---

## 📋 IMPORTANTE (P1) - ANTES DE EVALUACIÓN

### [ ] 7. Validación de Inputs (2 horas)

**Backend - Añadir validación:**

Archivo: `backend/public/api/users.php`

```php
// Ejemplo de validación para registro:
function validateUsername($username) {
    if (strlen($username) < 3 || strlen($username) > 20) {
        return false;
    }
    if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
        return false;
    }
    return true;
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validatePassword($password) {
    return strlen($password) >= 8;
}

// Usar antes de insertar en DB:
if (!validateUsername($username)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid username']);
    exit;
}
```

Archivos a modificar:
- [ ] `backend/public/api/users.php` (registro)
- [ ] `backend/public/api/login.php` (login)
- [ ] `backend/public/api/upload.php` (archivos)

---

### [ ] 8. Verificar Inicialización DB (1 hora)

**Verificar que DB se crea automáticamente:**

```bash
# Eliminar DB actual:
rm backend/database/database.sqlite

# Reiniciar backend:
docker restart transcendence-backend

# Verificar que DB se recrea:
ls -lh backend/database/database.sqlite
```

**Si NO se crea automáticamente, añadir script:**

Archivo: `backend/public/config/config.php` (o donde se conecta a DB)

```php
// Añadir ANTES de abrir la conexión:
$dbPath = '/var/www/html/database/database.sqlite';
if (!file_exists($dbPath)) {
    // Crear DB y tablas
    $db = new SQLite3($dbPath);
    
    // Crear tabla users
    $db->exec('CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )');
    
    // Otras tablas...
    $db->close();
}
```

---

### [ ] 9. Documentar Módulos (1 hora)

Crear archivo: `MODULES.md`

```markdown
# Módulos Implementados - ft_transcendence

## Módulos Mayores (10+)

1. **Standard user management** ✅
   - Archivos: backend/public/api/users.php, login.php, logout.php
   - Funcionalidad: Registro, login, logout, gestión de usuarios

2. **Implementing a remote authentication (OAuth2)** ✅
   - Archivos: backend/public/api/gmail_api/, google/apiclient en composer.json
   - Funcionalidad: Login con Google OAuth2

3. **Remote players** ✅
   - Archivos: frontend/src/views/1v1o.ts, game-ws/ WebSocket server
   - Funcionalidad: Juego online en tiempo real

4. **Multiplayers (more than 2)** ✅
   - Archivos: frontend/src/views/3players.ts, 4players.ts
   - Funcionalidad: Pong 3 y 4 jugadores

5. **Live chat** ✅
   - Archivos: frontend/src/views/Chat.ts, WebSocket
   - Funcionalidad: Chat en tiempo real entre usuarios

6. **Introduce an AI Opponent** ✅
   - Archivos: frontend/src/views/vsIA.ts
   - Funcionalidad: IA sigue la pelota automáticamente

7. **Two-Factor Authentication (2FA) and JWT** ✅
   - Archivos: backend/public/api/verify_2fa.php, robthree/twofactorauth
   - Funcionalidad: 2FA TOTP + JWT tokens

8. **Infrastructure Setup for Log Management (ELK)** ✅
   - Archivos: compose/docker-compose.yml, elk/ configs
   - Funcionalidad: Stack ELK completo

9. **Designing the Backend as Microservices** ✅
   - Archivos: docker-compose.yml (4 redes, servicios separados)
   - Funcionalidad: Frontend, backend, game-ws aislados

10. **Tournament system** ✅
    - Archivos: frontend/src/views/tournament4.ts
    - Funcionalidad: Torneo 4 jugadores con brackets

## Módulos Menores (4+)

1. **Use a database for the backend** ✅ (SQLite)
2. **Use frontend toolkit** ✅ (Tailwind CSS)
3. **Monitoring system** ✅ (Prometheus + Grafana)
4. **User and Game Stats Dashboards** ✅ (Statistics.ts + Grafana)
5. **Multiple language supports** ✅ (en, es, fr)

**Total:** 10 mayores + 5 menores = 15 módulos
```

---

### [ ] 10. Verificar OAuth2 (2 horas)

**Si OAuth2 está configurado:**

- [ ] Probar flujo completo de login con Google
- [ ] Verificar que redirecciona correctamente
- [ ] Verificar que crea usuario en DB

**Si OAuth2 NO funciona o no está configurado:**

- [ ] Asegurar que login normal (user/pass) funciona
- [ ] Documentar que OAuth2 es opcional
- [ ] Mostrar código de OAuth2 implementado (aunque no funcione)

---

## 🎁 BONUS (P2) - SI HAY TIEMPO

### [ ] 11. GDPR - Delete Account (4-6 horas)

Archivo nuevo: `backend/public/api/delete_account.php`

```php
<?php
require_once '../config/config.php';

$db = connectDatabase();
$userId = getUserIdFromToken(); // Implementar función que obtiene userId del JWT

if (!$userId) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Eliminar usuario y sus datos relacionados
$db->exec("DELETE FROM users WHERE user_id = $userId");
$db->exec("DELETE FROM matches WHERE player1_id = $userId OR player2_id = $userId");
// Eliminar otras tablas relacionadas...

echo json_encode(['success' => true, 'message' => 'Account deleted']);
?>
```

Frontend: Añadir botón en Settings

---

### [ ] 12. Responsive Design (3-4 horas)

**Archivos a modificar:**
- [ ] `frontend/src/views/1v1.ts` (ajustar canvas para mobile)
- [ ] Usar clases Tailwind: `sm:`, `md:`, `lg:`
- [ ] Probar en Chrome DevTools → Toggle device toolbar

**Ejemplo:**
```typescript
// En lugar de canvas fijo:
<canvas id="pongCanvas" width="720" height="400"></canvas>

// Usar responsive:
<canvas id="pongCanvas" class="w-full max-w-3xl h-auto"></canvas>
```

---

### [ ] 13. Game Customization (3-4 horas)

Archivo nuevo: `frontend/src/utils/GameSettings.ts`

```typescript
interface GameSettings {
  ballSpeed: number;
  paddleColor: string;
  theme: 'classic' | 'dark' | 'neon';
}

export function getSettings(): GameSettings {
  const settings = localStorage.getItem('gameSettings');
  return settings ? JSON.parse(settings) : {
    ballSpeed: 3.5,
    paddleColor: '#ffffff',
    theme: 'classic'
  };
}

export function saveSettings(settings: GameSettings): void {
  localStorage.setItem('gameSettings', JSON.stringify(settings));
}
```

Añadir UI en Settings para cambiar opciones.

---

## 📅 DÍA ANTES DE EVALUACIÓN

### [ ] Checklist Final

- [ ] `git status` → Working tree clean
- [ ] `git log` → No hay credenciales committeadas
- [ ] `make clean-all && make init` → Funciona sin errores
- [ ] `docker ps` → Todos los servicios healthy
- [ ] https://localhost:9443 → Accesible
- [ ] Registro + Login + Juego → Funciona
- [ ] SPA con botón Back → Funciona
- [ ] Firefox → Compatible
- [ ] Consola (F12) → Sin errores críticos
- [ ] `docker logs` de cada servicio → Sin errores graves

### [ ] Preparar Documentación

- [ ] README.md actualizado
- [ ] MODULES.md creado
- [ ] AUDITORIA_TRANSCENDENCE.md revisado
- [ ] Saber explicar arquitectura (4 redes Docker, microservicios)

### [ ] Preparar Demo

- [ ] Terminal listo con `make init`
- [ ] Navegador en https://localhost:9443
- [ ] Grafana en http://localhost:3001/grafana
- [ ] Usuario de prueba creado
- [ ] Saber jugar partida completa de Pong

---

## 🎓 DURANTE LA EVALUACIÓN

### [ ] Mostrar

1. [ ] **Despliegue:** `make init` en vivo
2. [ ] **Arquitectura:** `docker ps` + explicar redes
3. [ ] **Juego:** Partida 1v1 completa (demostrar 2 jugadores mismo teclado)
4. [ ] **SPA:** Navegación con botón Back
5. [ ] **Seguridad:** 
   - [ ] HTTPS (candado navegador)
   - [ ] Código de `password_hash()`
   - [ ] JWT en localStorage
6. [ ] **Módulos:** Demostrar 7+ módulos mayores
7. [ ] **Monitoring:** Dashboard de Grafana

### [ ] Explicar

- [ ] Por qué PHP puro (requisito del subject base)
- [ ] Por qué Tailwind (módulo "frontend toolkit")
- [ ] Por qué microservicios (módulo DevOps)
- [ ] Por qué ELK y Prometheus (módulos de monitoring)
- [ ] Cómo funciona 2FA + JWT + OAuth2

---

## ⏱️ TIEMPO TOTAL ESTIMADO

- **P0 (crítico):** 6-8 horas
- **P1 (importante):** 8-10 horas
- **P2 (bonus):** 15-60 horas (según cuántos hagas)

**Mínimo para aprobar sólido:** 14-18 horas (P0 + P1)

---

**✅ Marcar cada ítem al completarlo**
**⚠️ P0 y P1 son OBLIGATORIOS antes de evaluación**
**🎁 P2 es opcional para subir nota**

*Última actualización: 9 de Diciembre de 2025*
