import swaggerUi from "swagger-ui-express";

// Especificación OpenAPI 3 de AI Support Desk (HU-2.6).
// Los valores de estado/prioridad son los del contrato público (español).
const openapiSpec = {
  openapi: "3.0.0",
  info: {
    title: "AI Support Desk API",
    version: "1.0.0",
    description:
      "API REST de gestión de tickets de soporte (Express + Prisma + PostgreSQL). " +
      "Autenticación con JWT Bearer. Estados y prioridades se exponen en español.",
  },
  servers: [{ url: "/api", description: "Base path de la API" }],
  tags: [
    { name: "Auth", description: "Registro e inicio de sesión" },
    { name: "Tickets", description: "Gestión de tickets y comentarios" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["USER", "ADMIN"] },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Comment: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          content: { type: "string" },
          authorId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Ticket: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["abierto", "en_proceso", "cerrado"] },
          priority: { type: "string", enum: ["baja", "media", "alta"] },
          authorId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          comments: { type: "array", items: { $ref: "#/components/schemas/Comment" } },
        },
      },
      Metrics: {
        type: "object",
        properties: {
          total: { type: "integer" },
          abiertos: { type: "integer" },
          enProceso: { type: "integer" },
          cerrados: { type: "integer" },
          prioridadAlta: { type: "integer" },
        },
      },
      Error: {
        type: "object",
        properties: { error: { type: "string" } },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Registrar un usuario",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Usuario creado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } },
          },
          400: {
            description: "Datos inválidos o email ya registrado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Iniciar sesión y obtener un JWT",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login correcto",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" },
                    token: { type: "string" },
                  },
                },
              },
            },
          },
          401: {
            description: "Credenciales inválidas",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
        },
      },
    },
    "/tickets": {
      get: {
        tags: ["Tickets"],
        summary: "Listar tickets (propios; admin ve todos)",
        parameters: [
          {
            name: "status",
            in: "query",
            schema: { type: "string", enum: ["abierto", "en_proceso", "cerrado"] },
          },
          {
            name: "priority",
            in: "query",
            schema: { type: "string", enum: ["baja", "media", "alta"] },
          },
        ],
        responses: {
          200: {
            description: "Lista de tickets",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Ticket" } },
              },
            },
          },
          401: { description: "No autenticado" },
        },
      },
      post: {
        tags: ["Tickets"],
        summary: "Crear un ticket",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "description"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  priority: { type: "string", enum: ["baja", "media", "alta"], default: "media" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Ticket creado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Ticket" } } },
          },
          400: { description: "Datos inválidos" },
          401: { description: "No autenticado" },
        },
      },
    },
    "/tickets/metrics": {
      get: {
        tags: ["Tickets"],
        summary: "Métricas de tickets para el dashboard",
        responses: {
          200: {
            description: "Conteos agregados",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Metrics" } } },
          },
          401: { description: "No autenticado" },
        },
      },
    },
    "/tickets/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      get: {
        tags: ["Tickets"],
        summary: "Detalle de un ticket (con comentarios)",
        responses: {
          200: {
            description: "Ticket",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Ticket" } } },
          },
          403: { description: "Sin acceso" },
          404: { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Tickets"],
        summary: "Actualizar un ticket (solo autor o admin)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string", enum: ["abierto", "en_proceso", "cerrado"] },
                  priority: { type: "string", enum: ["baja", "media", "alta"] },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Ticket actualizado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Ticket" } } },
          },
          400: { description: "Transición de estado o datos inválidos" },
          403: { description: "Sin permiso" },
          404: { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Tickets"],
        summary: "Eliminar un ticket (solo autor o admin)",
        responses: {
          204: { description: "Eliminado" },
          403: { description: "Sin permiso" },
          404: { description: "No encontrado" },
        },
      },
    },
    "/tickets/{id}/comments": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
      get: {
        tags: ["Tickets"],
        summary: "Listar comentarios de un ticket",
        responses: {
          200: {
            description: "Lista de comentarios",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Comment" } },
              },
            },
          },
          403: { description: "Sin acceso" },
          404: { description: "No encontrado" },
        },
      },
      post: {
        tags: ["Tickets"],
        summary: "Agregar un comentario (devuelve el ticket actualizado)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["content"],
                properties: { content: { type: "string" } },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Comentario agregado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Ticket" } } },
          },
          400: { description: "Contenido vacío" },
          403: { description: "Sin acceso" },
          404: { description: "No encontrado" },
        },
      },
    },
  },
};

export function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
}
