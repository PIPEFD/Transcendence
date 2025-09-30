#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SSL_DIR="$ROOT_DIR/config/ssl"
SECRETS_DIR="$ROOT_DIR/config/secrets"
CF_DIR="$ROOT_DIR/config/cloudflare/certs"

mkdir -p "$SSL_DIR" "$SECRETS_DIR"

CN="${CN:-localhost}"
DAYS="${DAYS:-365}"

# --- TLS (self-signed para dev) ---
if [[ ! -s "$SSL_DIR/privkey.pem" || ! -s "$SSL_DIR/fullchain.pem" ]]; then
  openssl req -x509 -nodes -days "$DAYS" -newkey rsa:2048 \
    -keyout "$SSL_DIR/privkey.pem" \
    -out "$SSL_DIR/fullchain.pem" \
    -subj "/C=ES/ST=Madrid/L=Madrid/O=42/OU=dev/CN=$CN"
  chmod 600 "$SSL_DIR/privkey.pem"; chmod 644 "$SSL_DIR/fullchain.pem"
fi
[[ -s "$SSL_DIR/dhparam.pem" ]] || { openssl dhparam -out "$SSL_DIR/dhparam.pem" 2048; chmod 644 "$SSL_DIR/dhparam.pem"; }

# Duplicado a cloudflare/certs si existe
if [[ -d "$ROOT_DIR/config/cloudflare" ]]; then
  mkdir -p "$CF_DIR"
  cp -f "$SSL_DIR/"{fullchain.pem,privkey.pem,dhparam.pem} "$CF_DIR"/ || true
fi

# --- Secrets app/jwt (nombres que espera docker-compose) ---
[[ -s "$SECRETS_DIR/app_key.secret"     ]] || { echo "base64:$(openssl rand -base64 32)" > "$SECRETS_DIR/app_key.secret"; chmod 600 "$SECRETS_DIR/app_key.secret"; }
[[ -s "$SECRETS_DIR/jwt_secret.secret"  ]] || { echo "base64:$(openssl rand -base64 64)" > "$SECRETS_DIR/jwt_secret.secret"; chmod 600 "$SECRETS_DIR/jwt_secret.secret"; }

# --- Grafana admin ---
GRAFANA_USER="${GRAFANA_USER:-admin}"
GRAFANA_PASS="${GRAFANA_PASS:-$(openssl rand -base64 18 | tr -d '=+/')}"
[[ -s "$SECRETS_DIR/grafana_admin_user.secret"     ]] || { echo "$GRAFANA_USER" > "$SECRETS_DIR/grafana_admin_user.secret"; chmod 600 "$SECRETS_DIR/grafana_admin_user.secret"; }
[[ -s "$SECRETS_DIR/grafana_admin_password.secret" ]] || { echo "$GRAFANA_PASS" > "$SECRETS_DIR/grafana_admin_password.secret"; chmod 600 "$SECRETS_DIR/grafana_admin_password.secret"; }

# --- Weave Scope basic auth (bcrypt) ---
SCOPE_USER="${SCOPE_USER:-scopeadmin}"
SCOPE_PASS="${SCOPE_PASS:-$(openssl rand -base64 18 | tr -d '=+/')}"
HFILE="$SECRETS_DIR/scope_htpasswd.secret"
if [[ ! -s "$HFILE" ]]; then
  if command -v htpasswd >/dev/null 2>&1; then
    htpasswd -nbB "$SCOPE_USER" "$SCOPE_PASS" > "$HFILE"
  else
    docker run --rm httpd:2.4-alpine htpasswd -nbB "$SCOPE_USER" "$SCOPE_PASS" > "$HFILE"
  fi
  chmod 600 "$HFILE"
fi

# --- .env base (solo si no existe) ---
ENV_FILE="$ROOT_DIR/.env"
if [[ ! -s "$ENV_FILE" ]]; then
cat > "$ENV_FILE" <<ENVEOF
ENV=development
APP_ENV=development
APP_DEBUG=true
APP_URL=https://localhost

APP_KEY=$(cat "$SECRETS_DIR/app_key.secret")
JWT_SECRET=$(cat "$SECRETS_DIR/jwt_secret.secret")
JWT_EXPIRATION=86400

DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite

FRONTEND_PORT=3000
BACKEND_PORT=9000
GAME_WS_CONTAINER_PORT=9999
GAME_WS_PORT=9998

NGINX_HTTP_PORT=9180
NGINX_HTTPS_PORT=9443

PROMETHEUS_PORT=9190
GRAFANA_PORT=3001
CADVISOR_PORT=9192
NODE_EXPORTER_PORT=9193
NGINX_EXPORTER_PORT=9194
PHP_FPM_EXPORTER_PORT=9195
SCOPE_PORT=9584

SSL_CERT=/etc/ssl/fullchain.pem
SSL_KEY=/etc/ssl/privkey.pem
SSL_DHPARAM=/etc/ssl/dhparam.pem

COMPOSE_PROFILES=default
ENVEOF
  chmod 600 "$ENV_FILE"
fi

echo
echo "Grafana → user: $GRAFANA_USER  pass: $GRAFANA_PASS"
echo "Scope   → user: $SCOPE_USER    pass: $SCOPE_PASS"
echo "✅ init-secrets listo."
