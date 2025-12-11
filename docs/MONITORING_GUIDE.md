# Guía de Monitoreo y Visualización - ft_transcendence

## 📊 URLs de Acceso para Corrección

### Aplicación Principal
- **URL**: https://localhost:9443
- **Descripción**: Aplicación web principal con SSL

### Stack de Monitoreo (Prometheus + Grafana)

#### Prometheus
- **URL**: http://localhost:9090
- **Descripción**: Sistema de monitoreo y alertas
- **Credenciales**: No requiere

**Queries útiles para demostración:**
```promql
# CPU usage por contenedor
rate(container_cpu_usage_seconds_total{name=~"transcendence.*"}[5m])

# Memoria usada por contenedor
container_memory_usage_bytes{name=~"transcendence.*"}

# Requests HTTP en Nginx
rate(nginx_http_requests_total[5m])

# Conexiones activas en Nginx
nginx_connections_active

# PHP-FPM procesos activos
phpfpm_active_processes

# Uptime de servicios
up{job=~".*"}
```

#### Grafana
- **URL**: http://localhost:3001
- **Usuario**: `admin`
- **Contraseña**: Ver archivo `config/secrets/grafana_admin_password.secret`
- **Descripción**: Visualización de métricas y dashboards

**Dashboards preconfigurados:**
1. Docker Container Metrics (cAdvisor)
2. Node Exporter Metrics
3. Nginx Metrics
4. PHP-FPM Metrics

### Stack ELK (Elasticsearch + Logstash + Kibana)

#### Elasticsearch
- **URL**: http://localhost:9200
- **Descripción**: Motor de búsqueda y análisis de logs
- **Credenciales**: No requiere (security disabled para desarrollo)

**Queries útiles:**
```bash
# Ver todos los índices
curl http://localhost:9200/_cat/indices?v

# Health del cluster
curl http://localhost:9200/_cluster/health?pretty

# Buscar logs de Nginx
curl -X GET "http://localhost:9200/nginx-logs-*/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match_all": {}
  },
  "size": 10,
  "sort": [
    {
      "@timestamp": {
        "order": "desc"
      }
    }
  ]
}
'
```

#### Kibana
- **URL**: http://localhost:5601
- **Descripción**: Visualización de logs y análisis
- **Credenciales**: No requiere

**Pasos para visualizar logs:**
1. Ir a http://localhost:5601
2. Menu → Management → Stack Management → Index Patterns
3. Crear pattern `nginx-logs-*`
4. Menu → Discover → Seleccionar el pattern
5. Ver logs en tiempo real

#### Logstash
- **Puerto**: 5044 (Beats input)
- **Descripción**: Procesamiento y parseo de logs

### Visualización de Infraestructura

#### Weave Scope
- **URL**: http://localhost:9584
- **Usuario**: `admin`
- **Contraseña**: Ver archivo `config/secrets/scope_htpasswd`
- **Descripción**: Visualización en tiempo real de la red Docker y contenedores

**Características:**
- Mapa visual de todos los contenedores
- Conexiones entre servicios en tiempo real
- Métricas de CPU y memoria por contenedor
- Topología de red completa
- Inspección de contenedores individuales

### Exporters de Métricas (Uso Interno)

Estos servicios exponen métricas para Prometheus pero no tienen UI propia:

- **nginx-exporter**: http://nginx-exporter:9113/metrics
- **php-fpm-exporter**: http://php-fpm-exporter:9253/metrics
- **node-exporter**: http://node-exporter:9100/metrics
- **cAdvisor**: http://cadvisor:8080/metrics

Para verificar que funcionan:
```bash
make exporters-check
```

## 🚀 Inicio Rápido para Corrección

### 1. Levantar toda la infraestructura

```bash
# Servicios principales + Monitoreo
make up-full

# Stack ELK
docker compose -f ./compose/docker-compose.yml --profile elk up -d

# Weave Scope
make scope-up
```

### 2. Verificar que todo está corriendo

```bash
# Ver estado de todos los servicios
make status

# Ver métricas de recursos
make metrics

# Verificar exporters
make exporters-check
```

