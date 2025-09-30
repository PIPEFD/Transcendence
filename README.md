# Transcendence

A multiplayer Pong game with social features and authentication, specifically designed to work within 42 campus network constraints.

## Architecture

- **Frontend**: TypeScript/Babylon.js SPA
- **Backend**: PHP-FPM with REST API and SQLite
- **Game-WS**: WebSocket server for game events
- **Nginx**: HTTP/WS proxy, static file server, load balancer
- **Observability**: Prometheus + Grafana + Node/NGINX/PHP-FPM exporters
- **Security**: HTTPS, CSP, and secure headers

## 42 Campus Network Constraints

This project has been specifically configured to work within 42 campus network limitations:

- **Custom Ports**: All externally exposed ports use the 9100-9500 range to avoid firewall restrictions
- **Localhost Binding**: Monitoring services bind to 127.0.0.1 only
- **Port Mapping**: Service port configuration is centralized in the `.env` file
- **Multiple Profiles**: Docker Compose profiles for development, production, and testing

## Prerequisites

- Docker and Docker Compose
- Git
- Internet access for downloading Docker images

## Quick Start

Follow these steps to get the project running:

1. Clone this repository:
   ```bash
   git clone https://your-repository/Transcendence.git
   cd Transcendence
   ```

2. Create environment configuration:
   ```bash
   cp .env.sample .env
   ```
   Modify the `.env` file if needed to set custom ports or configurations.

3. Initialize the environment:
   ```bash
   make init
   ```
   This command:
   - Creates the necessary directory structure
   - Generates self-signed SSL certificates
   - Creates Docker secrets
   - Starts all services

4. Access the application:
   - **Frontend**: https://localhost:9443 (or the port configured in NGINX_HTTPS_PORT)
   - **Monitoring**:
     - Grafana: http://localhost:9191/grafana (default credentials in .env)
     - Prometheus: http://localhost:9190/prometheus
   
## Docker Compose Profiles

The project uses Docker Compose profiles to organize services:

- **default**: Core services with monitoring (nginx, backend, frontend, game-ws)
- **prod**: Production mode (optimized settings)
- **dev**: Development mode with exposed service ports
- **test**: Test environment with integration tests
- **monitoring**: Just monitoring services

Example usage:
```bash
# Start default services
docker-compose up -d

# Start development mode with exposed ports
docker-compose --profile dev up -d

# Start only monitoring services
docker-compose --profile monitoring up -d

# Run tests
docker-compose --profile test up
```

## Directory Structure

```
├── backend/             # PHP backend API
├── compose/             # Docker Compose configuration
├── config/              # Configuration files
│   ├── auth/            # Authentication configs
│   ├── secrets/         # Docker secrets
│   └── ssl/             # SSL certificates
├── docker/              # Docker configuration
├── docs/                # Documentation
├── frontend/            # SPA frontend
├── game-ws/             # WebSocket server
├── monitoring/          # Prometheus/Grafana configuration
├── nginx/               # Nginx configuration
│   ├── conf.d/          # Server blocks
│   └── snippets/        # Reusable configuration
├── scripts/             # Utility scripts
└── tests/               # Test suite
```

## Nginx Configuration

The Nginx configuration has been organized following best practices:

- **nginx.conf**: Main configuration file with global settings
- **conf.d/**: Server blocks (virtual hosts)
  - app.conf: Main application server
  - status.conf: Monitoring endpoints
- **snippets/**: Reusable configuration fragments
  - api_proxy.conf: Backend API proxy settings
  - ws_proxy.conf: WebSocket proxy settings
  - monitoring.conf: Metrics and status endpoints
  - proxy_common.conf: Common proxy parameters

## Monitoring Stack

The project includes a comprehensive monitoring stack:

- **Prometheus**: Metrics collection and alerting
- **Grafana**: Visualization dashboards
- **cAdvisor**: Container metrics
- **Node Exporter**: Host system metrics
- **Nginx Exporter**: Nginx metrics
- **PHP-FPM Exporter**: PHP-FPM metrics

## Secret Management

Docker secrets are used for secure management of sensitive information:

- **app_key**: Application key for PHP backend
- **jwt_secret**: Secret for JWT token generation
- **grafana_admin_user/password**: Grafana admin credentials
- **scope_htpasswd**: htpasswd file for Weave Scope authentication

Secrets are stored in individual files in the `config/secrets/` directory.

## Main Commands

The project uses a simplified Makefile system:

```bash
# Show help with all available commands
make

# Initialize the full environment
make init

# Start all services
make up

# Stop all services
make down

# Restart all services
make restart

# View logs of all services
make logs

# Cleanup commands
make cleanup-files    # Remove temporary and unnecessary files
make reset            # Clean Docker environment (containers, volumes, networks)
make clean-all        # Complete project cleanup (reset + cleanup-files)
```

## Development

For local development, use the dev profile which exposes all services on separate ports:

```bash
docker-compose --profile dev up -d
```

This will start services with volumes mounted for live code changes:

- **Frontend**: http://localhost:9280
- **Backend API**: http://localhost:9380
- **Game WebSocket**: http://localhost:9480

## Testing

The project includes comprehensive tests:

```bash
# Run all tests
make test

# Run specific test suites
make test-backend
make test-frontend
make test-integration
```

## Security Considerations

- All containers use minimal permissions with capability dropping
- NGINX is configured with security headers and CSP
- Access to monitoring interfaces is restricted to localhost
- TLS 1.3 and modern cipher suites are enforced

## Troubleshooting

Common issues:

1. **Port conflicts**: Edit the `.env` file to change conflicting ports
2. **Certificate warnings**: The default setup uses self-signed certificates; for production, replace with valid certificates
3. **Permission issues**: Some directories need specific permissions; run `make fix-permissions` to resolve

## License

This project is licensed under the MIT License - see the LICENSE file for details.


### Curls

# Debe conectar (no hablará el protocolo, solo verifica apertura)
curl -vk https://localhost:9443/ws/ -H "Connection: Upgrade" -H "Upgrade: websocket"


