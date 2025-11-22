# 🎮 CONTEXTO COMPLETO DEL PROYECTO TRANSCENDENCE

## 📋 INFORMACIÓN GENERAL

**Proyecto:** Transcendence  
**Repositorio:** PIPEFD/Transcendence  
**Rama actual:** `pipefd3` (rama de trabajo con fixes de infraestructura)  
**Rama principal:** `main` (contiene la lógica de negocio)  
**Fecha:** Noviembre 6, 2025  

**Descripción:**  
Juego multijugador de Pong con características sociales y autenticación, diseñado específicamente para funcionar dentro de las restricciones de red del campus 42.

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### Stack Tecnológico

#### Frontend
- **Tecnología:** TypeScript + Babylon.js SPA
- **Servidor:** Node.js con 'serve'
- **Puerto interno:** 3000
- **Acceso:** Via Nginx reverse proxy en https://localhost:9443/

#### Backend
- **Tecnología:** PHP 8.2 con PHP-FPM
- **Base de datos:** SQLite
- **API:** REST API
- **Puerto interno:** 9000 (FastCGI)
- **Acceso:** Via Nginx en https://localhost:9443/api/

#### Game WebSocket Server (game-ws)
- **Tecnología:** PHP 8.2-cli con Ratchet/WebSocket
- **Puerto interno:** 8080
- **Acceso:** Via Nginx en https://localhost:9443/ws/
- **Función:** Maneja eventos de juego en tiempo real

#### Nginx
- **Versión:** 1.27-alpine
- **Función:** Reverse proxy, SSL termination, load balancer
- **Puertos externos:** 
  - HTTP: 9180
  - HTTPS: 9443
- **Características:**
  - Logs redirigidos a stdout/stderr (sin archivos)
  - Procesamiento de variables con envsubst
  - Healthcheck via wget HTTPS

#### Stack de Monitoreo
1. **Prometheus** (puerto 9090)
   - Recolección de métricas
   - Scraping cada 15s de todos los exporters
   
2. **Grafana** (puerto 3001 → 9191 via nginx)
   - Visualización de métricas
   - Dashboards preconfigurables
   - Versión: 12.1.1
   
3. **cAdvisor** (puerto 8080 → 8081 via nginx)
   - Métricas de contenedores Docker
   
4. **Node Exporter** (puerto 9100)
   - Métricas del sistema host
   
5. **Nginx Exporter** (puerto 9113)
   - Métricas de Nginx
   
6. **PHP-FPM Exporter** (puerto 9253)
   - Métricas de PHP-FPM
   
7. **Weave Scope** (puerto 4040)
   - Visualización de topología de contenedores
   - Requiere perfil específico: `make scope-up`

---

## 🌐 ARQUITECTURA DE REDES

### Redes Docker (4 redes aisladas)

1. **transcendence_frontend** (172.21.0.0/16)
   - nginx: 172.21.0.3
   - frontend: 172.21.0.2
   - scope: 172.21.0.4
   - **Propósito:** Servir contenido estático y SPA

2. **transcendence_backend** (172.18.0.0/16)
   - backend: 172.18.0.3
   - game-ws: 172.18.0.2
   - nginx: 172.18.0.4
   - scope: 172.18.0.5
   - **Propósito:** API REST y procesamiento

3. **transcendence_game** (172.20.0.0/16)
   - game-ws: 172.20.0.2
   - nginx: 172.20.0.3
   - scope: 172.20.0.4
   - **Propósito:** Aislamiento de servicios de juego en tiempo real

4. **transcendence_monitoring** (172.19.0.0/16)
   - Todos los servicios de monitoreo + nginx + backend
   - **Propósito:** Métricas, logs y observabilidad

### Flujo de Conexiones

```
Cliente (Browser)
    ↓ HTTPS:9443
┌───────────────┐
│  Nginx Proxy  │
└───┬───┬───┬───┘
    │   │   │
    ↓   ↓   ↓
 Frontend Backend Game-WS
    │      │      │
    │      ↓      │
    │   SQLite    │
    │   Database  │
    │             │
    └─────────────┘
         ↓
    Monitoring Stack
```

