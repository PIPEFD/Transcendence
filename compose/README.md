# Optimizaciones de Docker Compose

Este documento detalla las optimizaciones realizadas en el archivo `docker-compose.yml` para mejorar el rendimiento, la seguridad y la estabilidad de los servicios.

## Mejoras de Seguridad

1. **Restricción de capacidades (capabilities)**
   - Uso de `cap_drop: [ALL]` para eliminar todas las capacidades por defecto
   - Adición selectiva de capacidades específicas solo cuando son necesarias con `cap_add`

2. **Modo de solo lectura**
   - Contenedores marcados como `read_only: true` cuando es posible
   - Previene modificaciones no autorizadas del sistema de archivos

3. **Restricción de privilegios**
   - Uso de `security_opt: ["no-new-privileges:true"]` para prevenir escalada de privilegios
   - Evita que los procesos obtengan nuevos privilegios

4. **Configuración de usuarios no privilegiados**
   - En servicios como Prometheus, se establece `user: "nobody"`
   - Evita la ejecución como root dentro de los contenedores

5. **Aislamiento de redes**
   - Red de monitoreo configurada como `internal: true`
   - Limita el acceso externo a servicios de monitorización

## Optimización de Recursos

1. **Límites de recursos explícitos**
   - Configuración de `deploy.resources.limits` para CPU y memoria
   - Evita que un servicio consuma todos los recursos disponibles
   - Mejora la estabilidad del sistema en conjunto

2. **Reservas de recursos**
   - Configuración de `deploy.resources.reservations` para garantizar recursos mínimos
   - Asegura que los servicios críticos tengan los recursos que necesitan

3. **Escalado adecuado**
   - Más recursos para servicios críticos (backend, frontend)
   - Menos recursos para servicios auxiliares (exporters)

## Persistencia y Fiabilidad

1. **Volúmenes persistentes**
   - Añadidos volúmenes para Prometheus y Grafana
   - Garantiza que los datos sobrevivan a los reinicios de los contenedores

2. **Políticas de reinicio**
   - Configuración de `restart: unless-stopped` en todos los servicios
   - Asegura la recuperación automática en caso de fallos

3. **Healthchecks mejorados**
   - Configurados para todos los servicios principales
   - Facilita la detección temprana de problemas

## Cómo usar esta configuración optimizada

```bash
# Iniciar los servicios con la configuración optimizada
docker compose -f ./compose/docker-compose.yml up -d

# Detener los servicios
docker compose -f ./compose/docker-compose.yml down

# Ver logs
docker compose -f ./compose/docker-compose.yml logs -f
```

## Perfiles Disponibles

El archivo Docker Compose utiliza perfiles para activar servicios opcionales:

```bash
# Iniciar servicios básicos
docker compose -f ./compose/docker-compose.yml up -d

# Iniciar con Web Application Firewall (WAF)
docker compose -f ./compose/docker-compose.yml --profile waf up -d

# Iniciar con servicios de prueba
docker compose -f ./compose/docker-compose.yml --profile test up -d
```

## Consideraciones

- La configuración optimizada establece límites de recursos que pueden necesitar ajustes según el hardware disponible
- Las redes internas pueden requerir configuración adicional para acceder desde herramientas externas de monitoreo
- Se recomienda realizar pruebas completas antes de utilizar esta configuración en producción