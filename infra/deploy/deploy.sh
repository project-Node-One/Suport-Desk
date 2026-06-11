#!/usr/bin/env bash
# Despliegue / actualizacion del stack en el VPS (HU-4.3).
#
# Hace pull del codigo, reconstruye las imagenes, levanta el stack de
# produccion y verifica que la API responda a traves de Nginx.
#
# Uso (desde cualquier ruta):
#   infra/deploy/deploy.sh
set -euo pipefail

# Ubicarse en infra/ (un nivel arriba de este script)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="$(dirname "$SCRIPT_DIR")"
cd "$INFRA_DIR"

COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env"
HTTP_PORT="${HTTP_PORT:-80}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: falta $INFRA_DIR/$ENV_FILE" >&2
  echo "       Copia .env.production.example a .env y completa los valores." >&2
  exit 1
fi

echo "==> Actualizando codigo (git pull)"
git pull --ff-only

echo "==> Construyendo y levantando el stack de produccion"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build

echo "==> Esperando a que la API responda en http://localhost:${HTTP_PORT}/health"
for _ in $(seq 1 30); do
  if curl -fsS "http://localhost:${HTTP_PORT}/health" >/dev/null 2>&1; then
    echo "==> OK: despliegue verificado."
    docker compose -f "$COMPOSE_FILE" ps
    exit 0
  fi
  sleep 2
done

echo "ERROR: la API no respondio a tiempo." >&2
echo "       Revisa los logs: docker compose -f $COMPOSE_FILE logs" >&2
exit 1
