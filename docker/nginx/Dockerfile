# syntax=docker/dockerfile:1
FROM nginx:1.27-alpine

# Crear directorios necesarios
RUN mkdir -p /etc/ssl /etc/nginx/auth

# Borra default y copia tu config
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/conf.d/ /etc/nginx/conf.d/

COPY config/ssl/privkey.pem /etc/ssl/
COPY config/ssl/fullchain.pem /etc/ssl/
RUN chmod 644 /etc/ssl/privkey.pem /etc/ssl/fullchain.pem
# Copia el script de inicialización
COPY docker/nginx/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Puerto HTTP y HTTPS
EXPOSE 80 443

# Usa el script de inicialización como punto de entrada
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
