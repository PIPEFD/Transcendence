# Solución de Problemas para Entornos de Desarrollo

Este documento proporciona soluciones a problemas comunes que pueden surgir al ejecutar Transcendence en entornos de desarrollo, especialmente en entornos de contenedores como GitHub Codespaces o Dev Containers.

## Problemas con Certificados SSL y Permisos

### Problema: Error de permisos en certificados SSL
```
nginx: [emerg] cannot load certificate key "/etc/ssl/privkey.pem": 
BIO_new_file() failed (SSL: error:8000000D:system library::Permission denied)
```

**Causa**:
- Los certificados SSL fueron generados con permisos 600
- Nginx monta los certificados como volúmenes read-only
- Con permisos 600, nginx (corriendo como usuario no-root) no puede leer los archivos

**Solución Inmediata**:
```bash
# Cambiar permisos de certificados existentes
chmod 644 config/ssl/privkey.pem config/ssl/fullchain.pem config/ssl/dhparam.pem

# Cambiar permisos de secretos
chmod 644 config/secrets/*.secret

# Reiniciar nginx
docker compose -f compose/docker-compose.yml restart nginx
```

**Solución Permanente**:
Los scripts ya han sido actualizados:
- `scripts/make-certs.sh` ahora usa `chmod 644`
- `scripts/generate-secrets.sh` ahora usa `chmod 644`

**Verificación**:
```bash
# Ejecutar script de verificación
./scripts/verify-init.sh

# Verificar permisos manualmente
ls -la config/ssl/
ls -la config/secrets/

# Verificar logs de nginx
docker logs transcendence-nginx 2>&1 | tail -20
```

### Problema: Gmail verification URL incorrecta
```
El email solo contiene el código 2FA sin link de verificación
```

**Causa**:
- La función `sendMailGmailAPI` no construía una URL completa
- No usaba variables de entorno para la URL del frontend

**Solución**:
Se ha actualizado `backend/public/api/auth/gmail_api/mail_gmail.php` para:
- Construir dinámicamente la URL usando `$_SERVER` y variables de entorno
- Incluir link de verificación automática en el email
- Usar la variable `FRONTEND_URL` del entorno

**Configuración**:
```bash
# Agregar a .env
FRONTEND_URL=https://localhost:9443

# Para producción
FRONTEND_URL=https://tu-dominio.com
```

**Nuevo formato de email**:
```
Subject: Código de verificación 2FA - Transcendence

Hola,

Tu código de verificación 2FA es: 123456

O haz clic en el siguiente enlace para verificar automáticamente:
https://localhost:9443/#/verify-2fa?code=123456&user_id=1

Este código expirará en 10 minutos.
```

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