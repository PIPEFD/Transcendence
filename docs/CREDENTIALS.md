# 🔐 Credenciales de Acceso - Transcendence

## 📊 Servicios de Monitoreo

### Prometheus (vía Nginx)
- **URL**: `https://localhost:9443/prometheus/`
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Acceso Directo (sin auth)**: `http://localhost:9090`

### Grafana
- **URL**: `https://localhost:9443/grafana/` o `http://localhost:3001`
- **Usuario**: `admin`
- **Contraseña**: Ver archivo `config/secrets/grafana_admin_password.secret`
- **Contraseña actual**: `917ObPvwsoztzxNA`

### cAdvisor
- **URL**: `http://localhost:8081/cadvisor/containers/`
- **Sin autenticación**

### Weave Scope
- **URL**: `http://localhost:4040` (cuando esté configurado correctamente)
- **Usuario**: `scopeadmin`
- **Contraseña**: `ChangeThisPassword!` (o ver `config/secrets/scope_htpasswd.secret`)

## 🔧 Archivos de Credenciales

```bash
# Ver contraseña de Grafana
cat config/secrets/grafana_admin_password.secret

# Ver usuario de Grafana
cat config/secrets/grafana_admin_user.secret

# Ver htpasswd de Prometheus/Scope
cat config/auth/.htpasswd
```

## 📝 Comandos de Acceso

### Con curl (Prometheus):
```bash
# Con autenticación
curl -u admin:admin123 https://localhost:9443/prometheus/-/healthy

# Directo (sin proxy)
curl http://localhost:9090/-/healthy
```

### Con navegador:
```
https://localhost:9443/prometheus/
Usuario: admin
Contraseña: admin123
```

## 🔄 Regenerar Credenciales

### Prometheus (htpasswd):
```bash
# Usando Docker
docker run --rm httpd:alpine htpasswd -nb admin "NUEVA_PASSWORD" > config/auth/.htpasswd

# Reiniciar Nginx
docker compose -f ./compose/docker-compose.yml --profile monitoring restart nginx
```

### Grafana:
```bash
# Editar archivo de secreto
echo "NUEVA_PASSWORD" > config/secrets/grafana_admin_password.secret

# Reiniciar Grafana
docker compose -f ./compose/docker-compose.yml --profile monitoring restart grafana
```

## ⚠️ Seguridad

**IMPORTANTE**: Estas credenciales son para desarrollo local. En producción:

1. Usar contraseñas seguras generadas aleatoriamente
2. No compartir credenciales en repositorios públicos
3. Usar variables de entorno o gestores de secretos
4. Cambiar contraseñas predeterminadas
5. Implementar rotación de credenciales

## 📚 Referencias

- HTPasswd Generator: https://httpd.apache.org/docs/2.4/programs/htpasswd.html
- Grafana Security: https://grafana.com/docs/grafana/latest/setup-grafana/configure-security/
- Prometheus Basic Auth: https://prometheus.io/docs/guides/basic-auth/
