FROM php:8.2-cli

WORKDIR /app

# Instalar dependencias para Ratchet
RUN apt-get update && apt-get install -y \
    libevent-dev \
    && docker-php-ext-install sockets \
    && rm -rf /var/lib/apt/lists/*

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copiar archivos de proyecto
COPY . /app

# Instalar dependencias PHP (Ratchet, JWT, etc.)
RUN composer install

EXPOSE 9001

CMD ["php", "src/server.php"]
