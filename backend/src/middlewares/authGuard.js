import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const authGuard = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw { status: 401, message: "Token ausente o inválido" };
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Inyecta id y role del payload
      next();
    } catch (err) {
      throw { status: 401, message: "Token inválido o expirado" };
    }
  } catch (error) {
    next(error);
  }
};
