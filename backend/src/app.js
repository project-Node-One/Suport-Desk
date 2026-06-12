import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import { setupSwagger } from "./docs/swagger.js";

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173").split(",");
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "ai-support-desk-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
setupSwagger(app);

// Manejo de errores básico (último middleware)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status ?? 500).json({ error: err.message ?? "Internal Server Error" });
});

export default app;
