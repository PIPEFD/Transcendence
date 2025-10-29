# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app
ENV CI=true

# No copiamos package.json ni instalamos dependencias en la imagen
# porque estamos montando el directorio completo como volumen
EXPOSE 3000

# Crear script de inicio simplificado
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'mkdir -p /app/dist' >> /entrypoint.sh && \
    echo 'npm install' >> /entrypoint.sh && \
    echo 'npm run dev' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
