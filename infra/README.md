# Infraestructura

Orquestación con Docker Compose para el AI Support Desk.

## Requisitos

- Docker y Docker Compose v2+

## PostgreSQL en local (HU-4.1)

Levanta la base de datos para desarrollo. Es el entregable temprano que
desbloquea a los Integrantes 1 y 2.

```bash
cd infra
cp .env.example .env        # ajustar credenciales si se desea
docker compose up -d postgres
```

Verificar que está sana:

```bash
docker compose ps
docker compose exec postgres pg_isready -U postgres -d support_desk
```

Detener (los datos persisten en el volumen `postgres_data`):

```bash
docker compose down
```

Borrar también los datos:

```bash
docker compose down -v
```

## Conexión del backend (DATABASE_URL)

Con postgres corriendo en Docker y el backend en el host (`npm run dev`),
configurar en `backend/.env`:

```text
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/support_desk?schema=public"
```

El formato general es:

```text
postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@localhost:<POSTGRES_PORT>/<POSTGRES_DB>?schema=public
```

Si el backend corre dentro de Docker Compose, el host es el nombre del
servicio (`postgres`) en lugar de `localhost`; el compose ya inyecta esa
URL automáticamente al servicio `backend`.

## Stack completo: API + PostgreSQL (HU-4.2)

Construye la imagen del backend y levanta todo el stack. El backend espera
a que postgres esté sano, aplica las migraciones de Prisma pendientes
(`prisma migrate deploy`) y arranca la API.

```bash
cd infra
docker compose up -d --build
```

Verificar que la API responde:

```bash
curl http://localhost:3000/health
# {"status":"ok","service":"ai-support-desk-api"}
```

Ver logs del backend (migraciones + arranque):

```bash
docker compose logs -f backend
```

Notas del build (`backend/Dockerfile`):

- Imagen `node:20-alpine`; dependencias instaladas con `npm ci`
  (reproducible gracias a `package-lock.json`).
- `prisma generate` se ejecuta en build; `prisma migrate deploy` en cada
  arranque, por lo que las nuevas migraciones se aplican solas.
- `backend/.dockerignore` excluye `node_modules`, `.env` y tests de la
  imagen.

## Servicios definidos

| Servicio | Descripción | Puerto host |
|----------|-------------|-------------|
| `postgres` | PostgreSQL 16 (alpine) con volumen persistente y healthcheck | `5432` (configurable con `POSTGRES_PORT`) |
| `backend` | API Express dockerizada con healthcheck sobre `/health` | `3000` (configurable con `BACKEND_PORT`) |

## Carpetas

- `nginx/` — configuración del reverse proxy (HU-4.4)
- `deploy/` — notas y scripts de despliegue en VPS (HU-4.3)
