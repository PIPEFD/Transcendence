# Backend de Transcendence

Este directorio contiene el backend del proyecto Transcendence, desarrollado en PHP 8.2 con SQLite como base de datos.

## Estructura de directorios

```
/backend
├── composer.json          # Configuración de dependencias de PHP
├── composer.lock          # Versiones bloqueadas de dependencias
├── database/              # Base de datos SQLite
├── Makefile               # Comandos para gestionar el backend
├── public/                # Archivos accesibles públicamente
│   ├── api/               # Endpoints de la API REST
│   ├── config/            # Configuración de la aplicación
│   ├── index.php          # Punto de entrada principal
│   └── utils/             # Utilidades y funciones comunes
└── vendor/                # Dependencias instaladas (gestionadas por Composer)
```

## Requisitos

- PHP 8.2 o superior
- Extensión SQLite3 para PHP
- Composer (gestor de dependencias de PHP)

## Configuración inicial

1. Copie el archivo de configuración de ejemplo:
   ```bash
   cp .env.example .env
   ```

2. Edite el archivo `.env` según sus necesidades

3. Instale las dependencias:
   ```bash
   composer install
   ```

## API Endpoints

El backend proporciona los siguientes endpoints:

- `/api/users.php` - Gestión de usuarios (GET, POST, PATCH, DELETE)
- `/api/auth/login.php` - Autenticación de usuarios
- `/api/auth/logout.php` - Cierre de sesión
- `/api/friend-request.php` - Gestión de solicitudes de amistad
- `/api/friends.php` - Gestión de amigos
- `/api/ladder.php` - Ranking de jugadores
- `/api/matches.php` - Gestión de partidas

## Autenticación

El backend utiliza JWT (JSON Web Tokens) para la autenticación. Todos los endpoints protegidos requieren un token JWT válido en la cabecera `Authorization`.

## Base de datos

La estructura de la base de datos se define en `config/schema.sql` y se crea automáticamente al iniciar la aplicación.

## Comandos útiles

```bash
# Iniciar el backend
make up

# Detener el backend
make down

# Ver los logs
make logs

# Configurar por primera vez (instala dependencias y autoriza Gmail)
make setup
```