# syntax=docker/dockerfile:1
FROM nginx:1.27-alpine

# Crear directorios necesarios
RUN mkdir -p /etc/ssl /etc/nginx/auth

# Borra default y copia tu config
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/

# Puerto HTTP y HTTPS
EXPOSE 80 443
