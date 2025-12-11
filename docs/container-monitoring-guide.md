# Monitoreo de Contenedores Docker con cAdvisor + Grafana

Este documento describe el sistema de monitoreo completo de contenedores Docker usando **cAdvisor** y **Grafana**, que reemplaza la funcionalidad de Weave Scope sin necesidad de permisos especiales.

## 🎯 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    CONTENEDORES DOCKER                  │
│  (nginx, frontend, backend, game-ws, prometheus, etc)  │
└───────────────────┬─────────────────────────────────────┘
                    │
                    │ Métricas de contenedores
                    ↓
            ┌───────────────┐
            │   cAdvisor    │ ← Recolecta métricas del Docker daemon
            │  Port: 8081   │    (CPU, RAM, Network, Disk I/O)
            └───────┬───────┘
                    │
                    │ Exporta métricas en formato Prometheus
                    ↓
            ┌───────────────┐
            │  Prometheus   │ ← Almacena series temporales
            │  Port: 9090   │    (scrape cada 15s)
            └───────┬───────┘
                    │
                    │ Query métricas
                    ↓
            ┌───────────────┐
            │   Grafana     │ ← Visualización y dashboards
            │  Port: 3001   │    (actualización cada 5s)
            └───────────────┘
```

## 📊 Dashboard Disponible

### **Transcendence - Docker Containers Monitor**

URL: `http://localhost:3001/d/transcendence-containers/`

**Paneles incluidos:**

1. **CPU Usage by Container** (Time Series)
   - Gráfico de uso de CPU por contenedor en %
   - Query: `rate(container_cpu_usage_seconds_total{name=~"transcendence-.*"}[5m]) * 100`
   - Actualización: 5 segundos

2. **Memory Usage by Container** (Time Series)
   - Uso de memoria en bytes por contenedor
   - Query: `container_memory_usage_bytes{name=~"transcendence-.*"}`
   - Formato: Bytes (automático: KB, MB, GB)

3. **Network I/O by Container** (Time Series)
   - Tráfico de red RX (recibido) y TX (transmitido)
   - Queries:
     - RX: `rate(container_network_receive_bytes_total{name=~"transcendence-.*"}[5m])`
     - TX: `rate(container_network_transmit_bytes_total{name=~"transcendence-.*"}[5m])`
   - Formato: Bytes/segundo

4. **Memory Usage % (vs Limit)** (Gauge)
   - Porcentaje de uso de memoria respecto al límite configurado
   - Query: `(container_memory_usage_bytes / container_spec_memory_limit_bytes) * 100`
   - Umbrales:
     - Verde: < 70%
     - Amarillo: 70-90%
     - Rojo: > 90%

5. **Disk I/O by Container** (Time Series)
   - Lectura y escritura en disco por contenedor
   - Queries:
     - Read: `rate(container_fs_reads_bytes_total{name=~"transcendence-.*"}[5m])`
     - Write: `rate(container_fs_writes_bytes_total{name=~"transcendence-.*"}[5m])`
   - Formato: Bytes/segundo

6. **Exporter Status** (Stat)
   - Estado UP/DOWN de todos los exporters
   - Query: `up{job=~".*exporter"}`
   - Indicador: Verde (Up) / Rojo (Down)

## 🚀 Acceso Rápido

### Opción 1: Script Automatizado

```bash
bash scripts/open-grafana.sh
```

Este script:
- ✅ Verifica que Grafana esté corriendo
- ✅ Muestra todas las URLs de acceso
- ✅ Muestra las credenciales
- ✅ Lista las métricas disponibles
- ✅ Opcionalmente abre el navegador

### Opción 2: Acceso Manual

```bash
# Obtener credenciales
cat config/secrets/grafana_admin_user
cat config/secrets/grafana_admin_password

# Acceder a:
# Dashboard: http://localhost:3001/d/transcendence-containers/
# Login: http://localhost:3001/login
```

## 📈 Servicios de Monitoreo

| Servicio | Puerto | URL | Función |
|----------|--------|-----|---------|
| **Grafana** | 3001 | http://localhost:3001 | Dashboards y visualización |
| **Prometheus** | 9090 | http://localhost:9090 | Base de datos de métricas |
| **cAdvisor** | 8081 | http://localhost:8081/cadvisor/ | UI de métricas directas |
| **Node Exporter** | 9100 | Métricas en Prometheus | Métricas del host |
| **Nginx Exporter** | 9113 | Métricas en Prometheus | Métricas de Nginx |
| **PHP-FPM Exporter** | 9253 | Métricas en Prometheus | Métricas de PHP-FPM |

## 🔍 Métricas Disponibles de cAdvisor

### CPU
- `container_cpu_usage_seconds_total` - Tiempo total de CPU usado
- `container_cpu_system_seconds_total` - Tiempo de CPU en modo kernel
- `container_cpu_user_seconds_total` - Tiempo de CPU en modo usuario
- `container_cpu_load_average_10s` - Carga promedio de CPU

### Memoria
- `container_memory_usage_bytes` - Uso actual de memoria
- `container_memory_working_set_bytes` - Working set de memoria
- `container_memory_rss` - RSS (Resident Set Size)
- `container_memory_cache` - Caché de memoria
- `container_spec_memory_limit_bytes` - Límite de memoria configurado

### Red
- `container_network_receive_bytes_total` - Bytes recibidos
- `container_network_transmit_bytes_total` - Bytes transmitidos
- `container_network_receive_packets_total` - Paquetes recibidos
- `container_network_transmit_packets_total` - Paquetes transmitidos
- `container_network_receive_errors_total` - Errores de recepción
- `container_network_transmit_errors_total` - Errores de transmisión

