# Despliegue en VPS — AI Support Desk

Guía de despliegue del Integrante 4 (HU-4.3 / HU-4.4).

El stack de producción se define en [`infra/docker-compose.prod.yml`](../docker-compose.prod.yml)
y está endurecido respecto al de desarrollo:

- `postgres` y `backend` **no se exponen al host**; solo viven en la red interna de Docker.
- El único punto de entrada público es **Nginx** (puerto 80; 443 con HU-4.4).
- Las migraciones de Prisma (`prisma migrate deploy`) se aplican al arrancar el backend.

## Requisitos en el VPS

- Linux con acceso SSH.
- Docker y Docker Compose v2 instalados.
- Firewall (ufw) permitiendo solo lo necesario: 22 (SSH), 80 y 443.
  **No** abrir 5432 ni 3000 al exterior.

## Despliegue paso a paso

```bash
# 1. Conectar por SSH
ssh usuario@IP_DEL_VPS

# 2. Clonar el repositorio
git clone <repo-url> && cd <repo>

# 3. Crear el archivo de entorno de produccion (NO se versiona)
cd infra
cp .env.production.example .env
nano .env          # completar con valores REALES (ver abajo)

# 4. Levantar el stack y verificar (script automatizado)
./deploy/deploy.sh
#   equivale a:
#   docker compose -f docker-compose.prod.yml --env-file .env up -d --build
#   curl http://localhost/health
```

## Variables de entorno productivas

Se definen en `infra/.env` (a partir de [`.env.production.example`](../.env.production.example)).
**No se versionan.** Mínimos a cambiar:

| Variable | Notas |
|----------|-------|
| `POSTGRES_USER` / `POSTGRES_DB` | Nombre de usuario y base. |
| `POSTGRES_PASSWORD` | Password fuerte (no el de ejemplo). |
| `JWT_SECRET` | Generar con `openssl rand -hex 32`. |
| `ALLOWED_ORIGINS` | Dominio(s) del frontend, sin barra final. |

## Actualizar un despliegue existente

```bash
cd <repo>/infra
./deploy/deploy.sh      # hace git pull + rebuild + up -d + verificacion
```

## Operación

```bash
cd infra
# Estado de los servicios
docker compose -f docker-compose.prod.yml ps
# Logs (backend = migraciones + arranque)
docker compose -f docker-compose.prod.yml logs -f backend
# Detener (los datos persisten en el volumen postgres_data)
docker compose -f docker-compose.prod.yml down
```

## Probar el stack de producción en local

Antes de tener el VPS se puede validar todo en tu máquina:

```bash
cd infra
cp .env.production.example .env     # valores de prueba; si el puerto 80
                                    # esta ocupado, ajustar HTTP_PORT
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
curl http://localhost/health        # -> {"status":"ok",...} via Nginx
docker compose -f docker-compose.prod.yml down
```

## Troubleshooting

- **`P1000: Authentication failed` al arrancar el backend.** Suele pasar al
  cambiar `POSTGRES_USER`/`POSTGRES_PASSWORD` reutilizando un volumen ya
  inicializado: Postgres solo crea el usuario/clave en el **primer** arranque
  con el volumen vacío. Solución: recrear con volumen limpio
  (`docker compose -f docker-compose.prod.yml down -v` y volver a `up`).
  En un VPS nuevo no ocurre porque el volumen arranca vacío.
- **`502 Bad Gateway` desde Nginx.** El backend aún no terminó de arrancar
  (mira `docker compose -f docker-compose.prod.yml ps`; espera a `healthy`).

## Pendiente (HU-4.4)

- `server_name` real en [`infra/nginx/default.conf`](../nginx/default.conf).
- HTTPS con Certbot / Let's Encrypt (puerto 443).
