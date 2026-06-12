import { Router } from "express";
import { ticketController } from "../controllers/ticket.controller.js";
import { authGuard } from "../middlewares/authGuard.js";

const router = Router();

// Todas las rutas de tickets están protegidas por JWT (HU-1.5).
router.use(authGuard);

// Métricas del dashboard. Debe declararse ANTES de "/:id" para que no lo capture.
router.get("/metrics", ticketController.metrics);

router.post("/", ticketController.create);
router.get("/", ticketController.list);

router.get("/:id", ticketController.detail);
router.put("/:id", ticketController.update);
router.delete("/:id", ticketController.remove);

router.post("/:id/comments", ticketController.addComment);
router.get("/:id/comments", ticketController.listComments);

export default router;
