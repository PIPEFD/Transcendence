# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app

# Copiar package.json y package-lock.json primero
COPY package*.json ./

# Instalar dependencias
RUN npm install --no-audit --no-fund --loglevel=error

# Copiar el resto de los archivos del proyecto
COPY . .

# Remover dist si existe
RUN rm -rf /app/dist && mkdir -p /app/dist && chmod -R 777 /app/dist

ENV CI=true
ENV NODE_ENV=development

EXPOSE 3000

# Script de inicio simple
USER root
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'cd /app' >> /entrypoint.sh && \
    echo 'echo "Frontend: Creating dist..."' >> /entrypoint.sh && \
    echo 'rm -rf dist && mkdir -p dist && chmod -R 777 dist' >> /entrypoint.sh && \
    echo 'echo "Frontend: Compiling TypeScript..."' >> /entrypoint.sh && \
    echo 'npx tsc' >> /entrypoint.sh && \
    echo 'chmod -R 777 dist' >> /entrypoint.sh && \
    echo 'echo "Frontend: Compiling Tailwind..."' >> /entrypoint.sh && \
    echo 'npm run build:css' >> /entrypoint.sh && \
    echo 'chmod -R 777 dist' >> /entrypoint.sh && \
    echo 'echo "Frontend: Starting watchers..."' >> /entrypoint.sh && \
    echo 'npm run watch:css & npm run watch:ts &' >> /entrypoint.sh && \
    echo 'echo "Frontend: Server starting on port 3000"' >> /entrypoint.sh && \
    echo 'exec npx serve -s . -l 3000' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
