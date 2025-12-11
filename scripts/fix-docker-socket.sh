#!/bin/bash

# Script para ajustar permisos del Docker socket en entornos 42
# Necesario para que Weave Scope pueda acceder al socket

echo "🔧 Ajustando permisos del Docker socket..."

# Verificar si tenemos acceso al socket
if [ ! -e /var/run/docker.sock ]; then
    echo "❌ Error: Docker socket no encontrado en /var/run/docker.sock"
    exit 1
fi

# Mostrar permisos actuales
echo "📋 Permisos actuales:"
ls -la /var/run/docker.sock

# Intentar cambiar permisos (funcionará si el usuario está en el grupo docker)
if chmod 666 /var/run/docker.sock 2>/dev/null; then
    echo "✅ Permisos ajustados correctamente a 666"
    ls -la /var/run/docker.sock
else
    echo "⚠️  No se pudieron cambiar permisos directamente."
    echo "💡 Opciones:"
    echo "   1. Ejecutar: newgrp docker (luego volver a intentar)"
    echo "   2. Ejecutar: sudo chmod 666 /var/run/docker.sock"
    echo "   3. Reiniciar sesión si acabas de agregar tu usuario al grupo docker"
    exit 1
fi

echo ""
echo "🔄 Ahora puedes reiniciar Weave Scope con:"
echo "   docker-compose -f compose/docker-compose.yml restart scope"
