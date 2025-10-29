# 🔍 Visualización de Conexiones en Weave Scope

## 📊 ¿Por qué las Conexiones no se ven constantemente?

### Problema Identificado:

**Weave Scope solo muestra conexiones TCP activas en tiempo real**. A diferencia de Prometheus que hace scraping continuo (cada 15-30 segundos), las conexiones HTTP a través de Nginx son efímeras:

1. **HTTP/1.1 Keep-Alive**: Las conexiones se reutilizan pero se cierran después de inactividad
2. **Request/Response**: Nginx establece conexión → envía request → recibe response → cierra conexión
3. **Sin tráfico activo**: No hay conexiones TCP establecidas visibles

### Diferencia con Prometheus:

```
Prometheus → Scrapers continuos cada 15s → Conexiones siempre visibles
    ├─> nginx-exporter (puerto 9113)
    ├─> php-fpm-exporter (puerto 9253)
    ├─> cadvisor (puerto 8080)
    └─> node-exporter (puerto 9100)

Nginx → Proxy HTTP → Conexiones efímeras solo durante requests
    ├─> frontend (puerto 3000)
    ├─> backend (puerto 9000)
    ├─> grafana (puerto 3000)
    └─> game-ws (puerto 8080)
```

## 🔧 Soluciones para Visualizar Conexiones

### Opción 1: Generar Tráfico Continuo (Desarrollo)

```bash
# Ejecutar script de generación de tráfico
./scripts/generate-traffic.sh
```

Este script genera peticiones HTTP cada 2 segundos a todos los servicios.

### Opción 2: Health Checks más Frecuentes

Modificar el `docker-compose.yml` para hacer health checks más frecuentes:

```yaml
healthcheck:
  interval: 5s  # En lugar de 30s
  timeout: 5s
  retries: 3
```

### Opción 3: Configurar Nginx con Upstream Health Checks

Añadir health checks activos en Nginx (requiere Nginx Plus o módulo adicional):

```nginx
upstream backend {
    server backend:9000;
    check interval=5000 rise=2 fall=3 timeout=3000;
}
```

### Opción 4: Usar Prometheus Blackbox Exporter

Añadir un exporter que haga probes HTTP continuos:

```yaml
blackbox-exporter:
  image: prom/blackbox-exporter
  command:
    - '--config.file=/config/blackbox.yml'
```

## 📈 Estado Actual de las Redes

### Red `transcendence_backend` (172.18.0.0/16)
- transcendence-backend (172.18.0.3)
- transcendence-game-ws (172.18.0.2)
- transcendence-nginx (172.18.0.4)
- transcendence-scope (172.18.0.5)

### Red `transcendence_frontend` (172.21.0.0/16)
- transcendence-frontend (172.21.0.2)
- transcendence-nginx (172.21.0.3)
- transcendence-scope (172.21.0.4)

### Red `transcendence_monitoring` (172.19.0.0/16)
- transcendence-cadvisor (172.19.0.2)
- transcendence-prometheus (172.19.0.3)
- transcendence-node-exporter (172.19.0.4)
- transcendence-backend (172.19.0.5)
- transcendence-php-fpm-exporter (172.19.0.6)
- transcendence-grafana (172.19.0.7)
- transcendence-nginx-exporter (172.19.0.8)
- transcendence-nginx (172.19.0.9)
- transcendence-scope (172.19.0.10)

## ✅ Verificación de Conectividad

### Comando para verificar conexiones activas:

```bash
# Ver todas las redes
docker network ls | grep transcendence

# Ver contenedores en cada red
docker network inspect transcendence_backend -f '{{range .Containers}}{{.Name}} {{end}}'
docker network inspect transcendence_frontend -f '{{range .Containers}}{{.Name}} {{end}}'
docker network inspect transcendence_monitoring -f '{{range .Containers}}{{.Name}} {{end}}'

# Generar tráfico y ver en Weave Scope
./scripts/generate-traffic.sh
```

## 🎯 Conclusión

Las redes están **correctamente configuradas**. La falta de visualización de conexiones en Weave Scope es **normal** porque:

1. **HTTP es stateless**: Las conexiones se abren y cierran rápidamente
2. **Nginx usa connection pooling**: Pero las cierra tras inactividad
3. **Prometheus tiene conexiones persistentes**: Por eso siempre se ven

Para ver las conexiones de Nginx en Weave Scope:
- **Generar tráfico activo**: Usar el script `generate-traffic.sh`
- **Refrescar la vista**: Weave Scope actualiza cada pocos segundos
- **Ver en el momento de las peticiones**: Las conexiones aparecen durante los requests
