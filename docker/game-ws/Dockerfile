# syntax=docker/dockerfile:1
FROM php:8.2-cli-alpine
WORKDIR /app

# Instalamos dependencias para Composer y extensiones de PHP necesarias
RUN apk add --no-cache git zip unzip

# Instalamos Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Exponemos el puerto para WebSocket
EXPOSE 8080

# Usamos un script de inicio para instalar dependencias si es necesario
COPY <<EOF /docker-entrypoint.sh
#!/bin/sh
set -e

# Si no existe vendor o está vacío, instala las dependencias
if [ ! -d "vendor" ] || [ -z "\$(ls -A vendor 2>/dev/null)" ]; then
    echo "Instalando dependencias del game-ws..."
    composer install --no-interaction --no-progress
fi

# Ejecuta el comando proporcionado
exec "\$@"
EOF
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["php", "src/ws_server.php"]