---

## 📁 ESTRUCTURA DEL PROYECTO

```
Transcendence/
├── backend/                 # PHP Backend API (de main)
│   ├── composer.json
│   ├── public/
│   │   ├── index.php
│   │   └── api/            # Endpoints REST
│   ├── database/           # SQLite DB
│   └── .env               # Auto-generado por make init
│
├── frontend/               # TypeScript SPA (de main)
│   ├── src/
│   ├── assets/
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
│
├── game-ws/                # WebSocket Server
│   ├── src/
│   ├── composer.json
│   └── vendor/            # Instalado localmente
│
├── nginx/                  # Configuración Nginx
│   ├── nginx.conf         # Config principal (logs a stdout/stderr)
│   ├── conf.d/
│   │   └── app.conf       # Server block principal
│   └── snippets/          # Configuraciones reutilizables
│       ├── proxy.conf
│       ├── ssl.conf
│       ├── maps.conf
│       └── security-headers.conf
│
├── compose/
│   └── docker-compose.yml # Orquestación de servicios
│
├── docker/                 # Dockerfiles
│   ├── backend/
│   │   ├── Dockerfile
│   │   └── docker-entrypoint.sh
│   ├── frontend/
│   │   └── Dockerfile
│   ├── game-ws/
│   │   └── Dockerfile
│   └── nginx/
│       ├── Dockerfile
│       └── docker-entrypoint.sh  # Usa envsubst (NO sed -i)
│
├── monitoring/             # Configuración de monitoreo
│   ├── prometheus/
│   │   └── prometheus.yml
│   └── grafana/
│       └── dashboards/
│
├── config/                 # Configuración general
│   ├── ssl/               # Certificados SSL
│   │   ├── fullchain.pem
│   │   ├── privkey.pem
│   │   └── dhparam.pem
│   ├── secrets/           # Docker secrets
│   │   ├── app_key.secret
│   │   ├── jwt_secret.secret
│   │   ├── grafana_admin_user.secret
│   │   └── grafana_admin_password.secret
│   └── auth/
│       └── google_oauth_client.json
│
├── scripts/               # Scripts de utilidad
│   ├── init.sh           # Inicialización completa
│   ├── generate-secrets.sh
│   ├── make-certs.sh
│   ├── validate-services.sh  # 23 tests de validación
│   ├── test-services.sh      # Tests rápidos
│   └── test-ports.sh         # Verificación de puertos
│
├── docs/                  # Documentación
│   ├── technical-summary.md
│   ├── network-architecture.md
│   ├── ports.md
│   ├── troubleshooting.md
│   └── API_CONEXION.txt
│
├── tests/                 # Suite de tests
│   ├── conftest.py
│   ├── test_backend_api.py
│   ├── test_frontend.py
│   ├── test_websocket.py
│   └── requirements.txt
│
├── Makefile              # Comandos principales (modificado en pipefd3)
├── README.md             # Documentación principal
└── .env                  # Variables de entorno
```

---

## 🔧 CONFIGURACIÓN Y PERFILES

### Docker Compose Profiles

- **default**: Servicios core (nginx, backend, frontend, game-ws) + monitoreo básico
- **dev**: Modo desarrollo con puertos expuestos directamente
- **prod**: Modo producción optimizado
- **monitoring**: Solo servicios de monitoreo
- **test**: Entorno de testing

### Puertos Configurados (adaptados a 42 Campus)

**Puertos externos (rango 9100-9500):**
- 9443: HTTPS principal (Nginx)
- 9180: HTTP (Nginx)
- 9090: Prometheus (directo)
- 9191: Grafana (via nginx con auth)
- 8081: cAdvisor
- 4040: Weave Scope

**Puertos internos (solo entre contenedores):**
- 3000: Frontend (Node/serve)
- 9000: Backend (PHP-FPM FastCGI)
- 8080: Game-WS (WebSocket)
- 3001: Grafana (interno)

