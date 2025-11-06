#!/bin/bash
# Script para generar tráfico continuo y visualizar conexiones en Weave Scope

echo "🔄 Generando tráfico continuo para visualización en Weave Scope..."
echo "📊 Accede a Weave Scope en: http://localhost:4040"
echo "⏹️  Presiona Ctrl+C para detener"
echo ""

# Contador de peticiones
count=0

while true; do
    count=$((count + 1))
    
    # Tráfico al frontend
    curl -sk https://localhost:9443/ > /dev/null 2>&1
    
    # Tráfico a la API del backend
    curl -sk https://localhost:9443/api/health.php > /dev/null 2>&1
    
    # Tráfico a Grafana
    curl -sk https://localhost:9443/grafana/ > /dev/null 2>&1
    
    # Tráfico a Prometheus (vía Nginx)
    curl -sk -u admin:admin https://localhost:9443/prometheus/ > /dev/null 2>&1
    
    # Tráfico directo a Prometheus
    curl -s http://localhost:9090/-/healthy > /dev/null 2>&1
    
    # Tráfico directo a Grafana
    curl -s http://localhost:3001/api/health > /dev/null 2>&1
    
    # Tráfico a cAdvisor
    curl -s http://localhost:8081/healthz > /dev/null 2>&1
    
    echo -ne "\r✅ Peticiones enviadas: $count"
    
    # Esperar 2 segundos entre ciclos
    sleep 2
done
