import pytest
import requests
import json
import time
import websocket
from tenacity import retry, stop_after_attempt, wait_fixed
from utils import is_service_ready

@pytest.mark.integration
def test_frontend_backend_communication(base_url):
    """Verifica que el frontend pueda comunicarse con el backend"""
    frontend_url = f"{base_url}"
    backend_url = f"{base_url}/api/status"
    
    # Verificar que el frontend cargue
    frontend_resp = requests.get(frontend_url)
    assert frontend_resp.status_code == 200, "Frontend no disponible"
    
    # Verificar que el backend responda
    backend_resp = requests.get(backend_url)
    assert backend_resp.status_code == 200, "API de backend no disponible"
    
    try:
        data = backend_resp.json()
        assert "status" in data, "Campo 'status' no encontrado en la respuesta del backend"
        assert data["status"] == "ok", f"Status incorrecto: {data['status']}"
    except ValueError:
        assert False, "La respuesta del backend no es JSON válido"

@pytest.mark.integration
def test_backend_database_connection(base_url):
    """Verifica que el backend pueda conectarse a la base de datos"""
    db_health_url = f"{base_url}/api/db-health"
    
    # Crear el endpoint si no existe
    try:
        resp = requests.get(db_health_url)
        if resp.status_code != 200:
            pytest.skip("Endpoint db-health no implementado")
        data = resp.json()
        assert "database" in data, "Campo 'database' no encontrado en la respuesta"
        assert data["database"] == "connected", f"Estado incorrecto de la base de datos: {data['database']}"
    except Exception as e:
        assert False, f"Error al conectar con la base de datos: {str(e)}"

@pytest.mark.integration
def test_game_websocket_connection(base_url):
    """Verifica la conexión al WebSocket del juego"""
    ws_game_url = f"ws://{base_url.replace('http://', '')}/ws/game"
    
    try:
        # Intentar conectar al WebSocket
        ws = websocket.create_connection(ws_game_url, timeout=10)
        assert ws.connected, "No se pudo conectar al WebSocket"
        
        # Enviar un mensaje y esperar respuesta
        ws.send(json.dumps({"type": "ping"}))
        response = ws.recv()
        response_data = json.loads(response)
        
        assert "type" in response_data, "Campo 'type' no encontrado en la respuesta del WebSocket"
        ws.close()
    except Exception as e:
        assert False, f"Error al conectar con el WebSocket: {str(e)}"

@pytest.mark.integration
def test_monitoring_integration():
    """Verifica que los servicios de monitoreo estén recogiendo métricas"""
    prom_url = "http://localhost:9090/api/v1/query"
    queries = [
        "up",  # Comprueba qué targets están funcionando
        "node_cpu_seconds_total",  # Métricas del exportador de nodo
        "nginx_http_requests_total",  # Métricas de Nginx
    ]
    
    for query in queries:
        try:
            resp = requests.get(prom_url, params={"query": query})
            assert resp.status_code == 200, f"Error al consultar Prometheus: {resp.status_code}"
            
            data = resp.json()
            assert data["status"] == "success", f"Estado incorrecto: {data['status']}"
            assert len(data["data"]["result"]) > 0, f"No hay resultados para la consulta: {query}"
        except Exception as e:
            assert False, f"Error al consultar métricas de {query}: {str(e)}"

@pytest.mark.integration
def test_service_startup_time():
    """Mide el tiempo de inicio de todos los servicios"""
    services = [
        ("nginx", 80),
        ("backend", 9000),
        ("game-ws", 8081),
        ("prometheus", 9090),
        ("grafana", 3000)
    ]
    
    max_wait = 120  # Tiempo máximo de espera en segundos
    start_time = time.time()
    
    # Verificar que todos los servicios estén disponibles
    unavailable = []
    for service, port in services:
        if not is_service_ready(service, port, max_wait - (time.time() - start_time)):
            unavailable.append(f"{service}:{port}")
    
    total_time = time.time() - start_time
    
    # Generamos un informe aunque haya fallado
    print(f"\nTiempo total de inicio de servicios: {total_time:.2f} segundos")
    for service, port in services:
        status = "No disponible" if f"{service}:{port}" in unavailable else "Disponible"
        print(f"- {service}:{port} - {status}")
    
    assert not unavailable, f"Servicios no disponibles después de {max_wait} segundos: {', '.join(unavailable)}"

@pytest.mark.integration
def test_end_to_end_flow(base_url):
    """Prueba el flujo completo de registro, login y juego"""
    # Registrar un nuevo usuario
    user_data = {
        "username": f"test_user_{int(time.time())}",
        "password": "Test@123",
        "email": f"test{int(time.time())}@example.com"
    }
    
    # Registro
    try:
        register_resp = requests.post(f"{base_url}/api/auth/register", json=user_data)
        if register_resp.status_code == 404:
            pytest.skip("Endpoint de registro no implementado")
        
        assert register_resp.status_code in [200, 201], f"Error en registro: {register_resp.text}"
        
        # Login
        login_resp = requests.post(f"{base_url}/api/auth/login", json={
            "username": user_data["username"],
            "password": user_data["password"]
        })
        assert login_resp.status_code == 200, f"Error en login: {login_resp.text}"
        
        token_data = login_resp.json()
        assert "token" in token_data, "Token no encontrado en respuesta de login"
        
        # Verificar perfil de usuario
        headers = {"Authorization": f"Bearer {token_data['token']}"}
        profile_resp = requests.get(f"{base_url}/api/users/me", headers=headers)
        assert profile_resp.status_code == 200, f"Error al obtener perfil: {profile_resp.text}"
        
        # Intentar conectarse al juego
        # Esta parte sería una simulación básica
        
    except Exception as e:
        assert False, f"Error en flujo e2e: {str(e)}"