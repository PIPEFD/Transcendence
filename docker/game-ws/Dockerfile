FROM php:8.2-cli

WORKDIR /app

# Instalar dependencias para Ratchet y herramientas de construcción
RUN apt-get update && apt-get install -y \
    libevent-dev \
    git \
    unzip \
    libzip-dev \
    && docker-php-ext-install sockets \
    && docker-php-ext-install zip \
    && rm -rf /var/lib/apt/lists/*

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copiar composer.json y realizar la instalación como root primero
COPY composer.json /app/
RUN composer install

# Crear usuario no root y ajustar permisos
RUN useradd -r -u 1001 gameuser \
    && chown -R gameuser:gameuser /app

# Cambiar al usuario no root
USER gameuser

# Copiar el resto de los archivos
COPY --chown=gameuser:gameuser . /app/

EXPOSE 8080

CMD ["php", "src/sourse/server.php"]
