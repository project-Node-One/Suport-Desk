# AI Support Desk

Plataforma web full-stack para la **gestión de tickets e incidencias técnicas**. Los usuarios pueden registrarse, autenticarse, crear y gestionar tickets (estados, prioridades, comentarios) y visualizar métricas en un dashboard. Incluye una capa opcional de **IA** para clasificación/resumen automático de tickets.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML, JavaScript Vanilla, **Vite**, framework CSS a elección |
| Backend | **Node.js**, **Express**, **Prisma ORM**, **JWT**, **Swagger** |
| Base de datos | **PostgreSQL** |
| Infraestructura | **Docker**, **Docker Compose**, **VPS Linux** (SSH) |
| IA (opcional) | OpenAI / proveedor a elección |

### Arquitectura por capas (Backend)

```text
Controllers   →  Reciben la petición HTTP, validan y responden
    ↓
Services      →  Lógica de negocio (reglas, orquestación)
    ↓
Repositories  →  Acceso a datos vía Prisma
    ↓
Database      →  PostgreSQL
```

---

## Arquitectura de Carpetas

Monorepo con frontend, backend e infraestructura separados.

```text
ai-support-desk/
├── backend/
│   ├── src/
│   │   ├── config/           # Configuración (env, prisma client, swagger)
│   │   ├── controllers/      # Capa HTTP: reciben req/res
│   │   ├── services/         # Lógica de negocio
│   │   ├── repositories/     # Acceso a datos (Prisma)
│   │   ├── routes/           # Definición de endpoints y montaje
│   │   ├── middlewares/      # Auth JWT, manejo de errores, validación
│   │   ├── validators/       # Esquemas de validación de entrada
│   │   ├── utils/            # Helpers (hash, tokens, respuestas)
│   │   ├── docs/             # Configuración y specs de Swagger
│   │   ├── app.js            # Instancia de Express (middlewares + rutas)
│   │   └── server.js         # Arranque del servidor
│   ├── prisma/
│   │   ├── schema.prisma     # Modelos: User, Ticket, Comment
│   │   └── migrations/       # Migraciones generadas
│   ├── tests/                # Pruebas (opcional)
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes reutilizables (navbar, card, modal)
│   │   ├── pages/            # Vistas (login, register, tickets, dashboard)
│   │   ├── services/         # Cliente API (fetch a backend)
│   │   ├── store/            # Estado en memoria (sesión, usuario, tickets)
│   │   ├── styles/           # CSS / framework CSS
│   │   ├── utils/            # Helpers (formato fechas, guards de ruta)
│   │   └── main.js           # Punto de entrada
│   ├── public/               # Assets estáticos
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── infra/
│   ├── docker-compose.yml    # Orquestación: backend + postgres (+ frontend)
│   ├── nginx/                # Reverse proxy (deploy en VPS)
│   └── deploy/               # Scripts y notas de despliegue en VPS
│
├── docs/
│   ├── historias-de-usuario.md   # HU por integrante
│   └── arquitectura.md           # Decisiones técnicas (opcional)
│
├── .gitignore
├── docker-compose.yml        # (alternativa: en raíz si se prefiere)
└── README.md
```

---

## Reparto del Equipo (por capas/especialidad)

| # | Rol | Responsabilidad principal | Rama base |
|---|-----|---------------------------|-----------|
| **1** | **Tech Lead — Backend Core & Auth** | Setup del repo, arquitectura por capas, modelo Prisma, autenticación JWT (register/login), middlewares de seguridad | `feature/auth` |
| **2** | **Backend — Tickets & API** | CRUD de tickets, estados, prioridades, comentarios, documentación Swagger | `feature/tickets` |
| **3** | **Frontend & Dashboard** | Setup Vite, componentes, vistas (auth, tickets, dashboard), consumo de API | `feature/frontend` |
| **4** | **DevOps & IA** | Docker, Docker Compose, despliegue en VPS, y Feature AI (clasificación/resumen) | `feature/infra` |

> El **Integrante 1** arranca el esqueleto del repo y el modelo de datos **primero**, porque el resto depende de la base (estructura de carpetas, Prisma schema y contrato de auth). Ver dependencias en el documento de HU.

**Detalle completo de tareas, criterios de aceptación, ramas y orden:** [docs/historias-de-usuario.md](docs/historias-de-usuario.md)

---

## Estrategia de Ramas (GitFlow ligero)

```text
main ──────────────●────────────────●──────────  (estable / releases)
                   │                │
develop ──●──●──●──●──●──●──●──●──●──●──────────  (integración)
          │     │        │     │
feature/auth   feature/tickets  feature/frontend  feature/infra
```

- **`main`** → código estable y desplegable. Solo recibe merges desde `develop` en releases.
- **`develop`** → rama de integración. Todas las features se mergean aquí vía Pull Request.
- **`feature/*`** → una rama por área de trabajo (o por HU si es grande). Se parte **desde `develop`**.

### Convención de ramas
```text
feature/auth          feature/tickets        feature/frontend       feature/infra
feature/auth-jwt      feature/tickets-crud   feature/dashboard      feature/docker
```

### Flujo de trabajo por integrante
```bash
git checkout develop
git pull origin develop
git checkout -b feature/<area>
# ...trabajo + commits...
git push origin feature/<area>
# Abrir Pull Request hacia develop → revisión del equipo → merge
```

### Convención de commits (recomendada)
```text
feat: agrega endpoint de login
fix: corrige validación de prioridad
docs: actualiza swagger de tickets
chore: configura docker-compose
```

---

## Puesta en Marcha (Local)

> Requisitos: Node.js 18+, Docker y Docker Compose.

```bash
# 1. Clonar
git clone <repo-url> && cd ai-support-desk

# 2. Base de datos (Docker)
docker compose up -d postgres

# 3. Backend
cd backend
cp .env.example .env          # configurar DATABASE_URL, JWT_SECRET, etc.
npm install
npx prisma migrate dev        # crea las tablas
npm run dev                   # http://localhost:3000
# Swagger: http://localhost:3000/api-docs

# 4. Frontend
cd ../frontend
npm install
npm run dev                   # http://localhost:5173
```

---

## Despliegue

- **Backend dockerizado** y orquestado con `docker-compose` (backend + PostgreSQL).
- **Deploy en VPS Linux** vía SSH, con Nginx como reverse proxy.
- Variables sensibles gestionadas mediante archivos `.env` (no se versionan).

Ver guía en [infra/deploy/](infra/deploy/).

---

## Funcionalidades Mínimas (Definition of Done del proyecto)

- [ ] Registro e inicio de sesión con JWT
- [ ] CRUD completo de tickets
- [ ] Estados: Abierto / En proceso / Cerrado
- [ ] Prioridades de tickets
- [ ] Comentarios / notas internas
- [ ] Dashboard con métricas simples
- [ ] Persistencia en PostgreSQL (Prisma)
- [ ] Documentación Swagger
- [ ] Backend dockerizado
- [ ] Deploy funcional en VPS
- [ ] *(Opcional / puntos extra)* Feature AI
```

