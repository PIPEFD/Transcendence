# Solución de Problemas para Entornos de Desarrollo

Este documento proporciona soluciones a problemas comunes que pueden surgir al ejecutar Transcendence en entornos de desarrollo, especialmente en entornos de contenedores como GitHub Codespaces o Dev Containers.

## Problemas con Docker y Volúmenes

### Problema: Error en node-exporter
```
Error response from daemon: path / is mounted on / but it is not a shared or slave mount
```

**Solución**:
Se ha modificado la configuración de node-exporter para evitar montar el sistema de archivos raíz. En lugar de eso, ahora usamos:
```yaml
node-exporter:
  image: prom/node-exporter:latest
  command:
    - '--web.listen-address=:9100'
    - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
  # Resto de la configuración...
```

### Problema: Error en cAdvisor
```
Failed to start container: Error response from daemon: error while mounting volume
```

**Solución**:
Se ha simplificado la configuración de volúmenes para cAdvisor en entornos de contenedores:
```yaml
cadvisor:
  image: gcr.io/cadvisor/cadvisor:latest
  security_opt:
    - apparmor:unconfined
  volumes:
    - /var/run:/var/run:ro
    - /sys:/sys:ro
    - /var/lib/docker/:/var/lib/docker:ro
  # Resto de la configuración...
```

## Problemas con Prometheus

### Problema: Prometheus unhealthy
```
dependency failed to start: container transcendence-prometheus is unhealthy
```

**Solución**:
- Simplificamos la configuración de volúmenes para Prometheus
- Modificamos el healthcheck para usar un punto de comprobación más simple
- Actualizamos los ajustes de comando

```yaml
prometheus:
  image: prom/prometheus:latest
  volumes:
    - ../monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
    - ../monitoring/prometheus/alerts.yml:/etc/prometheus/alerts.yml:ro
    - prometheus_data:/prometheus
  command:
    - '--config.file=/etc/prometheus/prometheus.yml'
    - '--storage.tsdb.path=/prometheus'
    # Resto de la configuración...
  healthcheck:
    test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:9090/"]
```

## Problemas con el Makefile

### Problema: Makefile:274: warning: overriding recipe for target 'reset'
```
Makefile:274: warning: overriding recipe for target 'reset'
Makefile:256: warning: ignoring old recipe for target 'reset'
```

**Solución**:
- Se renombró uno de los targets `reset` a `reset-env`
- Se actualizaron las referencias a este target en el Makefile

### Problema: No service selected
```
no service selected
make: *** [Makefile:139: up] Error 1
```

**Solución**:
- Se actualizó el comando COMPOSE para incluir el perfil por defecto:
```makefile
COMPOSE := docker compose -f ./compose/docker-compose.yml --profile default
```
- Se añadieron nuevos targets para los diferentes perfiles:
  - `up-dev`: Para desarrollo
  - `up-prod`: Para producción

## Problemas con Docker Secrets

### Problema: Falta de secretos Docker
```
Error response from daemon: invalid mount config for type "bind": bind source path does not exist: /workspaces/Transcendence/config/secrets/jwt_secret.secret
```

**Solución**:
- Asegurarse de ejecutar `scripts/generate-secrets.sh` antes de iniciar los servicios
- El script genera todos los secretos necesarios:
  - app_key.secret
  - jwt_secret.secret
  - grafana_admin_user.secret
  - grafana_admin_password.secret
  - scope_htpasswd.secret

## Instrucciones para Iniciar el Proyecto

1. Generar los secretos:
   ```bash
   ./scripts/generate-secrets.sh
   ```

2. Iniciar los servicios:
   ```bash
   # Para entorno por defecto
   make up
   
   # Para entorno de desarrollo
   make up-dev
   
   # Para entorno de producción
   make up-prod
   ```

## Recomendaciones Adicionales

- Utiliza `docker-compose config` para validar la configuración antes de iniciar los servicios
- Verifica los logs con `docker-compose logs [servicio]` para identificar problemas específicos
- En entornos de desarrollo, considera utilizar `make up-dev` para tener acceso directo a los servicios