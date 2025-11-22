#!/bin/bash

# Script para actualizar las URLs hardcodeadas del backend en los archivos JS del frontend
# Reemplaza http://localhost:8085 por /api (rutas relativas que nginx proxeará)

echo "🔧 Actualizando URLs de API en archivos JavaScript compilados..."

# Directorio de archivos compilados
DIST_DIR="/home/pipe/Transcendence/frontend/dist"

if [ ! -d "$DIST_DIR" ]; then
    echo "❌ Error: El directorio $DIST_DIR no existe"
    exit 1
fi

# Contador de archivos modificados
FILES_MODIFIED=0

# Buscar y reemplazar en todos los archivos .js
find "$DIST_DIR" -type f -name "*.js" | while read -r file; do
    # Verificar si el archivo contiene la URL antigua
    if grep -q "http://localhost:8085" "$file"; then
        echo "  📝 Actualizando: $file"
        
        # Hacer el reemplazo
        sed -i 's|http://localhost:8085||g' "$file"
        
        FILES_MODIFIED=$((FILES_MODIFIED + 1))
    fi
done

echo "✅ Actualización completada"
echo "📊 Total de archivos JS en dist: $(find "$DIST_DIR" -type f -name "*.js" | wc -l)"

# Verificar que no queden URLs antiguas
REMAINING=$(grep -r "http://localhost:8085" "$DIST_DIR" 2>/dev/null | wc -l)
if [ "$REMAINING" -eq 0 ]; then
    echo "✅ No se encontraron URLs antiguas restantes"
else
    echo "⚠️  Aún quedan $REMAINING ocurrencias de URLs antiguas"
fi

echo ""
echo "🔄 Ahora reinicia el contenedor del frontend para aplicar los cambios:"
echo "   docker restart transcendence-frontend"
