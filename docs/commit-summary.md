# Refactor de configuración para entorno 42 campus

## Cambios principales:

### Restructuración completa de la configuración de NGINX
- Separación de configuración en snippets reutilizables
- Corrección de location blocks fuera de server blocks
- Configuración modular con inclusiones apropiadas
- Servidor dedicado para endpoints de monitoreo

### Actualización de Docker Compose
- Adaptación para restricciones de puertos 42 campus (rango 9100-9500)
- Implementación de perfiles para diferentes entornos (default, dev, prod)
- Mejora de configuración para servicios de monitorización
- Enlace de servicios solo a 127.0.0.1 para mejor seguridad

### Correcciones en Makefile
- Eliminación de targets duplicados (reset)
- Nuevos comandos para perfiles de desarrollo y producción
- Mejora de mensajes de salida con información de puertos

### Documentación ampliada
- Instrucciones específicas para entorno 42 campus
- Documentación de puertos y restricciones
- Guía de solución de problemas
- Resumen de cambios implementados

### Generación y gestión de secretos
- Script mejorado para generación de credenciales
- Configuración adecuada para Docker secrets

## Fixes:
- Error de node-exporter con montaje de sistemas de archivo
- Problema con healthcheck de Prometheus
- Duplicación de target reset en Makefile
- Error "no service selected" en Docker Compose
- Configuración simplificada para cAdvisor en entornos restringidos
