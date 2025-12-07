# syntax=docker/dockerfile:1

# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar todas las dependencias para build
RUN npm install --no-audit --no-fund

# Copiar código fuente
COPY . .

# Build del proyecto
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app

# Instalar solo serve para producción
RUN npm install -g serve@14 \
    && npm cache clean --force

# Copiar artifacts desde builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.html ./
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/package.json ./

# Asegurar permisos correctos
RUN chown -R node:node /app

# Variables de entorno
ENV CI=true \
    NODE_ENV=production \
    PORT=3000

EXPOSE 3000

# Script de inicio optimizado
USER root
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'set -e' >> /entrypoint.sh && \
    echo 'cd /app' >> /entrypoint.sh && \
    echo 'if [ "$NODE_ENV" = "development" ]; then' >> /entrypoint.sh && \
    echo '  echo "🚀 Starting in DEVELOPMENT mode"' >> /entrypoint.sh && \
    echo '  npm run watch:css &' >> /entrypoint.sh && \
    echo '  npm run watch:ts &' >> /entrypoint.sh && \
    echo 'else' >> /entrypoint.sh && \
    echo '  echo "🚀 Starting in PRODUCTION mode"' >> /entrypoint.sh && \
    echo 'fi' >> /entrypoint.sh && \
    echo 'echo "🌐 Starting server on port ${PORT}..."' >> /entrypoint.sh && \
    echo 'exec npx serve -s . -l ${PORT}' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh && \
    chown node:node /entrypoint.sh

# Ejecutar como usuario node (seguridad)
USER node

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

ENTRYPOINT ["/entrypoint.sh"]
