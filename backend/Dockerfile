FROM node:20-alpine

# OpenSSL es requerido por los engines de Prisma en Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Dependencias primero para aprovechar la cache de capas
COPY package*.json ./
RUN npm ci

# Genera el cliente de Prisma a partir del schema
COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3000

# Aplica migraciones pendientes y arranca la API
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