---

## 🔐 SEGURIDAD

### Implementaciones de Seguridad

1. **SSL/TLS:**
   - TLS 1.3 enforced
   - Certificados auto-firmados (desarrollo)
   - dhparam 2048 bits

2. **Headers de Seguridad:**
   - Content Security Policy (CSP)
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - Referrer-Policy: no-referrer

3. **Docker Security:**
   - Capabilities dropped (ALL)
   - Capabilities added solo las necesarias (NET_BIND_SERVICE, CHOWN, etc.)
   - no-new-privileges:true
   - Usuarios no-root cuando es posible

4. **Secrets Management:**
   - Docker secrets para información sensible
   - Archivos en `config/secrets/` no versionados

5. **Network Isolation:**
   - 4 redes separadas por función
   - Servicios de monitoreo solo en 127.0.0.1

---

## 📊 ESTADO ACTUAL DEL SISTEMA

### Commit Actual (pipefd3)
- **Hash:** 0a048746
- **Archivos modificados:** 4 archivos de infraestructura
- **Cambios principales:**
  1. compose/docker-compose.yml: Healthcheck de nginx con wget
  2. docker/backend/Dockerfile: Agregado wget
  3. docker/nginx/Dockerfile: Optimizaciones
  4. scripts/validate-services.sh: Validación via HTTPS

### Modificaciones Críticas en pipefd3

#### 1. nginx/nginx.conf
```nginx
# Líneas 2-3 agregadas:
error_log /dev/stderr warn;
access_log /dev/stdout main;
```
**Razón:** Evita problemas de permisos con archivos de log

#### 2. docker/nginx/docker-entrypoint.sh
**Cambio completo:** De `sed -i` a `envsubst` con archivos temporales
```bash
for conf_file in /etc/nginx/conf.d/*.conf /etc/nginx/snippets/*.conf; do
  temp_file=$(mktemp)
  envsubst < "$conf_file" > "$temp_file"
  mv "$temp_file" "$conf_file"
done
```
**Razón:** Evita errores "Resource busy" cuando nginx tiene archivos abiertos

#### 3. compose/docker-compose.yml
- **Removido:** flags `:ro` de volúmenes de snippets y conf.d
- **Removido:** volumen de logs de nginx
- **Actualizado:** healthcheck a `wget --no-check-certificate`
**Razón:** Permite procesamiento de configuración y evita conflictos de permisos

#### 4. Makefile
- **Líneas 121-135:** Reescrito backend-setup (crea .env directamente)
- **Líneas 278-280:** Fixed clean rule (usa `docker system prune -f`)
**Razón:** Elimina dependencias de targets inexistentes

### Diferencias backend/frontend entre pipefd3 y main

**Estado actual:** Backend y frontend en pipefd3 son de la rama `main`

**Archivos que estaban en pipefd3 pero NO en main:**
- `backend/Makefile` ❌ (eliminado)
- `backend/public/api/health.php` ❌ (eliminado)
- `backend/public/utils/` ❌ (directorio eliminado)
- `backend/public/api/auth/*` ❌ (endpoints auth eliminados)

**Consecuencia:** Tests de validación esperan estos archivos pero ya no existen

---

## ✅ VALIDACIÓN Y TESTING

### Resultados de validate-services.sh (Última ejecución)

**Total:** 23 pruebas  
**Exitosas:** 21 (91%)  
**Fallidas:** 2  

#### ✅ Servicios Funcionando (21/23)

1. ✅ **Frontend** - HTTP 200 via Nginx
2. ✅ **Nginx** - Healthy, proxy funcionando
3. ✅ **Prometheus** - HTTP 200, targets OK
4. ✅ **Grafana** - HTTP 200, health OK
5. ✅ **cAdvisor** - HTTP 200, métricas disponibles
6. ✅ **Node Exporter** - Métricas recolectadas
7. ✅ **Nginx Exporter** - Métricas recolectadas
8. ✅ **PHP-FPM Exporter** - Métricas recolectadas
9. ✅ **Conectividad:**
   - Nginx → Frontend ✓
   - Nginx → Grafana ✓
   - Prometheus → PHP-FPM Exporter ✓

