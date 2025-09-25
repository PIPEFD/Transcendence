# Transcendence

Proyecto de juego multijugador de Pong con funcionalidades sociales y de autenticación.

## Arquitectura

- **Frontend**: TypeScript/Babylon.js
- **Backend**: PHP-FPM con REST API y SQLite
- **Game-WS**: Servidor WebSocket en PHP-CLI
- **Nginx**: HTTPS/WSS, proxy inverso y servidor web
- **Observabilidad**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Seguridad**: WAF con ModSecurity + OWASP CRS

## Requisitos Previos

- Docker y Docker Compose
- Git
- Acceso a Internet para descargar imágenes de Docker

## Inicio Rápido

Siga estos simples pasos para iniciar el proyecto:

1. Clone este repositorio:
   ```bash
   git clone https://github.com/PIPEFD/Transcendence.git
   cd Transcendence
   ```

2. Inicialice el entorno completo:
   ```bash
   make init
   ```
   Este comando:
   - Crea la estructura de directorios necesaria
   - Genera certificados SSL autofirmados
   - Crea un archivo `.env` con valores predeterminados
   - Inicia todos los servicios

3. Acceda a la aplicación:
   - **Frontend**: https://localhost
   - **Monitorización**:
     - Kibana: http://localhost:5601
     - Elasticsearch: http://localhost:9200
     - Grafana: https://localhost/grafana (si está activado)
     - Prometheus: https://localhost/prometheus (si está activado)

## Comandos Principales

El proyecto utiliza un sistema de Makefile simplificado:

```bash
# Mostrar ayuda con todos los comandos disponibles
make

# Inicializar el entorno completo
make init

# Iniciar todos los servicios
make up

# Detener todos los servicios
make down

# Reiniciar todos los servicios
make restart

# Ver los logs de todos los servicios
make logs

# Ejecutar pruebas automáticas
make test

# Limpiar recursos Docker sin usar
make clean

# Reiniciar completamente el entorno (elimina datos)
make reset
```

### Servicios Individuales

```bash
# Iniciar solo el frontend
make up-frontend

# Iniciar solo el backend
make up-backend

# Iniciar solo el servicio de juego
make up-game

# Iniciar solo el servidor nginx
make up-nginx

# Iniciar con el Web Application Firewall
make up-waf
```

## Estructura del Proyecto

- `backend/`: Código del backend en PHP
- `frontend/`: Código del frontend en TypeScript
- `game-ws/`: Servidor WebSocket para el juego
- `nginx/`: Configuración del servidor web
- `docker/`: Archivos Dockerfile
- `compose/`: Archivo Docker Compose principal
- `config/`: Configuraciones y secretos centralizados
- `monitoring/`: Configuración de Grafana y Prometheus
- `scripts/`: Scripts de utilidades y configuración
- `tests/`: Pruebas automatizadas
- `elk/`: Configuración de Elasticsearch, Logstash y Kibana
- `waf/`: Configuración del Web Application Firewall

## Desarrollo

### Frontend

El código fuente del frontend está en `frontend/src/`. Compile TypeScript a `frontend/dist/` con su bundler favorito (Vite/Webpack). NGINX servirá automáticamente lo que haya en `frontend/dist/`.

### Backend

El backend utiliza PHP-FPM y SQLite. El código fuente se encuentra en `backend/srcs/`. La API REST está disponible en la ruta `/api/`.

### WebSockets

El servidor WebSocket para el juego se ejecuta en PHP-CLI utilizando Ratchet. El código se encuentra en `game-ws/src/`. La conexión WebSocket está disponible en la ruta `/ws/game`.

## Seguridad

### Certificados SSL

Los certificados SSL se generan automáticamente durante la inicialización. Si necesita regenerarlos:

```bash
rm -rf config/ssl/*
make create-certs
```

### Web Application Firewall (WAF)

El proyecto incluye un WAF utilizando ModSecurity v3 y OWASP Core Rule Set (CRS):

```bash
# Iniciar con WAF
make up-waf
```

El nivel de paranoia del WAF se puede configurar con la variable de entorno `PARANOIA_LEVEL`:

```bash
PARANOIA_LEVEL=1 make up-waf  # Por defecto, menos estricto
PARANOIA_LEVEL=2 make up-waf  # Más estricto, puede requerir ajustes
```

## Pruebas Automatizadas

El proyecto incluye pruebas automatizadas unitarias y de integración:

```bash
# Ejecutar todas las pruebas
make test

# Ejecutar solo pruebas unitarias
make test-unit

# Ejecutar solo pruebas de integración
make test-integration
```

## Observabilidad

### Logs Centralizados (ELK Stack)

Los logs de todos los servicios se centralizan en Elasticsearch y pueden visualizarse en Kibana:

- Kibana: http://localhost:5601
- Elasticsearch: http://localhost:9200

### Métricas (Prometheus + Grafana)

Monitorización de métricas:

- Grafana: https://localhost/grafana
- Prometheus: https://localhost/prometheus

## Solución de Problemas

### Verificar Estado de los Servicios

```bash
make ps
```

### Ver Logs

```bash
# Ver todos los logs
make logs

# Ver logs de un servicio específico
docker logs transcendence-nginx
docker logs transcendence-backend
docker logs transcendence-frontend
docker logs transcendence-game-ws
```

### Reinicio de Servicios

Si encuentra problemas, pruebe a reiniciar los servicios:

```bash
make restart
```

### Entorno Inconsistente

Si el entorno está en un estado inconsistente, puede reiniciar completamente:

```bash
make reset
make init
```

### Limpieza del Proyecto

Se ha realizado una limpieza de archivos Docker Compose redundantes. Ahora el proyecto utiliza un único archivo `docker-compose.yml` que integra todos los servicios mediante perfiles.

Si necesita limpiar archivos o directorios adicionales:

```bash
./scripts/cleanup.sh
```

## Créditos

Desarrollado por PIPEFD