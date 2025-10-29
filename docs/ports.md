# 🔌 Mapa de Puertos - Transcendence

## ⚠️ CONFLICTO RESUELTO: Puerto 8080

### ❌ Problema Original:
- **cAdvisor**: `127.0.0.1:8080:8080` 
- **game-ws**: Puerto interno `8080`
- **Conflicto**: Ambos usan el puerto 8080

### ✅ Solución Implementada:
- **cAdvisor**: `127.0.0.1:8081:8080` (puerto HOST cambiado a 8081)
- **game-ws**: Puerto interno `8080` (sin cambios, acceso vía Nginx)

## 📊 Puertos Actualizados

### Servicios de Monitoreo:
```
• Prometheus    → 127.0.0.1:9090  → prometheus:9090
• Grafana       → 127.0.0.1:3001  → grafana:3000
• cAdvisor      → 127.0.0.1:8081  → cadvisor:8080  ✨ ACTUALIZADO
• Weave Scope   → localhost:4040  (network_mode: host)
```

### Servicios Principales (Internos):
```
• Frontend  → Puerto 3000 (vía Nginx /)
• Backend   → Puerto 9000 (vía Nginx /api/)
• Game-WS   → Puerto 8080 (vía Nginx /ws/)  ⚠️ No expuesto al HOST
```

## 🌐 Acceso:

**cAdvisor directo**: `http://localhost:8081/cadvisor/containers/`
**Game WebSocket**: `wss://localhost:9443/ws/` (vía Nginx)
