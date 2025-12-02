#!/bin/bash

# Script de auditoría de seguridad
# Verifica puertos abiertos, procesos sospechosos y configuración

echo "🔒 AUDITORÍA DE SEGURIDAD - $(date)"
echo "=========================================="
echo ""

# 1. Puertos en escucha
echo "📡 1. PUERTOS EN ESCUCHA:"
echo "-------------------------------------------"
lsof -iTCP -sTCP:LISTEN -n -P | grep -v "^COMMAND" | awk '{print $1 "\t" $3 "\t" $9}' | sort -u
echo ""

# 2. Conexiones establecidas sospechosas
echo "🔗 2. CONEXIONES ACTIVAS (no localhost):"
echo "-------------------------------------------"
netstat -an | grep ESTABLISHED | grep -v "127.0.0.1" | grep -v "::1" | head -10
echo ""

# 3. Procesos con red activa
echo "🌐 3. PROCESOS CON ACTIVIDAD DE RED:"
echo "-------------------------------------------"
lsof -i | grep -v "localhost" | grep -v "127.0.0.1" | head -15
echo ""

# 4. Docker - Contenedores y puertos
echo "🐳 4. CONTENEDORES DOCKER:"
echo "-------------------------------------------"
docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}" 2>/dev/null || echo "Docker no está corriendo"
echo ""

# 5. Verificar archivos sospechosos
echo "📂 5. ARCHIVOS CON PERMISOS PELIGROSOS:"
echo "-------------------------------------------"
find . -type f -perm -111 -name "*.sh" -o -name "*.py" 2>/dev/null | head -10
echo ""

# 6. Variables de entorno sensibles
echo "🔐 6. VARIABLES DE ENTORNO SENSIBLES:"
echo "-------------------------------------------"
env | grep -iE "token|password|secret|key" | sed 's/=.*/=***/' || echo "No se encontraron variables sensibles"
echo ""

# 7. Últimas conexiones SSH
echo "🔑 7. INTENTOS DE CONEXIÓN SSH:"
echo "-------------------------------------------"
if [ -f /var/log/system.log ]; then
    grep -i "ssh" /var/log/system.log | tail -5 || echo "No hay logs SSH recientes"
else
    echo "Log no accesible (requiere permisos)"
fi
echo ""

# 8. Procesos en background sospechosos
echo "⚙️  8. PROCESOS EN BACKGROUND:"
echo "-------------------------------------------"
ps aux | grep -E "nc|netcat|nmap|telnet|ftp" | grep -v grep | head -10 || echo "No se encontraron procesos sospechosos"
echo ""

# 9. Firewall status
echo "🛡️  9. ESTADO DEL FIREWALL:"
echo "-------------------------------------------"
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate 2>/dev/null || echo "Requiere permisos de administrador"
echo ""

# 10. Resumen
echo "✅ RESUMEN:"
echo "-------------------------------------------"
echo "✓ Auditoría completada"
echo "✓ Revisa cualquier puerto o proceso sospechoso"
echo "✓ Los puertos 9180, 9443 son de tu proyecto Transcendence"
echo ""
