# Port Management for 42 Campus Constraints

This document explains the port management strategy for the Transcendence project, specifically designed to work within 42 campus network constraints.

## Port Binding Strategy

To comply with 42 campus network limitations:

1. **Port Range**: All externally exposed ports use the 9100-9500 range
2. **Localhost Binding**: Monitoring services bind only to 127.0.0.1 to prevent external access
3. **Port Centralization**: All port configurations are defined in a single `.env` file
4. **Service Discovery**: Internal services communicate using Docker DNS resolution and container names

## Port Configuration Structure

All ports are defined centrally in the `.env` file at the project root:

```bash
# Main Service Ports (External)
NGINX_HTTP_PORT=9180          # NGINX HTTP port on host
NGINX_HTTPS_PORT=9443         # NGINX HTTPS port on host

# Development Direct Access Ports
DEV_FRONTEND_PORT=9280        # Direct access to frontend during development
DEV_BACKEND_PORT=9380         # Direct access to backend API during development
DEV_GAME_WS_PORT=9480         # Direct access to game WebSocket during development

# Internal Service Ports
FRONTEND_PORT=3000            # Internal frontend container port
BACKEND_PORT=9000             # Internal backend container port
GAME_WS_PORT=8081             # Internal WebSocket port on host
GAME_WS_CONTAINER_PORT=8080   # Internal WebSocket container port

# Monitoring Service Ports (localhost only)
PROMETHEUS_PORT=9190          # Prometheus port (localhost only)
GRAFANA_PORT=9191             # Grafana port (localhost only)
CADVISOR_PORT=9192            # cAdvisor port (localhost only)
NODE_EXPORTER_PORT=9193       # Node Exporter port (localhost only)
NGINX_EXPORTER_PORT=9194      # NGINX Exporter port (localhost only)
PHP_FPM_EXPORTER_PORT=9195    # PHP-FPM Exporter port (localhost only)
```

## Port Usage Implementation

### External Access

The application is primarily accessed through NGINX which serves as the main entry point:

1. **HTTP**: Port 9180 (configurable via NGINX_HTTP_PORT)
2. **HTTPS**: Port 9443 (configurable via NGINX_HTTPS_PORT)

### Development Mode

In development mode (`docker-compose --profile dev up`), services are directly exposed:

1. **Frontend**: Port 9280 (configurable via DEV_FRONTEND_PORT)
2. **Backend API**: Port 9380 (configurable via DEV_BACKEND_PORT)
3. **Game WebSocket**: Port 9480 (configurable via DEV_GAME_WS_PORT)

### Service-to-Service Communication

Services communicate internally using Docker's internal network:

1. **NGINX to Frontend**: `frontend:3000`
2. **NGINX to Backend**: `backend:9000`
3. **NGINX to Game WebSocket**: `game-ws:8080`

### Monitoring Services

All monitoring services bind to localhost (127.0.0.1) only to prevent external access:

1. **Prometheus**: Port 9190 (configurable via PROMETHEUS_PORT)
2. **Grafana**: Port 9191 (configurable via GRAFANA_PORT)
3. **cAdvisor**: Port 9192 (configurable via CADVISOR_PORT)

## Changing Ports

To change ports, follow these steps:

1. Edit the `.env` file and modify the desired port values
2. Restart the services: `docker-compose down && docker-compose up -d`

## Troubleshooting Port Issues

If you encounter port-related issues:

1. **Check for port conflicts**: Use `ss -tuln` to see if ports are already in use
2. **Verify port bindings**: Use `docker-compose ps` to see actual port mappings
3. **Check localhost bindings**: Services bound to 127.0.0.1 won't be accessible externally
4. **Ensure .env is loaded**: Run `docker-compose config` to verify port values are correctly loaded

## Network Security Considerations

1. **Monitoring security**: All monitoring services are bound to localhost only
2. **Minimal exposure**: Only essential ports are exposed externally
3. **HTTPS enforcement**: NGINX redirects HTTP to HTTPS for secure connections
4. **Rate limiting**: NGINX configuration includes rate limiting to prevent abuse

## 42 Campus-Specific Recommendations

1. **Avoid privileged ports**: Never use ports below 1024 (requires root privileges)
2. **Avoid common ports**: Avoid using common service ports (80, 443, 3000, 3306, etc.)
3. **Use high port range**: Stick to the 9100-9500 range to minimize conflicts
4. **Check local policies**: Ensure compliance with local campus network policies