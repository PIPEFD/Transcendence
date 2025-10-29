# Correcciones SSL y Gmail Verification

## Fecha
25 de Octubre 2025

## Problemas Identificados

### 1. Error de Permisos en Certificados SSL
**Error observado:**
```
cannot load certificate key "/etc/ssl/privkey.pem": BIO_new_file() failed 
(SSL: error:8000000D:system library::Permission denied)
```

**Causa:**
- El script `make-certs.sh` establecía permisos `600` para `privkey.pem`
- Nginx monta el certificado como volumen read-only
- Con permisos `600`, nginx no puede leer el archivo

**Solución:**
Modificado `scripts/make-certs.sh`:
```bash
# ANTES
chmod 600 "$SSL_DIR/privkey.pem"

# DESPUÉS  
chmod 644 "$SSL_DIR/privkey.pem"
```

### 2. Error de Permisos en Secretos
- Grafana no podía leer los archivos de secretos
- Permisos `600` demasiado restrictivos

**Solución:**
Modificado `scripts/generate-secrets.sh`:
```bash
# ANTES
chmod 600 "$SECRETS_DIR"/*

# DESPUÉS
chmod 644 "$SECRETS_DIR"/*
```

### 3. URL Incorrecta en Verificación de Gmail

**Problema:**
- El email de verificación 2FA solo contenía el código
- No incluía un link de verificación automática
- No usaba variables de entorno para la URL del frontend

**Emails anteriores:**
```
Subject: code for user => 1
CODE: 123456
```

**Solución Implementada:**

#### A. Modificado `backend/public/api/auth/gmail_api/mail_gmail.php`

```php
function sendMailGmailAPI(string $mail, string $id, string $code): bool
{
    try {
        $client = gmailClient();
        $gmail = new Google\Service\Gmail($client);

        // Construir URL de verificación usando variables de entorno
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost:9443';
        
        // Si estamos en desarrollo/docker, usar la URL externa configurada
        $base_url = getenv('FRONTEND_URL') ?: "{$protocol}://{$host}";
        $verify_url = "{$base_url}/#/verify-2fa?code={$code}&user_id={$id}";

        $message = "From: 'me'\r\n";
        $message .= "To: {$mail}\r\n";
        $message .= "Subject: Código de verificación 2FA - Transcendence\r\n";
        $message .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $message .= "\r\n";
        $message .= "Hola,\r\n\r\n";
        $message .= "Tu código de verificación 2FA es: " . $code . "\r\n\r\n";
        $message .= "O haz clic en el siguiente enlace para verificar automáticamente:\r\n";
        $message .= $verify_url . "\r\n\r\n";
        $message .= "Este código expirará en 10 minutos.\r\n\r\n";
        $message .= "Si no solicitaste este código, ignora este mensaje.\r\n";
        $message .= "\r\n";

        // ... resto del código
    }
}
```

#### B. Agregado FRONTEND_URL a `compose/docker-compose.yml`

```yaml
backend:
  environment:
    - APP_ENV=${ENV:-development}
    - APP_DEBUG=${APP_DEBUG:-true}
    - DB_DATABASE=/var/www/html/database/database.sqlite
    - FRONTEND_URL=${FRONTEND_URL:-https://localhost:9443}  # NUEVO
```

#### C. Actualizado `.env.sample`

```bash
# Frontend URL (used for email verification links)
FRONTEND_URL=https://localhost:9443
```

## Nuevo Formato de Email

```
Subject: Código de verificación 2FA - Transcendence

Hola,

Tu código de verificación 2FA es: 123456

O haz clic en el siguiente enlace para verificar automáticamente:
https://localhost:9443/#/verify-2fa?code=123456&user_id=1

Este código expirará en 10 minutos.

Si no solicitaste este código, ignora este mensaje.
```

## Script de Verificación

Se creó `scripts/verify-init.sh` para validar:
- ✅ Existencia de certificados SSL
- ✅ Permisos correctos (644) en certificados
- ✅ Existencia de archivos de secretos
- ✅ Permisos correctos (644) en secretos
- ✅ Existencia de directorios necesarios
- ✅ Variables de entorno en .env

