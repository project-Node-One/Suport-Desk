# Despliegue en VPS — AI Support Desk

Guía base para el despliegue (Integrante 4 — HU-4.3 / HU-4.4).

## Requisitos en el VPS
- Linux con acceso SSH.
- Docker y Docker Compose instalados.

## Pasos

```bash
# 1. Conectar por SSH
ssh usuario@IP_DEL_VPS

# 2. Clonar el repositorio
git clone <repo-url> && cd ai-support-desk

# 3. Crear el archivo de entorno de producción (NO se versiona)
#    Define POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, JWT_SECRET, etc.
nano infra/.env

# 4. Levantar el stack
cd infra
docker compose --env-file .env up -d --build

# 5. Verificar
curl http://localhost:3000/health
```

## Notas
- Configurar Nginx (`infra/nginx/default.conf`) como reverse proxy.
- Revisar reglas de firewall (puertos 80/443).
- Para HTTPS, considerar Certbot / Let's Encrypt.
