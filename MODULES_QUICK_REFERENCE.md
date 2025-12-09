# 🎯 MÓDULOS - Guía Rápida para Evaluador

**Para defensa ft_transcendence**  
**Score objetivo: 125/125**

---

## 📊 TABLA DE MÓDULOS IMPLEMENTADOS

### MÓDULOS MAYORES (11 implementados - necesitas 7 para 100%)

| # | Módulo | Categoría | Cómo Demostrarlo | Archivos Clave |
|---|--------|-----------|------------------|----------------|
| 1 | **Standard User Management** | User Mgmt | Registro → Login → Perfil → Historial matches → Stats | `users.php`, `login.php`, `Profile.ts`, `MatchHistory.ts` |
| 2 | **OAuth 2.0 Google** | User Mgmt | Login con Google (botón OAuth) | `gmail_api/setup_gmail.php`, `google/apiclient` |
| 3 | **Remote Players** | Gameplay | Jugar online contra otro jugador via WebSocket | `1v1o.ts`, `invite_online.ts`, game-ws |
| 4 | **Multiplayer (3-4 jugadores)** | Gameplay | Jugar 3 jugadores o 4 jugadores simultáneos | `3players.ts`, `4players.ts` |
| 5 | **Live Chat** | Gameplay | Chat en tiempo real durante juego | `Chat.ts`, `game-ws/chat.php` |
| 6 | **AI Opponent** | AI-Algo | Jugar vs IA (modo vs AI) | `vsIA.ts` |
| 7 | **Stats Dashboard** | AI-Algo | Ver estadísticas, gráficos Grafana | `Statistics.ts`, Grafana dashboards |
| 8 | **2FA + JWT** | Cybersec | Login con código 2FA email + JWT tokens | `verify_2fa.php`, `jwt_secret` |
| 9 | **ELK (Logs)** | DevOps | Elasticsearch + Logstash + Kibana funcionando | `elk/`, profile "elk" |
| 10 | **Prometheus + Grafana** | DevOps | Métricas en tiempo real, dashboards | http://localhost:9090, http://localhost:3001/grafana |
| 11 | **Microservices** | DevOps | Arquitectura con 4+ servicios independientes | docker-compose: frontend, backend, game-ws, nginx |

### MÓDULOS MENORES (3 implementados - 2 menores = 1 mayor)

| # | Módulo | Categoría | Cómo Demostrarlo | Archivos Clave |
|---|--------|-----------|------------------|----------------|
| 12 | **Database (SQLite)** | Web | Base de datos para usuarios/torneos/matches | `backend/database/database.sqlite`, `schema.sql` |
| 13 | **Tailwind CSS** | Web | Framework CSS utilizado en frontend | `package.json`: tailwindcss 3.4.1 |
| 14 | **Multi-language** | Accessibility | Cambiar idioma: Inglés, Español, Francés | `translations/`: en.ts, es.ts, fr.ts |

---

## ✅ REQUISITOS OBLIGATORIOS - Checklist Rápido

| Requisito | Cómo Validar | ✅/❌ |
|-----------|--------------|-------|
| **SPA con Back/Forward** | Navegar → Clic Back navegador → Vuelve a página anterior sin reload | ✅ |
| **TypeScript Frontend** | Ver `tsconfig.json`, archivos `.ts` en `frontend/src/` | ✅ |
| **PHP puro Backend** | Ver `backend/`, no hay Laravel/Symfony/frameworks | ✅ |
| **Docker: un comando** | `make init` o `docker compose up` levanta todo | ✅ |
| **Pong 2 jugadores local** | Jugar local: W/S para P1, ↑/↓ para P2 | ✅ |
| **Sistema torneo** | Torneo 4 jugadores con alias | ✅ |
| **HTTPS/TLS** | Ver candado en https://localhost:9443 | ✅ |
| **Passwords hasheadas** | Ver DB: campo `pass` es hash bcrypt | ✅ |
| **SQL Injection protected** | Ver código: prepared statements en `login.php`, `users.php` | ✅ |
| **XSS protected** | ⚠️ **REVISAR** después de fix P0.1 | ⚠️ |
| **Firefox compatible** | Abrir en Firefox y probar | ⚠️ |

---

## 🎮 FUNCIONALIDADES A DEMOSTRAR EN DEFENSA

### 1. Inicio del Sistema (5 min)
```bash
make clean-all  # Limpiar
make init       # Inicializar todo
# Esperar ~2-3 min a que levante
```

### 2. Acceso Web (1 min)
- Abrir https://localhost:9443
- Aceptar certificado auto-firmado
- Ver landing page

### 3. Registro y Login (3 min)
- Registrar usuario nuevo
- Logout
- Login con usuario
- Recibir código 2FA por email
- Ingresar código 2FA
- Ver perfil

