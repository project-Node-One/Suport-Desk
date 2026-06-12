# AI Support Desk — Frontend

Frontend del proyecto **AI Support Desk**, construido con **Vite + JavaScript Vanilla + Bootstrap**.

## Estructura

```
src/
├── main.js              # punto de entrada, registra rutas
├── router/
│   └── router.js        # router basado en hash con rutas dinámicas y guards de sesión
├── components/
│   └── ui.js             # helper el(), Navbar, Badge, TicketCard (Bootstrap)
├── pages/
│   ├── LoginPage.js
│   ├── RegisterPage.js
│   ├── TicketsPage.js
│   ├── TicketDetailPage.js
│   ├── DashboardPage.js
│   └── NotFoundPage.js
├── services/
│   ├── api.js            # cliente fetch base con JWT
│   ├── auth.js           # login, registro, sesión
│   └── tickets.js        # CRUD de tickets, comentarios, métricas
└── styles/
    └── main.css          # tema oscuro azul/negro sobre Bootstrap
```

## HUs cubiertas

- **HU-3.1** — Setup de Vite y estructura de componentes
- **HU-3.2** — Vistas de Login y Registro
- **HU-3.3** — Cliente API y manejo de sesión (JWT en localStorage)
- **HU-3.4** — Listado y creación de tickets
- **HU-3.5** — Detalle, edición y comentarios
- **HU-3.6** — Dashboard con métricas
- **HU-3.7** — Diseño responsive (Bootstrap grid)

## Configuración

Copia `.env.example` a `.env` y ajusta la URL del backend:

```bash
cp .env.example .env
```

```
VITE_API_URL=http://localhost:3000/api
```

## Uso

```bash
npm install
npm run dev      # desarrollo
npm run build    # build de producción
npm run preview  # previsualizar build
```

## Notas

- El frontend espera un backend REST con los endpoints: `/auth/register`, `/auth/login`, `/tickets`, `/tickets/:id`, `/tickets/:id/comments`, `/tickets/metrics`.
- El router protege automáticamente las rutas privadas (`/tickets`, `/dashboard`) redirigiendo a `/login` si no hay sesión.
