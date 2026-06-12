import { prisma } from "../config/prisma.js";

// Capa de acceso a datos para tickets y comentarios. Sin lógica de negocio:
// solo consultas Prisma. La traducción de enums se hace en el service.

const commentsInclude = {
  comments: { orderBy: { createdAt: "asc" } },
};

export const ticketRepository = {
  async create(data) {
    return prisma.ticket.create({ data });
  },

  async findMany(where) {
    return prisma.ticket.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id) {
    return prisma.ticket.findUnique({
      where: { id },
      include: commentsInclude,
    });
  },

  async update(id, data) {
    return prisma.ticket.update({
      where: { id },
      data,
      include: commentsInclude,
    });
  },

  async remove(id) {
    // Los comentarios se eliminan en cascada (onDelete: Cascade en el schema).
    return prisma.ticket.delete({ where: { id } });
  },

  async createComment(data) {
    return prisma.comment.create({ data });
  },

  async findComments(ticketId) {
    return prisma.comment.findMany({
      where: { ticketId },
      orderBy: { createdAt: "asc" },
    });
  },

  async count(where) {
    return prisma.ticket.count({ where });
  },
};
