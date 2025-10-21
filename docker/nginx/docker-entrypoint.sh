#!/bin/bash
# Script para inyectar variables de entorno en los archivos de configuración de Nginx
# Este script se ejecutará antes de iniciar Nginx

# Lista de variables para reemplazar en los archivos de configuración
VARS=(
  "FRONTEND_PORT"
  "BACKEND_PORT"
  "GAME_WS_PORT"
  "GAME_WS_CONTAINER_PORT"
  "PROMETHEUS_PORT"
  "GRAFANA_PORT"
  "GRAFANA_CONTAINER_PORT"
  "CADVISOR_PORT"
  "SCOPE_PORT"
)

# Directorios donde buscar archivos de configuración
NGINX_CONFS="/etc/nginx/conf.d/*.conf"

echo "Iniciando procesamiento de variables de entorno en configuraciones..."

# Recorrer cada archivo de configuración
for conf_file in $NGINX_CONFS; do
  echo "Procesando $conf_file"
  
  # Para cada variable en la lista, reemplaza ${VARIABLE} por su valor
  for var in "${VARS[@]}"; do
    value="${!var}"
    
    if [ -n "$value" ]; then
      echo "  - Reemplazando \${$var} por $value"
      sed -i "s/\${$var}/$value/g" "$conf_file"
    else
      echo "  - ¡Advertencia! Variable $var no tiene valor definido"
    fi
  done
done

echo "Procesamiento de variables completado."

# Manejar Docker secrets
echo "Configurando secrets de Docker si están disponibles..."
if [ -f "/run/secrets/scope_htpasswd" ]; then
  echo "Secret scope_htpasswd encontrado - Configurando para Basic Auth de Scope"
  # El archivo ya está montado en la ubicación correcta
else
  echo "¡Advertencia! Secret scope_htpasswd no encontrado"
fi

# Finalmente, ejecuta el comando original de Nginx
echo "Iniciando Nginx..."
exec "$@"