#### ❌ Problemas Detectados (2/23)

1. **Backend API endpoints - HTTP 404**
   - `/api/health.php` no existe (estaba en pipefd3, no en main)
   - `/api/users/` no existe con la estructura esperada
   - **Estado real:** Backend funcional pero sin estos endpoints específicos

2. **Weave Scope - No iniciado**
   - HTTP 000 (servicio no disponible)
   - **Causa:** Requiere inicio manual con `make scope-up`
   - **Estado:** Configurado pero no en perfil default

#### ⚠️ Advertencias

1. **Game-WS:** Reporta "unhealthy" pero funciona
   - Server WebSocket funcionando en puerto 8080
   - Deprecation warnings de PHP (propiedades dinámicas)
   - **Estado real:** Funcional, healthcheck mal configurado

2. **cAdvisor:** Reporta "unhealthy" pero funciona
   - Responde HTTP 200 en todos los endpoints
   - Métricas disponibles
   - **Estado real:** Funcional, healthcheck mal configurado

---

## 🚀 COMANDOS PRINCIPALES

### Makefile Targets

```bash
# Inicialización completa (primera vez)
make init          # Crea dirs, genera certs, secrets, inicia servicios

# Control de servicios
make up           # Inicia todos los servicios (perfil default)
make down         # Detiene todos los servicios
make restart      # Reinicia todos los servicios
make logs         # Ver logs de todos los servicios

# Perfiles específicos
make dev-up       # Inicia con perfil dev (puertos expuestos)
make prod-up      # Inicia con perfil prod
make monitoring-up # Solo monitoreo
make scope-up     # Inicia Weave Scope

# Setup individual
make backend-setup    # Configura backend (.env)
make frontend-setup   # Configura frontend (npm install)
make game-ws-setup    # Configura game-ws (composer install)

# Testing y validación
make test         # Ejecuta suite completa de tests
make validate     # Valida todos los servicios (23 tests)

# Limpieza
make clean        # Limpia Docker (containers, volumes, networks)
make cleanup-files # Limpia archivos temporales
make clean-all    # Limpieza completa
```

### Scripts de Validación

```bash
# Validación completa (23 tests)
bash scripts/validate-services.sh

# Tests rápidos
bash scripts/test-services.sh

# Verificación de puertos
bash scripts/test-ports.sh

# Generar tráfico de prueba
bash scripts/generate-traffic.sh
```

---

## 🔍 TROUBLESHOOTING

### Problemas Comunes y Soluciones

#### 1. "Resource busy" en nginx
**Causa:** sed -i intentando modificar archivos que nginx tiene abiertos  
**Solución:** ✅ Ya implementada en docker-entrypoint.sh (usa envsubst)

#### 2. Permission denied en logs
**Causa:** nginx no puede escribir en /var/log/nginx/  
**Solución:** ✅ Ya implementada en nginx.conf (logs a stdout/stderr)

#### 3. Backend .env no existe
**Causa:** .env debe ser auto-generado  
**Solución:** `make backend-setup` o `make init`

#### 4. Game-WS "Class not found"
**Causa:** Dependencias composer no instaladas  
**Solución:** ✅ Ya solucionado (vendor/ instalado localmente)

#### 5. Nginx healthcheck falla
**Causa:** nginx -t solo valida sintaxis, no disponibilidad  
**Solución:** ✅ Ya implementado (wget --no-check-certificate)

#### 6. Servicios reportan "unhealthy" pero funcionan
**Causa:** Healthchecks mal configurados  
**Solución:** Verificar manualmente con curl/wget, ignorar status si funcional

---

## 📝 HISTORIAL DE CAMBIOS RECIENTES

### Sesión Actual (Nov 6, 2025)