### Disco
- `container_fs_reads_bytes_total` - Bytes leídos del disco
- `container_fs_writes_bytes_total` - Bytes escritos al disco
- `container_fs_usage_bytes` - Uso de disco
- `container_fs_limit_bytes` - Límite de disco

## 🛠️ Configuración

### Archivos de Configuración

```
monitoring/grafana/
├── dashboards/
│   └── docker-containers.json          # Dashboard de contenedores
├── provisioning/
│   ├── dashboards/
│   │   └── dashboards.yml              # Configuración de provisioning
│   └── datasources/
│       └── prometheus.yml              # Datasource de Prometheus
```

### Docker Compose

```yaml
grafana:
  image: grafana/grafana:latest
  container_name: transcendence-grafana
  volumes:
    - ../monitoring/grafana/provisioning:/etc/grafana/provisioning:ro
    - ../monitoring/grafana/dashboards:/var/lib/grafana/dashboards:ro
    - grafana_data:/var/lib/grafana
  ports:
    - "127.0.0.1:3001:3000"
  environment:
    - GF_SERVER_ROOT_URL=%(protocol)s://%(domain)s/grafana/
    - GF_SERVER_SERVE_FROM_SUB_PATH=true
```

## 🎨 Personalización del Dashboard

### Agregar Nuevos Paneles

1. Acceder a Grafana: http://localhost:3001
2. Ir al dashboard de contenedores
3. Click en "Add panel"
4. Usar queries de Prometheus con métricas de cAdvisor
5. Guardar cambios

### Queries de Ejemplo

```promql
# Top 5 contenedores por uso de CPU
topk(5, rate(container_cpu_usage_seconds_total{name=~"transcendence-.*"}[5m]))

# Memoria total usada por todos los contenedores
sum(container_memory_usage_bytes{name=~"transcendence-.*"})

# Ancho de banda total (RX + TX)
sum(rate(container_network_receive_bytes_total{name=~"transcendence-.*"}[5m])) +
sum(rate(container_network_transmit_bytes_total{name=~"transcendence-.*"}[5m]))

# Contenedores usando más del 80% de su límite de memoria
(container_memory_usage_bytes / container_spec_memory_limit_bytes) > 0.8
```

## 🔧 Troubleshooting

### Grafana no muestra datos

```bash
# Verificar que Prometheus está scrapeando cAdvisor
curl http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | select(.job=="cadvisor")'

# Verificar que cAdvisor expone métricas
curl http://localhost:8081/cadvisor/metrics | grep container_cpu_usage
```

### Dashboard no aparece

```bash
# Verificar montaje de volúmenes
docker exec transcendence-grafana ls -la /var/lib/grafana/dashboards/

# Reiniciar Grafana
docker-compose -f compose/docker-compose.yml restart grafana
```

### Métricas faltantes

```bash
# Verificar logs de cAdvisor
docker logs transcendence-cadvisor --tail 50

# Verificar que los contenedores tienen labels/nombres correctos
docker ps --format "{{.Names}}" | grep transcendence
```

## 📊 Comparación con Weave Scope

| Característica | Weave Scope | cAdvisor + Grafana |
|----------------|-------------|---------------------|
| **Topología visual** | ✅ Excelente | ⚠️ No disponible |
| **Métricas en tiempo real** | ✅ Sí | ✅ Sí (5s refresh) |
| **Gráficos históricos** | ❌ Limitado | ✅ Excelente |
| **Alertas** | ❌ No | ✅ Sí (Grafana) |
| **Permisos requeridos** | ❌ Socket Docker privilegiado | ✅ Solo lectura |
| **Personalización** | ❌ Limitada | ✅ Total |
| **Exportación de datos** | ❌ Limitada | ✅ Completa |
| **Entorno 42 compatible** | ❌ Requiere sudo | ✅ Totalmente |

## 🎯 Ventajas de cAdvisor + Grafana

✅ **Sin permisos especiales** - Funciona sin acceso al socket Docker privilegiado  
✅ **Historial completo** - Prometheus almacena métricas con retención configurable  
✅ **Alertas personalizables** - Grafana permite crear alertas por email, Slack, etc  
✅ **Dashboards reutilizables** - JSON exportable y versionable  
✅ **Query poderoso** - PromQL permite análisis avanzados  
✅ **Escalable** - Prometheus puede federar múltiples instancias  
✅ **Estándar de industria** - Stack usado en producción por miles de empresas  

## 🔗 Referencias

- [cAdvisor Documentation](https://github.com/google/cadvisor/blob/master/docs/storage/prometheus.md)
- [Prometheus Queries](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Grafana Dashboards](https://grafana.com/docs/grafana/latest/dashboards/)
- [PromQL Cheat Sheet](https://promlabs.com/promql-cheat-sheet/)

## 📝 Mantenimiento

### Limpiar datos antiguos de Prometheus

```bash
# Editar retention time en compose/docker-compose.yml
# Por defecto: --storage.tsdb.retention.time=15d

# Reiniciar Prometheus
docker-compose -f compose/docker-compose.yml restart prometheus
```

### Backup de Dashboards

```bash
# Los dashboards están en:
monitoring/grafana/dashboards/*.json

# Hacer backup
cp -r monitoring/grafana/dashboards/ monitoring/grafana/dashboards.backup/
```

### Actualizar Grafana

```bash
# Pull nueva imagen
docker pull grafana/grafana:latest

# Recrear contenedor
docker-compose -f compose/docker-compose.yml up -d --force-recreate grafana
```
