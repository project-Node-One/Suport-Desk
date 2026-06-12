import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export const authService = {
  async register(name, email, password) {
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      throw { status: 400, message: "El email ya está registrado" };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userRepository.createUser({
      name,
      email,
      password: hashedPassword,
    });

    // Remover el password antes de devolver el usuario
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async login(email, password) {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw { status: 401, message: "Credenciales inválidas" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: 401, message: "Credenciales inválidas" };
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },
};
