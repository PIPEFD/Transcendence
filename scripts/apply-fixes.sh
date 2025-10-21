#!/bin/bash
#
# apply-fixes.sh - Apply all configuration fixes for Transcendence
#

set -e
echo "Applying configuration fixes for Transcendence..."

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p /workspaces/Transcendence/nginx/snippets

# Apply NGINX configuration changes
echo "Applying NGINX configuration changes..."
mv -f /workspaces/Transcendence/nginx/conf.d/default.conf /workspaces/Transcendence/nginx/conf.d/default.conf.bak 2>/dev/null || true
mv -f /workspaces/Transcendence/nginx/conf.d/scope.conf /workspaces/Transcendence/nginx/conf.d/scope.conf.bak 2>/dev/null || true
cp -f /workspaces/Transcendence/nginx/conf.d/app.conf /workspaces/Transcendence/nginx/conf.d/app.conf.bak 2>/dev/null || true
cp -f /workspaces/Transcendence/nginx/conf.d/status.conf /workspaces/Transcendence/nginx/conf.d/status.conf.bak 2>/dev/null || true

# Move new files into place
echo "Installing new configuration files..."
cp -f /workspaces/Transcendence/nginx/snippets/*.conf /workspaces/Transcendence/nginx/snippets/ 2>/dev/null || true
cp -f /workspaces/Transcendence/nginx/conf.d/*.conf /workspaces/Transcendence/nginx/conf.d/ 2>/dev/null || true

# Update Docker Compose configuration
echo "Updating Docker Compose configuration..."
cp /workspaces/Transcendence/compose/docker-compose.yml /workspaces/Transcendence/compose/docker-compose.yml.bak
cp /workspaces/Transcendence/compose/docker-compose.yml.new /workspaces/Transcendence/compose/docker-compose.yml

# Update Prometheus configuration
echo "Updating Prometheus configuration..."
cp /workspaces/Transcendence/monitoring/prometheus/prometheus.yml /workspaces/Transcendence/monitoring/prometheus/prometheus.yml.bak
cp /workspaces/Transcendence/monitoring/prometheus/prometheus.yml.new /workspaces/Transcendence/monitoring/prometheus/prometheus.yml

# Install environment sample file
echo "Installing environment sample file..."
cp /workspaces/Transcendence/.env.sample /workspaces/Transcendence/.env.sample.bak 2>/dev/null || true
cp /workspaces/Transcendence/.env.sample /workspaces/Transcendence/.env

# Update documentation
echo "Updating documentation..."
cp /workspaces/Transcendence/README.md /workspaces/Transcendence/README.md.bak
cp /workspaces/Transcendence/README.md.new /workspaces/Transcendence/README.md
cp /workspaces/Transcendence/docs/ports.md /workspaces/Transcendence/docs/ports.md.bak 2>/dev/null || true
cp /workspaces/Transcendence/docs/ports.md.new /workspaces/Transcendence/docs/ports.md

echo "All fixes have been applied successfully!"
echo 
echo "To apply these changes, run: docker-compose down && docker-compose up -d"
echo "For development mode, run: docker-compose --profile dev up -d"
echo "For monitoring only, run: docker-compose --profile monitoring up -d"