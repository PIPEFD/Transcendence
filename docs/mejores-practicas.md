# Mejores Prácticas para Mantener el Proyecto Limpio

Este documento proporciona directrices para mantener el proyecto Transcendence limpio y bien organizado, evitando la acumulación de archivos innecesarios.

## Reglas Generales

1. **No almacenar archivos temporales en el repositorio**: 
   - Utiliza `.gitignore` para excluir archivos temporales y de construcción.
   - Evita hacer commit de archivos de log, caché o salidas de compilación.

2. **Estructurar el código adecuadamente**:
   - Mantener la separación entre frontend, backend y servicios.
   - Utilizar las carpetas designadas para cada tipo de archivo.

3. **Documentación en lugares apropiados**:
   - Toda la documentación debe estar en `/docs` o en README.md específicos.
   - No crear archivos sueltos de documentación en la raíz del proyecto.

## Archivos y Directorios a Evitar

1. **Archivos temporales**:
   - `*.tmp`, `*.log`, `*.swp`, `*~`, `.DS_Store`

2. **Archivos de compilación**:
   - `*.o`, `*.pyc`, `*.pyo`, `__pycache__`

3. **Datos de salida o depuración**:
   - `output.txt`, `outfile`, logs de depuración

4. **Copias de seguridad no controladas**:
   - `*.bak`, archivos con prefijos o sufijos como "old_", "_temp", etc.

## Mantenimiento Regular

1. **Ejecutar limpieza periódica**:
   ```bash
   make cleanup-files
   ```

2. **Antes de hacer commit**:
   - Revisar los cambios a incluir y asegurarse de no subir archivos innecesarios.
   - Ejecutar `make cleanup-files` para limpiar archivos temporales.

3. **Después de pruebas intensivas**:
   - Ejecutar `make clean` para eliminar recursos de Docker sin usar.

4. **Restablecimiento completo**:
   - Si necesitas un entorno completamente limpio: `make clean-all`

## Estructura Correcta del Proyecto

```
/transcendence
├── backend/         # Código backend y API
├── compose/         # Archivos de Docker Compose
├── config/          # Archivos de configuración
├── docker/          # Dockerfiles y scripts relacionados
├── docs/            # Documentación del proyecto
├── elk/             # Configuración para ELK Stack
├── frontend/        # Código frontend
├── game-ws/         # Servidor WebSocket para el juego
├── logs/            # Directorio para logs (vacío en git)
├── monitoring/      # Configuración para monitorización
├── nginx/           # Configuración de Nginx
├── scripts/         # Scripts de utilidad
├── tests/           # Pruebas automatizadas
├── waf/             # Configuración de WAF
├── .gitignore       # Patrones de archivos a ignorar
├── Makefile         # Comandos principales del proyecto
├── README.md        # Documentación principal
└── LICENSE          # Licencia del proyecto
```

## Comandos de Mantenimiento

| Comando | Descripción |
|---------|-------------|
| `make clean` | Elimina contenedores e imágenes Docker sin usar |
| `make cleanup-files` | Elimina archivos temporales e innecesarios |
| `make reset` | Elimina contenedores, volúmenes y redes Docker |
| `make clean-all` | Limpieza completa (reset + cleanup-files) |

## Antes de Contribuir

1. Asegúrate de que tus cambios siguen estas directrices.
2. Ejecuta `make cleanup-files` antes de hacer commit.
3. Revisa que no estás añadiendo archivos temporales o innecesarios.
4. Verifica que tu código está bien estructurado y documentado.