## Archivos Modificados

1. ✅ `scripts/make-certs.sh` - Permisos de certificados
2. ✅ `scripts/generate-secrets.sh` - Permisos de secretos  
3. ✅ `backend/public/api/auth/gmail_api/mail_gmail.php` - URL de verificación
4. ✅ `compose/docker-compose.yml` - Variable FRONTEND_URL
5. ✅ `.env.sample` - Documentación de FRONTEND_URL
6. ✅ `scripts/verify-init.sh` - Script de verificación (nuevo)

## Proceso de Inicialización Correcto

### 1. Limpieza completa (si es necesario)
```bash
make clean-all
```

### 2. Inicialización
```bash
make init
```

Este comando ejecuta:
- `create-dirs` - Crea directorios necesarios
- `generate-secrets` - Genera secretos con permisos 644
- `create-certs` - Genera certificados SSL con permisos 644
- `create-env` - Crea archivo .env si no existe
- `up` - Inicia los servicios

### 3. Verificación
```bash
./scripts/verify-init.sh
```

### 4. Iniciar servicios
```bash
make up
```

### 5. Probar login
- Acceder a https://localhost:9443
- Iniciar sesión con credenciales
- Verificar que el email contenga el link correcto

## Configuración para Producción

Para entornos de producción, configurar en `.env`:

```bash
# URL externa del dominio
FRONTEND_URL=https://transcendence.example.com
```

## Validación

### Verificar permisos de certificados
```bash
ls -la config/ssl/
# Debe mostrar 644 para todos los archivos .pem
```

### Verificar permisos de secretos
```bash
ls -la config/secrets/
# Debe mostrar 644 para todos los archivos .secret
```

### Verificar logs de nginx
```bash
docker logs transcendence-nginx 2>&1 | grep -i error
# No debe mostrar errores de permisos en SSL
```

### Verificar variable FRONTEND_URL
```bash
docker exec transcendence-backend env | grep FRONTEND_URL
# Debe mostrar: FRONTEND_URL=https://localhost:9443
```

## Notas Importantes

1. **Permisos 644**: Permiten lectura por parte de los contenedores Docker montados con volúmenes read-only
2. **FRONTEND_URL**: Debe configurarse según el entorno (desarrollo/producción)
3. **Verificación automática**: El email ahora incluye un link que auto-completa el código 2FA
4. **Seguridad**: Los secretos siguen siendo privados (no en git) pero legibles por los contenedores

## Troubleshooting

### Error: "Permission denied" en privkey.pem
**Solución:** Ejecutar `make init` nuevamente para regenerar certificados con permisos correctos

### Error: "password mismatch" en Prometheus
**Solución:** Regenerar htpasswd con `./scripts/generate-secrets.sh`

### Email sin link de verificación
**Solución:** Verificar que FRONTEND_URL esté configurada en docker-compose y .env

### Link de verificación incorrecto
**Solución:** Ajustar FRONTEND_URL en .env según el entorno (localhost o dominio de producción)

### 4. Error 400 al acceder por HTTP

**Error observado:**
```
"GET / HTTP/1.1" status: "400"
```

**Causa:**
- Nginx configurado solo para HTTPS con HTTP/2
- Peticiones HTTP/1.1 al puerto 80 no tenían redirección
- Nginx devolvía error 400 Bad Request

**Solución:**
Modificado `nginx/conf.d/app.conf` para separar los bloques server:

```nginx
# HTTP to HTTPS redirect
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    
    # Redirect all HTTP requests to HTTPS
    return 301 https://$host$request_uri;
}

# Frontend Server Configuration (HTTPS)
server {
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    http2 on;
    server_name _;
    # ... resto de la configuración SSL
}
```

**Resultado:**
- ✅ HTTP (puerto 80) → Redirige a HTTPS con código 301
- ✅ HTTPS (puerto 443) → Funciona correctamente con HTTP/2
- ✅ No más errores 400 en peticiones HTTP/1.1