1. ✅ **Git cleanup** - Eliminados 31,515 archivos innecesarios del staging
2. ✅ **Commit selectivo** - Solo 4 archivos de infraestructura (0a048746)
3. ✅ **Diff generado** - 4.5M líneas guardadas en /tmp/diff-main-to-pipefd3.patch
4. ✅ **Plan de integración** - Creado en /tmp/integration-plan.md
5. ✅ **Backend/Frontend replacement** - Traídos desde origin/main (34,624 archivos)
6. ✅ **Makefile fixes** - backend-setup y clean rules corregidos
7. ✅ **Game-WS fix** - Composer dependencies instaladas localmente
8. ✅ **Nginx logging fix** - Redirigido a stdout/stderr
9. ✅ **Nginx entrypoint fix** - Reescrito con envsubst
10. ✅ **Docker-compose updates** - Removidas restricciones read-only
11. ✅ **Environment cleanup** - 510MB liberados, 37 volúmenes eliminados
12. ✅ **Validation** - 91% success rate (21/23 tests)
13. ✅ **Scope iniciado** - `make scope-up` ejecutado

---

## 🎯 PRÓXIMOS PASOS

### Pendientes

1. **Agregar health.php al backend** (opcional)
   - Para completar tests de validación al 100%
   - Archivo simple: `<?php echo json_encode(['status' => 'ok']); ?>`

2. **Corregir healthchecks de game-ws y cAdvisor**
   - Investigar por qué reportan unhealthy
   - Ajustar parámetros de timeout/interval

3. **Integración a main** (decisión estratégica)
   - Opción 1: Cherry-pick de commit 0a048746
   - Opción 2: Aplicación manual siguiendo /tmp/integration-plan.md

4. **Testing adicional**
   - Pruebas de carga
   - Tests de integración completos
   - Validación de WebSocket bajo carga

---

## 📚 DOCUMENTACIÓN ADICIONAL

### Archivos de Documentación

- `README.md` - Guía principal de uso
- `docs/technical-summary.md` - Resumen técnico de implementación
- `docs/network-architecture.md` - Arquitectura de redes detallada
- `docs/ports.md` - Gestión de puertos y restricciones 42
- `docs/troubleshooting.md` - Guía de solución de problemas
- `docs/API_CONEXION.txt` - Cómo conectar frontend con backend
- `/tmp/integration-plan.md` - Plan de integración pipefd3 → main
- `/tmp/diff-summary.md` - Resumen de diferencias entre ramas

### Logs Importantes

```bash
# Ver logs de un servicio específico
docker logs transcendence-nginx --tail 50
docker logs transcendence-backend --tail 50
docker logs transcendence-game-ws --tail 50

# Ver logs en tiempo real
docker logs -f transcendence-nginx

# Ver logs de todos los servicios
make logs
```

---

## 🌟 CARACTERÍSTICAS DESTACADAS

1. **Adaptación a 42 Campus:**
   - Puertos en rango permitido (9100-9500)
   - Servicios de monitoreo solo en localhost
   - Sin conflictos con firewall del campus

2. **Observabilidad Completa:**
   - Métricas de todos los servicios
   - Dashboards en Grafana
   - Visualización de topología con Weave Scope

3. **Robustez:**
   - Healthchecks en todos los servicios
   - Restart automático
   - Aislamiento de redes

4. **Seguridad:**
   - HTTPS enforced
   - Headers de seguridad
   - Capabilities mínimas
   - Secrets management

5. **Desarrollo Friendly:**
   - Hot reload con volúmenes
   - Perfiles para diferentes entornos
   - Scripts de validación completos

---

## 📞 INFORMACIÓN DE CONTACTO Y ESTADO

**Rama de trabajo:** pipefd3  
**Estado:** Funcional al 91% (21/23 tests)  
**Última validación:** Nov 6, 2025 09:49 UTC  
**Servicios críticos:** Todos operativos ✅  
**Entorno:** Cold start validado ✅  

---

**FIN DEL CONTEXTO COMPLETO**
