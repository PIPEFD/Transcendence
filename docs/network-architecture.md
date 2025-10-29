```
📊 ARQUITECTURA DE REDES - TRANSCENDENCE
═════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET / CLIENT                        │
│                    https://localhost:9443                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                   ┌─────────▼──────────┐
                   │   transcendence-   │  Puertos: 9180:80
                   │       nginx        │           9443:443
                   │  (172.18.0.4)      │
                   │  (172.19.0.9)      │  Redes:
                   │  (172.21.0.3)      │  - frontend
                   │  (172.20.0.3)      │  - backend
                   └────────┬───────────┘  - monitoring
                            │              - game
             ┌──────────────┼──────────────┐
             │              │              │
    ┌────────▼───────┐ ┌───▼──────┐ ┌────▼─────────┐
    │   frontend     │ │ backend  │ │   game-ws    │
    │ (172.21.0.2)   │ │(172.18.0.3)│(172.18.0.2)  │
    │ Port: 3000     │ │Port: 9000││ Port: 8080   │
    └────────────────┘ └──────────┘ └──────────────┘


🔷 RED: transcendence_frontend (172.21.0.0/16)
═════════════════════════════════════════════════
┌──────────────────────────────────────────────┐
│ • nginx          → 172.21.0.3                │
│ • frontend       → 172.21.0.2                │
│ • scope          → 172.21.0.4                │
└──────────────────────────────────────────────┘
Propósito: Servir contenido estático y SPA


🔶 RED: transcendence_backend (172.18.0.0/16)
═════════════════════════════════════════════════
┌──────────────────────────────────────────────┐
│ • backend        → 172.18.0.3                │
│ • game-ws        → 172.18.0.2                │
│ • nginx          → 172.18.0.4                │
│ • scope          → 172.18.0.5                │
└──────────────────────────────────────────────┘
Propósito: API REST y WebSocket de juego


🟢 RED: transcendence_game (172.20.0.0/16)
═════════════════════════════════════════════════
┌──────────────────────────────────────────────┐
│ • game-ws        → 172.20.0.2                │
│ • nginx          → 172.20.0.3                │
│ • scope          → 172.20.0.4                │
└──────────────────────────────────────────────┘
Propósito: Aislamiento de servicios de juego en tiempo real


🔵 RED: transcendence_monitoring (172.19.0.0/16)
═════════════════════════════════════════════════
┌──────────────────────────────────────────────┐
│ • cadvisor            → 172.19.0.2           │
│   Puerto HOST: 8081  Puerto INTERNO: 8080   │
│ • prometheus          → 172.19.0.3           │
│ • node-exporter       → 172.19.0.4           │
│ • backend             → 172.19.0.5           │
│ • php-fpm-exporter    → 172.19.0.6           │
│ • grafana             → 172.19.0.7           │
│ • nginx-exporter      → 172.19.0.8           │
│ • nginx               → 172.19.0.9           │
│ • scope               → 172.19.0.10          │
└──────────────────────────────────────────────┘
Propósito: Métricas, logs y observabilidad


🟢 RED: transcendence_game (172.20.0.0/16)
═════════════════════════════════════════════════
┌──────────────────────────────────────────────┐
│ • game-ws        → 172.20.0.2                │
│   Puerto INTERNO: 8080 (NO expuesto al host) │
│   Acceso: vía Nginx /ws/                     │
│ • nginx          → 172.20.0.3                │
│ • scope          → 172.20.0.4                │
└──────────────────────────────────────────────┘
Propósito: Aislamiento de servicios de juego en tiempo real


🔴 CONEXIONES ACTIVAS (Prometheus Scraping)
═════════════════════════════════════════════════
Prometheus → nginx-exporter    (cada 15s)
Prometheus → php-fpm-exporter  (cada 15s)
Prometheus → cadvisor          (cada 15s)
Prometheus → node-exporter     (cada 15s)

✓ Estas conexiones son PERSISTENTES y visibles en Weave Scope


🟡 CONEXIONES EFÍMERAS (HTTP Request/Response)
═════════════════════════════════════════════════
Nginx → Frontend   (solo durante peticiones)
Nginx → Backend    (solo durante peticiones a /api/)
Nginx → Game-WS    (solo durante peticiones a /ws/)
Nginx → Grafana    (solo durante peticiones a /grafana/)

⚠️  Estas conexiones solo son visibles durante el tráfico activo


📊 PARA VER TODAS LAS CONEXIONES EN WEAVE SCOPE:
═════════════════════════════════════════════════

1. Acceder a Weave Scope:
   http://localhost:4040

2. Ejecutar generador de tráfico:
   ./scripts/generate-traffic.sh

3. Refrescar la vista cada 2-3 segundos

4. Observar las conexiones aparecer en tiempo real


🎯 VERIFICACIÓN DE CONECTIVIDAD:
═════════════════════════════════════════════════

# Ver contenedores por red
docker network inspect transcendence_backend --format '{{range .Containers}}{{.Name}}={{.IPv4Address}} {{end}}'
docker network inspect transcendence_frontend --format '{{range .Containers}}{{.Name}}={{.IPv4Address}} {{end}}'
docker network inspect transcendence_monitoring --format '{{range .Containers}}{{.Name}}={{.IPv4Address}} {{end}}'
docker network inspect transcendence_game --format '{{range .Containers}}{{.Name}}={{.IPv4Address}} {{end}}'

# Ver estado de servicios
docker compose -f compose/docker-compose.yml --profile monitoring ps

# Generar tráfico de prueba
for i in {1..5}; do 
  curl -sk https://localhost:9443/ > /dev/null
  curl -sk https://localhost:9443/api/health.php > /dev/null
  sleep 1
done
```
