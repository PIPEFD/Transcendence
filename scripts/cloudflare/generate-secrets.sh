#!/usr/bin/env bash
set -euo pipefail

# Ejecutar desde la raíz del repo
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SECRETS_DIR="$ROOT_DIR/config/secrets"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

mkdir -p "$SECRETS_DIR"

echo -e "${BLUE}Generando secretos en $SECRETS_DIR…${NC}"

# 1) APP_KEY
APP_KEY_FILE="$SECRETS_DIR/app_key.secret"
if [[ ! -s "$APP_KEY_FILE" ]]; then
  echo -e "${YELLOW}→ Generando APP_KEY…${NC}"
  echo "base64:$(openssl rand -base64 32)" > "$APP_KEY_FILE"
  chmod 600 "$APP_KEY_FILE"
  echo -e "${GREEN}✓ APP_KEY listo${NC}"
else
  echo "• APP_KEY existente (omitido)"
fi

# 2) JWT_SECRET
JWT_FILE="$SECRETS_DIR/jwt_secret.secret"
if [[ ! -s "$JWT_FILE" ]]; then
  echo -e "${YELLOW}→ Generando JWT_SECRET…${NC}"
  echo "base64:$(openssl rand -base64 64)" > "$JWT_FILE"
  chmod 600 "$JWT_FILE"
  echo -e "${GREEN}✓ JWT_SECRET listo${NC}"
else
  echo "• JWT_SECRET existente (omitido)"
fi

# 3) Grafana admin
GRAFANA_USER_FILE="$SECRETS_DIR/grafana_admin_user.secret"
GRAFANA_PASS_FILE="$SECRETS_DIR/grafana_admin_password.secret"

GRAFANA_USER="${GRAFANA_USER:-admin}"
GRAFANA_PASS="${GRAFANA_PASS:-$(openssl rand -base64 18 | tr -d '=+/')}"  # fácil de copiar

if [[ ! -s "$GRAFANA_USER_FILE" ]]; then
  echo "$GRAFANA_USER" > "$GRAFANA_USER_FILE"
  chmod 600 "$GRAFANA_USER_FILE"
fi

if [[ ! -s "$GRAFANA_PASS_FILE" ]]; then
  echo "$GRAFANA_PASS" > "$GRAFANA_PASS_FILE"
  chmod 600 "$GRAFANA_PASS_FILE"
fi

echo -e "${GREEN}✓ Grafana admin listos${NC}"
echo -e "${BLUE}Usuario:${NC} $GRAFANA_USER"
echo -e "${BLUE}Contraseña:${NC} $GRAFANA_PASS"

# 4) Weave Scope htpasswd (bcrypt)
SCOPE_USER="${SCOPE_USER:-scopeadmin}"
SCOPE_PASS="${SCOPE_PASS:-$(openssl rand -base64 18 | tr -d '=+/')}"

SCOPE_FILE="$SECRETS_DIR/scope_htpasswd.secret"
if [[ ! -s "$SCOPE_FILE" ]]; then
  echo -e "${YELLOW}→ Generando credenciales para Weave Scope (bcrypt)…${NC}"
  if command -v htpasswd >/dev/null 2>&1; then
    htpasswd -nbB "$SCOPE_USER" "$SCOPE_PASS" > "$SCOPE_FILE"
  else
    echo "• 'htpasswd' no está instalado; usando contenedor httpd:2.4-alpine…"
    docker run --rm httpd:2.4-alpine htpasswd -nbB "$SCOPE_USER" "$SCOPE_PASS" > "$SCOPE_FILE"
  fi
  chmod 600 "$SCOPE_FILE"
  echo -e "${GREEN}✓ scope_htpasswd.secret creado${NC}"
  echo -e "${BLUE}Usuario Scope:${NC} $SCOPE_USER"
  echo -e "${BLUE}Password Scope:${NC} $SCOPE_PASS"
else
  echo "• scope_htpasswd.secret existente (omitido)"
fi

echo -e "${GREEN}✅ Secretos generados correctamente.${NC}"
echo -e "${YELLOW}Recuerda:${NC} no comitees ${SECRETS_DIR} al repo."
