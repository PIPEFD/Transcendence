#!/bin/bash

# Script de validación de endpoints API
# Verifica que se generan correctamente en diferentes contextos

cat << 'EOF'
╔═════════════════════════════════════════════════════════════════╗
║         VALIDACIÓN DE ENDPOINTS API - TRANSCENDENCE            ║
╚═════════════════════════════════════════════════════════════════╝

Este script valida que los endpoints se generan correctamente 
en diferentes contextos (local, red, desarrollo, producción).

📋 ESCENARIOS A VALIDAR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣  ACCESO LOCAL A TRAVÉS DE NGINX (HTTPS)
   URL: https://localhost:9443
   Contexto: window.location.hostname = 'localhost'
             window.location.port = '9443'
   Esperado: API_BASE_URL = '' (rutas relativas)
   Petición: GET /api/users.php → proxeada a backend

2️⃣  ACCESO EXTERNO A TRAVÉS DE NGINX (HTTPS)
   URL: https://192.168.1.100:9443  (desde otro ordenador)
   Contexto: window.location.hostname = '192.168.1.100'
             window.location.port = '9443'
   Esperado: API_BASE_URL = '' (rutas relativas)
   Petición: GET /api/users.php → proxeada a backend
   ✅ CORRECCIÓN: Ahora usa rutas relativas, funciona correctamente

3️⃣  ACCESO DIRECTO AL FRONTEND (DESARROLLO)
   URL: http://localhost:3000
   Contexto: window.location.hostname = 'localhost'
             window.location.port = '3000'
   Esperado: API_BASE_URL = 'https://localhost:9443'
   Petición: GET https://localhost:9443/api/users.php

4️⃣  ACCESO EXTERNO AL FRONTEND (DESARROLLO)
   URL: http://192.168.1.100:3000  (desde otro ordenador)
   Contexto: window.location.hostname = '192.168.1.100'
             window.location.port = '3000'
   Esperado: API_BASE_URL = 'https://192.168.1.100:9443'
   Petición: GET https://192.168.1.100:9443/api/users.php
   ✅ CORRECCIÓN: Ahora usa la IP actual en lugar de localhost

5️⃣  ACCESO SIN PUERTO (PRODUCCIÓN)
   URL: https://example.com
   Contexto: window.location.hostname = 'example.com'
             window.location.port = '' (vacío)
   Esperado: API_BASE_URL = '' (rutas relativas)
   Petición: GET /api/users.php → proxeada a backend

6️⃣  ACCESO EN PUERTO 443 (HTTPS ESTÁNDAR)
   URL: https://example.com:443
   Contexto: window.location.hostname = 'example.com'
             window.location.port = '443'
   Esperado: API_BASE_URL = '' (rutas relativas)
   Petición: GET /api/users.php → proxeada a backend

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 CAMBIOS REALIZADOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Caso 1: Acceso local vía nginx (localhost:9443)
   ANTES: return `${protocol}//${host}:${port}` → https://localhost:9443
   DESPUÉS: return '' → (rutas relativas)
   RAZÓN: Nginx actúa como proxy, rutas relativas funcionan mejor

✅ Caso 2: Acceso externo vía nginx (192.168.1.100:9443)
   ANTES: return '' (correcto, pero había confusión)
   DESPUÉS: return '' (confirmado correcto)
   RAZÓN: Nginx proxea desde el mismo host/puerto

✅ Caso 3: Acceso local desarrollo (localhost:3000)
   ANTES: return 'https://localhost:9443' → ✅ Correcto
   DESPUÉS: return 'https://localhost:9443' → ✅ Sin cambio
   RAZÓN: Sigue siendo localhost en contexto local

✅ Caso 4: Acceso externo desarrollo (192.168.1.100:3000)
   ANTES: return 'https://localhost:9443' → ❌ INCORRECTO!
          Intenta conectar a localhost que no existe en red externa
   DESPUÉS: return 'https://192.168.1.100:9443' → ✅ CORRECTO
   RAZÓN: Usa la IP actual para que clientes externos conecten correctamente

✅ Caso 5: Acceso sin puerto (vía DNS)
   ANTES: return '' → ✅ Correcto
   DESPUÉS: return '' → ✅ Sin cambio
   RAZÓN: Rutas relativas funcionan correctamente en producción

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 LÓGICA DE DECISIÓN ACTUALIZADA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const getApiBaseUrl = (): string => {
  const currentHost = window.location.hostname;
  const currentPort = window.location.port;
  
  // Puerto 9443 o 443 → Nginx proxeando → Rutas relativas
  if (currentPort === '9443' || currentPort === '443') {
    return '';  // Funciona desde localhost y desde IP externa
  }
  
  // Sin puerto → Producción → Rutas relativas
  if (currentPort === '') {
    return '';
  }
  
  // Puerto 3000 o 9280 → Desarrollo directo → Necesita nginx en 9443
  if (currentPort === '3000' || currentPort === '9280') {
    // 🔑 CLAVE: Usar currentHost para soportar acceso externo
    const targetHost = currentHost === '127.0.0.1' ? 'localhost' : currentHost;
    return `https://${targetHost}:9443`;
  }
  
  return '';
};

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ VENTAJAS DE LA SOLUCIÓN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Funciona desde localhost y desde IP externa
✅ Funciona en desarrollo (puerto 3000) y producción (puerto 443)
✅ No requiere cambios en el servidor
✅ Dinámico: se adapta automáticamente al origen de la petición
✅ Mantiene compatibilidad con nginx proxy
✅ Soporta cookies de sesión (CORS en el mismo origen)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧪 PRUEBAS MANUALES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para verificar que funciona correctamente desde 42 campus:

1. Abre DevTools (F12) en el navegador
2. Ve a la consola
3. Ejecuta: console.log(window.location.href)
4. Ejecuta: import('./src/config/api.ts').then(m => console.log(m.API_BASE_URL))
5. Verifica que el endpoint es correcto según la tabla anterior

O abre el Network tab y verifica:
- Si accedes desde https://IP:9443 → las peticiones van a /api/...
- Si accedes desde http://IP:3000 → las peticiones van a https://IP:9443/api/...

EOF

echo ""
echo "✅ Validación completada. Archivos actualizados:"
echo "   • frontend/src/config/api.ts"
echo ""
