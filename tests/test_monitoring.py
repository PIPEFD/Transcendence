import pytest
import requests
from conftest import wait_http_200
from utils import any_code

EXPORTERS = [
    ("http://localhost:8081/metrics", "cadvisor"),
]

@pytest.mark.monitoring
@pytest.mark.integration
def test_prometheus_ready(prom_url):
    r = wait_http_200(f"{prom_url}/-/ready")
    assert "text/plain" in r.headers.get("Content-Type", "")

@pytest.mark.monitoring
@pytest.mark.integration
def test_prometheus_query_up(prom_url):
    r = requests.get(f"{prom_url}/api/v1/query", params={"query": "up"}, timeout=8)
    any_code(r, [200])
    payload = r.json()
    assert payload.get("status") == "success"
    assert isinstance(payload.get("data", {}).get("result", []), list)

@pytest.mark.monitoring
@pytest.mark.integration
def test_exporters_metrics_available():
    missing = []
    for url, name in EXPORTERS:
        try:
            r = requests.get(url, timeout=8)
            if r.status_code != 200 or "HELP" not in r.text:
                missing.append(f"{name} -> {url} ({r.status_code})")
        except requests.exceptions.RequestException as e:
            missing.append(f"{name} -> {url} (error: {e})")
    if missing:
        pytest.skip(f"Exporters opcionales no disponibles: {', '.join(missing)}")

@pytest.mark.monitoring
@pytest.mark.integration
def test_grafana_login_page(grafana_cfg):
    try:
        r = requests.get(f"{grafana_cfg['url']}/login", timeout=8, allow_redirects=True)
        any_code(r, [200, 302])
    except requests.exceptions.RequestException as e:
        pytest.skip(f"Grafana no disponible en {grafana_cfg['url']}: {e}")

@pytest.mark.monitoring
@pytest.mark.integration
def test_grafana_api_health_if_creds(grafana_cfg):
    if not grafana_cfg["user"] or not grafana_cfg["password"]:
        pytest.skip("Sin credenciales Grafana")
    r = requests.get(
        f"{grafana_cfg['url']}/api/health",
        auth=(grafana_cfg["user"], grafana_cfg["password"]),
        timeout=8,
    )
    any_code(r, [200])
    assert r.json().get("database") == "ok"
