import requests
import socket
import time
from typing import Iterable

BAD_GATEWAY_CODES = {502, 503, 504, 521, 522, 523}

def assert_not_gateway_error(resp: requests.Response):
    assert resp.status_code not in BAD_GATEWAY_CODES, (
        f"Gateway error {resp.status_code} for {resp.request.method} {resp.url}"
    )

def any_code(resp: requests.Response, ok: Iterable[int]):
    assert resp.status_code in ok, f"{resp.url} -> {resp.status_code}, esperado {ok}"

def is_service_ready(host: str, port: int, timeout: float = 60.0) -> bool:
    """
    Verifica si un servicio está listo comprobando repetidamente la conexión al puerto.
    
    Args:
        host: Nombre del host del servicio
        port: Puerto del servicio
        timeout: Tiempo máximo de espera en segundos
        
    Returns:
        bool: True si el servicio está listo, False en caso contrario
    """
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            with socket.create_connection((host, port), timeout=5):
                return True
        except (socket.timeout, ConnectionRefusedError, OSError):
            time.sleep(2)
    return False