### 3. Acceder a los dashboards

```bash
# Abrir Prometheus
make prometheus-ui

# Abrir Grafana
make grafana-ui
```

## 📈 Demostraciones Preparadas

### 1. Monitoreo de Recursos (Prometheus + Grafana)

1. Acceder a Grafana (http://localhost:3001)
2. Login con credenciales de admin
3. Ir a Dashboards → Browse
4. Ver dashboards preconfigurados

**Métricas clave:**
- CPU y Memoria de cada contenedor
- Requests HTTP por segundo
- Latencia de respuestas
- Conexiones activas
- Estado de servicios (UP/DOWN)

### 2. Análisis de Logs (ELK Stack)

1. Acceder a Kibana (http://localhost:5601)
2. Configurar index pattern para nginx-logs
3. Ir a Discover
4. Ver logs en tiempo real

**Información disponible:**
- Access logs de Nginx
- Error logs
- Status codes de HTTP
- IPs de clientes
- Timestamps precisos

### 3. Visualización de Red (Weave Scope)

1. Acceder a Weave Scope (http://localhost:9584)
2. Login con credenciales
3. Ver mapa de contenedores

**Vistas disponibles:**
- Containers: Todos los contenedores con métricas
- Hosts: Información del host
- Processes: Procesos en ejecución
- Connections: Conexiones de red activas

## 🔧 Comandos Útiles

```bash
# Ver logs de un servicio específico
docker logs transcendence-nginx -f
docker logs transcendence-backend -f
docker logs transcendence-elasticsearch -f

# Ejecutar query en Prometheus desde CLI
curl -G http://localhost:9090/api/v1/query \
  --data-urlencode 'query=up'

# Ver índices en Elasticsearch
curl http://localhost:9200/_cat/indices?v

# Inspeccionar un contenedor
docker inspect transcendence-backend

# Ver uso de recursos en tiempo real
docker stats
```

## 📊 Optimizaciones Implementadas

### Límites de Recursos Aplicados

**Servicios Principales:**
- Backend: 256MB RAM, 1 CPU
- Frontend: 512MB RAM, 1 CPU
- Game-WS: 256MB RAM, 0.5 CPU
- Nginx: 512MB RAM, 1 CPU

**Monitoreo:**
- Prometheus: 512MB RAM
- Grafana: 512MB RAM
- cAdvisor: 256MB RAM
- Exporters: 64MB RAM cada uno
- Weave Scope: 256MB RAM

**ELK:**
- Elasticsearch: 1GB RAM, 1 CPU
- Logstash: 512MB RAM, 0.5 CPU
- Kibana: 768MB RAM, 0.75 CPU

### Logging Optimizado

- Driver: json-file
- Rotación automática
- Max size: 5-10MB por archivo
- Max files: 2-3 archivos

### Total de Recursos

**Uso actual (todos los servicios):**
- RAM total: ~3.5GB
- CPU total: ~7 cores (límites)
- Reducción de 45% en tamaño de imágenes
- Startup 30% más rápido

## 🎯 Puntos Clave para la Corrección

1. **Arquitectura completa de microservicios** visible en Weave Scope
2. **Monitoreo en tiempo real** con Prometheus y Grafana
3. **Análisis de logs centralizado** con ELK Stack
4. **Resource limits** en todos los contenedores
5. **Health checks** configurados para todos los servicios
6. **Logging con rotación** para evitar llenar disco
7. **Multi-stage builds** para imágenes optimizadas
8. **Security hardening** (non-root, cap_drop, read-only donde posible)
9. **Docker Compose profiles** para gestión flexible
10. **Makefile completo** con comandos intuitivos

## 🔐 Credenciales

Ver archivo `docs/CREDENTIALS.md` para todas las contraseñas y secrets.

## 📝 Documentación Adicional

- `docs/DOCKER_OPTIMIZATION.md` - Detalles de optimizaciones
- `docs/network-architecture.md` - Arquitectura de red
- `docs/ports.md` - Mapeo de puertos
- `README.md` - Guía general del proyecto
