import { PrismaClient } from "@prisma/client";

// Cliente Prisma compartido por toda la app (capa repositories).
export const prisma = new PrismaClient();
