#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob

VARS=(
  FRONTEND_PORT
  BACKEND_PORT
  GAME_WS_PORT
  GAME_WS_CONTAINER_PORT
  PROMETHEUS_PORT
  GRAFANA_PORT
  GRAFANA_CONTAINER_PORT
  CADVISOR_PORT
  SCOPE_PORT
)

echo "▶ Iniciando inyección de variables en /etc/nginx/conf.d/*.conf"
for conf_file in /etc/nginx/conf.d/*.conf; do
  echo "  • Procesando: $conf_file"
  for var in "${VARS[@]}"; do
    if [[ -v $var && -n "${!var}" ]]; then
      val="${!var}"
      val_escaped="${val//\//\\/}"
      val_escaped="${val_escaped//&/\\&}"
      echo "     - Reemplazando \${$var} → $val"
      sed -i "s/\${$var}/${val_escaped}/g" "$conf_file"
    else
      echo "     - (aviso) \${$var} sin valor; se deja como está"
    fi
  done
done

if [[ -f /run/secrets/scope_htpasswd ]]; then
  echo "✔ scope_htpasswd presente"
else
  echo "⚠ scope_htpasswd ausente (auth para /scope/ no funcionará)"
fi

echo "✔ Inyección terminada"
