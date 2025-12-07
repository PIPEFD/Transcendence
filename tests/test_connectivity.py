import pytest

TARGETS = [
    ("localhost", 9443),  # nginx HTTPS
    ("localhost", 9090),  # prometheus
    ("localhost", 3001),  # grafana
    ("localhost", 8081),  # cadvisor
]

@pytest.mark.smoke
@pytest.mark.integration
def test_service_ports_reachable():
    from conftest import can_connect
    unreachable = []
    for host, port in TARGETS:
        if not can_connect(host, port):
            unreachable.append(f"{host}:{port}")
    assert not unreachable, "No accesibles: " + ", ".join(unreachable)
