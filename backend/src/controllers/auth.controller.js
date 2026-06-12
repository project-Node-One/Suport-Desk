import { authService } from "../services/auth.service.js";

export const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        throw { status: 400, message: "Nombre, email y contraseña son obligatorios" };
      }

      const user = await authService.register(name, email, password);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw { status: 400, message: "Email y contraseña son obligatorios" };
      }

      const data = await authService.login(email, password);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
};
