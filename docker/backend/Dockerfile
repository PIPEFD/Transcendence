# syntax=docker/dockerfile:1
FROM php:8.2-fpm-alpine

# Instalar dependencias necesarias
RUN apk add --no-cache \
    git \
    zip \
    unzip \
    sqlite-dev \
    curl

# Instalar extensiones PHP necesarias
RUN docker-php-ext-install pdo pdo_mysql pdo_sqlite

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar directorio de trabajo
WORKDIR /var/www/html

# Copiar script de entrypoint para manejar Docker secrets
COPY docker/backend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copiar archivos del proyecto
COPY backend/composer.* ./
# Instalar dependencias con Composer
RUN composer install --no-scripts --no-autoloader

# Copiar el resto de los archivos
COPY backend/ .

# Generar autoloader optimizado
RUN composer dump-autoload --optimize

# Configure PHP-FPM to run as root (required in dev container)
RUN echo -e "[global]\npid = /run/php-fpm.pid\nerror_log = /proc/self/fd/2\nlog_level = notice" > /usr/local/etc/php-fpm.d/www.conf && \
    echo -e "\n[www]\nuser = root\ngroup = root\nlisten = 9000\npm = dynamic\npm.max_children = 5\npm.start_servers = 2\npm.min_spare_servers = 1\npm.max_spare_servers = 3" >> /usr/local/etc/php-fpm.d/www.conf && \
    echo -e "\npm.status_path = /status\nping.path = /ping\nping.response = pong" >> /usr/local/etc/php-fpm.d/www.conf && \
    echo -e "\naccess.log = /proc/self/fd/2\naccess.format = \"%R - %u %t \\\"%m %r\\\" %s\"" >> /usr/local/etc/php-fpm.d/www.conf && \
    echo -e "\nphp_flag[display_errors] = on\nphp_admin_value[error_log] = /proc/self/fd/2\nphp_admin_flag[log_errors] = on" >> /usr/local/etc/php-fpm.d/www.conf

EXPOSE 9000
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["php-fpm", "-F", "--allow-to-run-as-root"]
