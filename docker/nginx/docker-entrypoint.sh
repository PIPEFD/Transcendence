#!/bin/sh
# Script para inyectar variables de entorno en los archivos de configuración de Nginx
# Este script se ejecutará antes de iniciar Nginx

# Lista de variables para reemplazar en los archivos de configuración
VARS="FRONTEND_PORT BACKEND_PORT GAME_WS_PORT GAME_WS_CONTAINER_PORT PROMETHEUS_PORT GRAFANA_PORT GRAFANA_CONTAINER_PORT CADVISOR_PORT SCOPE_PORT"

# Directorios donde buscar archivos de configuración
echo "Iniciando procesamiento de variables de entorno en configuraciones..."

# Recorrer cada archivo de configuración en conf.d
for conf_file in /etc/nginx/conf.d/*.conf /etc/nginx/snippets/*.conf; do
  if [ -f "$conf_file" ]; then
    echo "Procesando $conf_file"
    
    # Para cada variable en la lista, reemplaza ${VARIABLE} por su valor
    for var in $VARS; do
      value=$(eval echo \$$var)
      
      if [ -n "$value" ]; then
        echo "  - Reemplazando \${$var} por $value"
        sed -i "s/\${$var}/$value/g" "$conf_file"
      else
        echo "  - ¡Advertencia! Variable $var no tiene valor definido"
      fi
    done
  fi
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

# Fix SSL permissions
echo "Fixing SSL file permissions..."
if [ -d "/etc/ssl" ]; then
    # chown -R nginx:nginx /etc/ssl/*.pem
    # chmod 644 /etc/ssl/fullchain.pem /etc/ssl/dhparam.pem
    # chmod 640 /etc/ssl/privkey.pem
    echo "SSL files permissions already set on host"
fi

# Finalmente, ejecuta el comando original de Nginx
echo "Iniciando Nginx..."
exec "$@"