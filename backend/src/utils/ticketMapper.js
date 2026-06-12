// Mapeo entre el contrato público de la API (español, el que consume el
// frontend) y los enums del schema Prisma (inglés). Toda la traducción vive
// aquí para no contaminar repositorios ni controladores.

export const STATUS_TO_DB = {
  abierto: "OPEN",
  en_proceso: "IN_PROGRESS",
  cerrado: "CLOSED",
};

export const STATUS_TO_API = {
  OPEN: "abierto",
  IN_PROGRESS: "en_proceso",
  CLOSED: "cerrado",
};

export const PRIORITY_TO_DB = {
  baja: "LOW",
  media: "MEDIUM",
  alta: "HIGH",
};

export const PRIORITY_TO_API = {
  LOW: "baja",
  MEDIUM: "media",
  HIGH: "alta",
};

// Convierte un estado del API (español) al enum de la BD. Lanza 400 si es inválido.
export function toDbStatus(apiValue) {
  const db = STATUS_TO_DB[apiValue];
  if (!db) {
    throw { status: 400, message: `Estado inválido: "${apiValue}". Use abierto, en_proceso o cerrado.` };
  }
  return db;
}

// Convierte una prioridad del API (español) al enum de la BD. Lanza 400 si es inválida.
export function toDbPriority(apiValue) {
  const db = PRIORITY_TO_DB[apiValue];
  if (!db) {
    throw { status: 400, message: `Prioridad inválida: "${apiValue}". Use baja, media o alta.` };
  }
  return db;
}

// Serializa un comentario de la BD al contrato del frontend (campo `content`).
export function serializeComment(comment) {
  return {
    id: comment.id,
    content: comment.body,
    authorId: comment.authorId,
    createdAt: comment.createdAt,
  };
}

// Serializa un ticket de la BD al contrato del frontend (enums en español).
// Incluye `comments` solo si vienen cargados desde Prisma.
export function serializeTicket(ticket) {
  const out = {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: STATUS_TO_API[ticket.status] ?? ticket.status,
    priority: PRIORITY_TO_API[ticket.priority] ?? ticket.priority,
    authorId: ticket.authorId,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };

  if (Array.isArray(ticket.comments)) {
    out.comments = ticket.comments.map(serializeComment);
  }

  return out;
}
