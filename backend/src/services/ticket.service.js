import { ticketRepository } from "../repositories/ticket.repository.js";
import {
  toDbStatus,
  toDbPriority,
  serializeTicket,
  serializeComment,
  STATUS_TO_API,
} from "../utils/ticketMapper.js";

// Transiciones de estado permitidas (HU-2.3). Flujo lineal OPEN → IN_PROGRESS
// → CLOSED, permitiendo mantener el estado y reabrir un ticket (volver a OPEN).
// Se bloquea CLOSED → IN_PROGRESS directo: primero hay que reabrir.
const ALLOWED_TRANSITIONS = {
  OPEN: ["OPEN", "IN_PROGRESS", "CLOSED"],
  IN_PROGRESS: ["IN_PROGRESS", "CLOSED", "OPEN"],
  CLOSED: ["CLOSED", "OPEN"],
};

// El autor del ticket o un admin pueden gestionarlo.
function canManage(ticket, user) {
  return ticket.authorId === user.id || user.role === "ADMIN";
}

// Carga un ticket validando existencia (404) y acceso (403).
async function loadOwned(id, user) {
  const ticket = await ticketRepository.findById(id);
  if (!ticket) {
    throw { status: 404, message: "Ticket no encontrado" };
  }
  if (!canManage(ticket, user)) {
    throw { status: 403, message: "No tienes acceso a este ticket" };
  }
  return ticket;
}

export const ticketService = {
  // HU-2.1 — Crear ticket (estado inicial OPEN, asociado al usuario autenticado).
  async create(user, { title, description, priority }) {
    const data = {
      title,
      description,
      authorId: user.id,
    };
    if (priority !== undefined) {
      data.priority = toDbPriority(priority);
    }
    const ticket = await ticketRepository.create(data);
    return serializeTicket(ticket);
  },

  // HU-2.2 — Listar tickets con filtros opcionales por estado/prioridad.
  // Un usuario normal ve solo sus tickets; un admin ve todos.
  async list(user, { status, priority } = {}) {
    const where = {};
    if (user.role !== "ADMIN") {
      where.authorId = user.id;
    }
    if (status !== undefined) {
      where.status = toDbStatus(status);
    }
    if (priority !== undefined) {
      where.priority = toDbPriority(priority);
    }
    const tickets = await ticketRepository.findMany(where);
    return tickets.map(serializeTicket);
  },

  // HU-2.2 — Detalle de un ticket (incluye comentarios).
  async getById(user, id) {
    const ticket = await loadOwned(id, user);
    return serializeTicket(ticket);
  },

  // HU-2.3 — Actualizar ticket validando transiciones de estado.
  async update(user, id, { title, description, status, priority }) {
    const existing = await loadOwned(id, user);

    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (priority !== undefined) data.priority = toDbPriority(priority);

    if (status !== undefined) {
      const nextStatus = toDbStatus(status);
      const allowed = ALLOWED_TRANSITIONS[existing.status] ?? [];
      if (!allowed.includes(nextStatus)) {
        throw {
          status: 400,
          message: `Transición de estado inválida: ${STATUS_TO_API[existing.status]} → ${status}`,
        };
      }
      data.status = nextStatus;
    }

    const updated = await ticketRepository.update(id, data);
    return serializeTicket(updated);
  },

  // HU-2.4 — Eliminar ticket (cascada de comentarios vía schema).
  async remove(user, id) {
    await loadOwned(id, user);
    await ticketRepository.remove(id);
  },

  // HU-2.5 — Agregar comentario. Devuelve el ticket actualizado (lo que el
  // frontend re-renderiza tras comentar).
  async addComment(user, ticketId, content) {
    await loadOwned(ticketId, user);
    await ticketRepository.createComment({
      body: content,
      ticketId,
      authorId: user.id,
    });
    const updated = await ticketRepository.findById(ticketId);
    return serializeTicket(updated);
  },

  // HU-2.5 — Listar comentarios de un ticket.
  async listComments(user, ticketId) {
    await loadOwned(ticketId, user);
    const comments = await ticketRepository.findComments(ticketId);
    return comments.map(serializeComment);
  },

  // Métricas para el dashboard. Mismo alcance que el listado (propios / admin todos).
  async metrics(user) {
    const scope = user.role === "ADMIN" ? {} : { authorId: user.id };
    const [total, abiertos, enProceso, cerrados, prioridadAlta] = await Promise.all([
      ticketRepository.count(scope),
      ticketRepository.count({ ...scope, status: "OPEN" }),
      ticketRepository.count({ ...scope, status: "IN_PROGRESS" }),
      ticketRepository.count({ ...scope, status: "CLOSED" }),
      ticketRepository.count({ ...scope, priority: "HIGH" }),
    ]);
    return { total, abiertos, enProceso, cerrados, prioridadAlta };
  },
};
