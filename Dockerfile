# Stage 1: Build the application
FROM node:20 AS builder

WORKDIR /usr/src/app

# Copiar archivos de dependencias y el esquema de Prisma
COPY package*.json ./
COPY prisma ./prisma

# Instalar dependencias y generar el cliente de Prisma
RUN npm install
RUN npx prisma generate

# Copiar el resto del código
COPY . .

# Compilar TypeScript a JavaScript
RUN npm run build

# Stage 2: Create the final lightweight image
FROM node:20-alpine

WORKDIR /usr/src/app

# Instalar dependencias del sistema (libssl y otras)
RUN apk add --no-cache openssl

# Copiar solo lo necesario desde la etapa de construcción
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma
COPY wait-db.sh /usr/src/app/wait-db.sh

# Dar permisos de ejecución al script
RUN chmod +x /usr/src/app/wait-for-db.sh

# Instalar solo las dependencias de producción
RUN npm install --production

# Exponer el puerto
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["sh", "-c", "/usr/src/app/wait-db.sh && npx prisma migrate deploy && npm start"]