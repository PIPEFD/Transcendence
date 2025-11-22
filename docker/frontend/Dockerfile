# syntax=docker/dockerfile:1
FROM node:20-alpine

# La imagen node:alpine ya viene con el usuario 'node' (UID 1000, GID 1000)
# que es compatible con la mayoría de los usuarios del host

WORKDIR /app

# Asegurar que el directorio /app tiene los permisos correctos
RUN chown -R node:node /app

# Copiar package.json y package-lock.json primero (para cache de layers)
COPY --chown=node:node package*.json ./

# Cambiar al usuario node para instalar dependencias
USER node

# Instalar dependencias como usuario node (más seguro)
RUN npm install --no-audit --no-fund --loglevel=error

# Copiar el resto de los archivos del proyecto
COPY --chown=node:node . .

ENV CI=true
ENV NODE_ENV=development

EXPOSE 3000

# Script de inicio optimizado con watch mode
USER root
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'set -e' >> /entrypoint.sh && \
    echo 'cd /app' >> /entrypoint.sh && \
    echo 'echo "🚀 Starting frontend as user node (non-root)"' >> /entrypoint.sh && \
    echo 'echo "🔨 Building project..."' >> /entrypoint.sh && \
    echo 'npm run build' >> /entrypoint.sh && \
    echo 'echo "✅ Build complete"' >> /entrypoint.sh && \
    echo 'echo "👀 Starting watch mode for auto-recompile..."' >> /entrypoint.sh && \
    echo 'npm run watch:css &' >> /entrypoint.sh && \
    echo 'npm run watch:ts &' >> /entrypoint.sh && \
    echo 'echo "🌐 Starting development server on port 3000..."' >> /entrypoint.sh && \
    echo 'exec npx serve -s . -l 3000' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh && \
    chown node:node /entrypoint.sh

# Ejecutar como usuario node (seguridad)
USER node

ENTRYPOINT ["/entrypoint.sh"]
