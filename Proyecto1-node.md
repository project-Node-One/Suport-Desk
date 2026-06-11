## Descripción General

**AI Support Desk** será una plataforma web de gestión de tickets e incidencias técnicas.

Los equipos deberán construir un sistema full stack moderno donde los usuarios puedan registrarse, autenticarse, crear tickets, gestionar estados y visualizar información en dashboards simples.

---

## Objetivo Pedagógico

El objetivo principal de este proyecto es la construcción de una aplicación full stack moderna utilizando:

- Frontend con Vite.
- Backend con Node.js.
- Express.
- Prisma ORM.
- PostgreSQL.

También se busca introducir:

- Despliegue manual en VPS.
- Contenerización básica con Docker.

---

## Tecnologías Obligatorias

### Frontend

- HTML
- JavaScript Vanilla
- Vite
- Framework CSS a elección

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT
- Swagger

### Infraestructura

- VPS Linux
- SSH
- Docker
- Docker Compose

---

## Funcionalidades Mínimas

### Autenticación

- Sistema de registro (Register).
- Sistema de inicio de sesión (Login).

### Gestión de Tickets

- CRUD completo de tickets.
- Estados de tickets:
  - Abierto
  - En proceso
  - Cerrado
- Prioridades de tickets.
- Comentarios o notas internas.

### Dashboard

- Dashboard básico con métricas simples.

### Persistencia y Documentación

- Persistencia en PostgreSQL.
- Documentación Swagger.

### Infraestructura

- Backend dockerizado.
- Deploy funcional en VPS.

---

## Arquitectura Recomendada

Se recomienda una arquitectura por capas utilizando:

```text
Controllers
    ↓
Services
    ↓
Repositories
    ↓
Database
```

### Frontend

El frontend debe mantenerse modularizado mediante:

- Componentes simples.
- Separación de responsabilidades.
- Organización clara de carpetas.
- Reutilización de código.

---

## 1 - Fase

#### Objetivos

- Construcción del frontend con Vite.
- Componentización.
- Diseño responsive.
- Consumo de APIs.
- Formularios.
- Deploy del frontend en VPS.

#### Entregables

- Interfaz funcional.
- Navegación completa.
- Formularios operativos.
- Consumo de endpoints simulados o reales.

---

## 2 - Fase

#### Objetivos

- Construcción del backend con Express.
- Conexión de PostgreSQL mediante Prisma.
- Implementación de autenticación JWT.
- Documentación Swagger.
- Dockerización.
- Conexión frontend/backend.

#### Entregables

- API REST funcional.
- Base de datos conectada.
- Autenticación operativa.
- Documentación Swagger disponible.
- Aplicación desplegada.

---

## Feature AI (Opcional)

Los equipos deberán integrar funcionalidades de Inteligencia Artificial para obtener puntos adicionales.

### Ideas de implementación

- Resumen automático de tickets.
- Clasificación automática de prioridades.
- Sugerencias de respuesta para soporte.
- Generación de títulos para incidencias.
- Categorización automática de tickets.

---

## Resultado Esperado

se entregar una aplicación full stack funcional que incluya:

- Frontend desarrollado con Vite.
- Backend desarrollado con Node.js y Express.
- Base de datos PostgreSQL.
- ORM Prisma.
- Autenticación JWT.
- Documentación Swagger.
- Dockerización básica.
- Despliegue funcional en VPS.
- Flujo completo de gestión de tickets.

El proyecto debe demostrar conocimientos de desarrollo moderno, integración frontend/backend, persistencia de datos, despliegue y trabajo colaborativo.