import { ticketService } from "../services/ticket.service.js";

export const ticketController = {
  // POST /api/tickets
  async create(req, res, next) {
    try {
      const { title, description, priority } = req.body;
      if (!title || !description) {
        throw { status: 400, message: "Título y descripción son obligatorios" };
      }
      const ticket = await ticketService.create(req.user, { title, description, priority });
      res.status(201).json(ticket);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/tickets?status=&priority=
  async list(req, res, next) {
    try {
      const { status, priority } = req.query;
      const tickets = await ticketService.list(req.user, { status, priority });
      res.status(200).json(tickets);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/tickets/metrics
  async metrics(req, res, next) {
    try {
      const data = await ticketService.metrics(req.user);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/tickets/:id
  async detail(req, res, next) {
    try {
      const ticket = await ticketService.getById(req.user, req.params.id);
      res.status(200).json(ticket);
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/tickets/:id
  async update(req, res, next) {
    try {
      const { title, description, status, priority } = req.body;
      const ticket = await ticketService.update(req.user, req.params.id, {
        title,
        description,
        status,
        priority,
      });
      res.status(200).json(ticket);
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/tickets/:id
  async remove(req, res, next) {
    try {
      await ticketService.remove(req.user, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  // POST /api/tickets/:id/comments
  async addComment(req, res, next) {
    try {
      const content = req.body?.content?.trim();
      if (!content) {
        throw { status: 400, message: "El contenido del comentario es obligatorio" };
      }
      const ticket = await ticketService.addComment(req.user, req.params.id, content);
      res.status(201).json(ticket);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/tickets/:id/comments
  async listComments(req, res, next) {
    try {
      const comments = await ticketService.listComments(req.user, req.params.id);
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  },
};
