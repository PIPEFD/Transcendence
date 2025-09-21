# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app
ENV CI=true
# No copiamos package.json ni instalamos dependencias en la imagen
# porque estamos montando el directorio completo como volumen y
# las dependencias se instalarán en el primer inicio
EXPOSE 3000
# Usamos un script de inicio para instalar dependencias si es necesario
COPY <<EOF /docker-entrypoint.sh
#!/bin/sh
set -e

# Si no existen node_modules o está vacío, instala las dependencias
if [ ! -d "node_modules" ] || [ -z "\$(ls -A node_modules 2>/dev/null)" ]; then
    echo "Instalando dependencias del frontend..."
    npm install
fi

# Ejecuta el comando proporcionado
exec "\$@"
EOF
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
# En dev: servidor con hot-reload; en prod cambia a serve/NGINX
CMD ["npm", "run", "dev"]
