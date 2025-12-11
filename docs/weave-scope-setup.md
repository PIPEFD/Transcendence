# Configuración de Weave Scope en Entorno 42 Campus

## Problema

Weave Scope requiere acceso al socket de Docker (`/var/run/docker.sock`) para monitorear contenedores. En entornos con restricciones de seguridad (como 42 campus), esto puede causar errores de permisos.

## Soluciones

### Opción 1: Ajustar Permisos del Socket (Temporal)

Esta solución requiere privilegios temporales:

```bash
# Activar grupo docker temporalmente
newgrp docker

# Ajustar permisos
chmod 666 /var/run/docker.sock

# Reiniciar Weave Scope
docker-compose -f compose/docker-compose.yml restart scope
```

**Nota**: Los permisos volverán a `660` después de reiniciar Docker daemon.

### Opción 2: Deshabilitar Weave Scope (Recomendado para 42)

Si no necesitas visualización de topología en tiempo real:

```bash
# Detener Weave Scope
docker-compose -f compose/docker-compose.yml stop scope

# O excluir del perfil de monitoreo
docker-compose --profile monitoring-no-scope up -d
```

### Opción 3: Usar Alternativas

En lugar de Weave Scope, puedes usar:

- **cAdvisor**: Ya configurado en `http://localhost:8081/cadvisor/`
  - Muestra métricas de contenedores sin necesitar socket privilegiado
  
- **Grafana + Prometheus**: Ya configurado
  - Dashboards de contenedores vía cAdvisor exporter
  - Acceso en `http://localhost:3001`

## Estado Actual

- ✅ Weave Scope configurado con:
  - `privileged: true`
  - `pid: "host"`
  - `group_add: ["999"]` (docker group)
  - Entrypoint personalizado para ajuste de permisos
  
- ❌ Sin acceso al socket debido a restricciones del sistema

## Servicios de Monitoreo Funcionando

Todos estos servicios funcionan correctamente **sin** Weave Scope:

| Servicio | URL | Estado |
|----------|-----|--------|
| Prometheus | http://localhost:9090 | ✅ Activo |
| Grafana | http://localhost:3001 | ✅ Activo |
| cAdvisor | http://localhost:8081/cadvisor/ | ✅ Activo |
| Node Exporter | Métricas en Prometheus | ✅ Activo |
| Nginx Exporter | Métricas en Prometheus | ✅ Activo |
| PHP-FPM Exporter | Métricas en Prometheus | ✅ Activo |

## Recomendación

Para entorno 42 campus:

1. **Deshabilitar Weave Scope** (requiere permisos que no tienes)
2. **Usar cAdvisor + Grafana** para visualización de contenedores
3. **Prometheus** para métricas y alertas

```bash
# Detener Weave Scope
docker-compose -f compose/docker-compose.yml stop scope

# Verificar otros servicios
bash scripts/validate-services.sh
```

## Para Producción/Local con sudo

Si tienes acceso `sudo`:

```bash
# Cambiar permisos permanentemente
sudo chmod 666 /var/run/docker.sock

# O agregar tu usuario al grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Reiniciar Weave Scope
docker-compose -f compose/docker-compose.yml restart scope
```