### 4. Pong Local (2 min)
- Menu → Jugar → Local 1v1
- Jugar con W/S (P1) y ↑/↓ (P2)
- Demostrar que ambos paddles responden

### 5. Pong vs AI (2 min)
- Menu → Jugar → vs AI
- Jugar contra IA
- Mostrar que IA sigue la pelota

### 6. Torneo (5 min)
- Menu → Torneo → 4 jugadores
- Registrar 4 alias
- Jugar bracket completo
- Ver ganador

### 7. Multijugador Online (3 min)
- Abrir 2 navegadores
- Login con 2 usuarios diferentes
- Invitar a juego online
- Jugar via WebSocket

### 8. Chat (2 min)
- Abrir chat
- Enviar mensaje
- Ver tiempo real

### 9. Stats y Historial (2 min)
- Ver perfil → Estadísticas
- Ver historial de matches
- Mostrar ranking/ladder

### 10. Grafana/Prometheus (2 min)
- Abrir http://localhost:3001/grafana
- Login (admin / ver secret)
- Mostrar dashboards
- Abrir http://localhost:9090
- Mostrar métricas Prometheus

---

## 🔢 CÁLCULO DE PUNTOS

### Base (100 puntos)
- ✅ Requisitos obligatorios cumplidos
- ✅ 7 módulos mayores mínimos

### Bonus (hasta 25 puntos)
- 11 módulos mayores implementados
- 3 módulos menores (= 1.5 mayores)
- **Total equivalente:** 12.5 módulos mayores
- **Bonus:** (12.5 - 7) × ~4.5 pts/módulo = **~25 pts**

### TOTAL: **125 / 125** ✅

---

## ⚠️ PUNTOS DE ATENCIÓN PARA EVALUADOR

### ✅ Fortalezas a Destacar
- Arquitectura limpia con Docker microservicios
- 4 redes aisladas (segmentación)
- TypeScript strict mode
- PHP puro sin frameworks prohibidos
- bcrypt para passwords
- Prepared statements (SQL Injection)
- HTTPS/TLS configurado
- JWT + 2FA implementado
- OAuth2 Google funcional
- WebSocket para tiempo real
- Monitoreo DevOps completo

### ⚠️ Puntos a Validar
- **XSS:** Verificar que se arregló sanitización (P0.1)
- **Firefox:** Probar que funciona en Firefox
- **Velocidad AI:** Verificar que AI y jugador tienen misma velocidad
- **OAuth fallback:** Si Google OAuth falla, debe permitir login normal
- **Gmail fallback:** Si Gmail API falla, mostrar código 2FA alternativo

### 🔴 Flags Rojas (Descalificación)
- Credenciales en código fuente
- HTTPS no funciona
- Passwords en texto plano
- No levanta con `docker compose up`
- Errores 500 al iniciar
- Crash al registrar/login

---

## 📞 URLs DE SERVICIOS

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| Frontend | https://localhost:9443 | - |
| Grafana | http://localhost:3001/grafana | admin / (ver `config/secrets/grafana_admin_password.secret`) |
| Prometheus | http://localhost:9090 | - |
| Weave Scope | http://localhost:9584 | admin / (ver `config/secrets/scope_htpasswd.secret`) |
| cAdvisor | http://localhost:8081/cadvisor | - |

---

## 🏁 CHECKLIST FINAL EVALUADOR

- [ ] Proyecto clonado en máquina limpia
- [ ] `make init` ejecutado sin errores
- [ ] https://localhost:9443 accesible
- [ ] Registro funciona
- [ ] Login + 2FA funciona
- [ ] Pong local 1v1 funciona
- [ ] Pong vs AI funciona
- [ ] Torneo funciona
- [ ] Juego online funciona
- [ ] Chat funciona
- [ ] Back/Forward navegador funcionan
- [ ] Grafana/Prometheus accesibles
- [ ] 11 módulos mayores demostrados
- [ ] 3 módulos menores demostrados
- [ ] Seguridad: HTTPS, bcrypt, no XSS
- [ ] Firefox compatible

**Si todo ✅ → 125/125 puntos** 🎉

---

## 📚 DOCUMENTOS DE REFERENCIA

1. **`AUDIT_SUMMARY.md`** - Resumen ejecutivo con issues P0
2. **`AUDIT_FT_TRANSCENDENCE.md`** - Auditoría completa detallada (556 líneas)
3. **`README.md`** - Instrucciones de instalación y uso
4. **`CONTEXTO_COMPLETO_PROYECTO.md`** - Arquitectura del sistema

---

**Última actualización:** 2025-12-09  
**Para defensa de:** PIPEFD/Transcendence
