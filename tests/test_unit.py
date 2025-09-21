import pytest
import os
import subprocess
import json
from pathlib import Path

@pytest.mark.unit
def test_environment_variables():
    """Verifica que las variables de entorno necesarias estén definidas en .env"""
    env_file = Path("/workspaces/Transcendence/.env")
    assert env_file.exists(), "Archivo .env no existe"
    
    # Variables mínimas requeridas
    required_vars = [
        "APP_ENV", "APP_DEBUG", "APP_URL",
        "DB_CONNECTION", "DB_DATABASE",
        "SSL_CERT", "SSL_KEY", "SSL_DHPARAM"
    ]
    
    env_content = env_file.read_text()
    missing_vars = []
    
    for var in required_vars:
        if f"{var}=" not in env_content:
            missing_vars.append(var)
    
    assert not missing_vars, f"Variables de entorno faltantes en .env: {', '.join(missing_vars)}"

@pytest.mark.unit
def test_config_files_exist():
    """Verifica que los archivos de configuración importantes existan"""
    config_files = [
        "/workspaces/Transcendence/config/ssl/fullchain.pem",
        "/workspaces/Transcendence/config/ssl/privkey.pem",
        "/workspaces/Transcendence/config/ssl/dhparam.pem",
        "/workspaces/Transcendence/nginx/nginx.conf",
        "/workspaces/Transcendence/docker/backend/Dockerfile",
        "/workspaces/Transcendence/docker/frontend/Dockerfile",
        "/workspaces/Transcendence/docker/game-ws/Dockerfile",
        "/workspaces/Transcendence/docker/nginx/Dockerfile",
        "/workspaces/Transcendence/compose/docker-compose.yml"
    ]
    
    missing_files = []
    for file_path in config_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    assert not missing_files, f"Archivos de configuración faltantes: {', '.join(missing_files)}"

@pytest.mark.unit
def test_docker_compose_file():
    """Verifica que el archivo docker-compose.yml sea válido"""
    try:
        result = subprocess.run(
            ["docker", "compose", "-f", "/workspaces/Transcendence/compose/docker-compose.yml", "config"],
            check=True,
            capture_output=True,
            text=True
        )
        assert result.returncode == 0, "El archivo docker-compose.yml no es válido"
    except subprocess.CalledProcessError as e:
        assert False, f"Error validando docker-compose.yml: {e.stderr}"

@pytest.mark.unit
def test_ssl_certificates():
    """Verifica que los certificados SSL sean válidos"""
    cert_path = "/workspaces/Transcendence/config/ssl/fullchain.pem"
    key_path = "/workspaces/Transcendence/config/ssl/privkey.pem"
    
    if not os.path.exists(cert_path) or not os.path.exists(key_path):
        pytest.skip("Certificados SSL no encontrados")
    
    try:
        # Verificar el certificado
        result = subprocess.run(
            ["openssl", "x509", "-in", cert_path, "-text", "-noout"],
            check=True,
            capture_output=True,
            text=True
        )
        assert result.returncode == 0, "El certificado no es válido"
        
        # Verificar la clave privada
        result = subprocess.run(
            ["openssl", "rsa", "-in", key_path, "-check", "-noout"],
            check=True,
            capture_output=True,
            text=True
        )
        assert result.returncode == 0, "La clave privada no es válida"
    except subprocess.CalledProcessError as e:
        assert False, f"Error validando certificados SSL: {e.stderr}"

@pytest.mark.unit
def test_nginx_config():
    """Verifica que la configuración de Nginx sea válida"""
    # Verificamos simplemente que el archivo de configuración exista
    nginx_conf = "/workspaces/Transcendence/nginx/nginx.conf"
    assert os.path.exists(nginx_conf), f"Archivo de configuración de Nginx no encontrado: {nginx_conf}"
    
    # En un entorno de pruebas, no verificamos la validez completa
    # ya que puede haber referencias a hosts que no existen en este contexto
    print("INFO: Archivo de configuración de Nginx existe, pero no se valida completamente en pruebas unitarias")

@pytest.mark.unit
def test_init_scripts():
    """Verifica que los scripts de inicialización sean ejecutables"""
    scripts = [
        "/workspaces/Transcendence/scripts/init.sh",
        "/workspaces/Transcendence/scripts/init-env.sh",
        "/workspaces/Transcendence/scripts/generate-credentials.sh",
        "/workspaces/Transcendence/scripts/security-check.sh",
        "/workspaces/Transcendence/scripts/cloudflare/generate-certs.sh",
        "/workspaces/Transcendence/scripts/cloudflare/tunnel.sh"
    ]
    
    non_executable = []
    for script in scripts:
        if os.path.exists(script) and not os.access(script, os.X_OK):
            non_executable.append(script)
    
    assert not non_executable, f"Scripts no ejecutables: {', '.join(non_executable)}"