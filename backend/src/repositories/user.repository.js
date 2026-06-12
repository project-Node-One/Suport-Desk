import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const userRepository = {
  async findUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  async createUser(data) {
    return await prisma.user.create({
      data,
    });
  },
};
