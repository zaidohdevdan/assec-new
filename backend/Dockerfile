# Stage 1: Build
FROM node:20-alpine AS builder
# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy prisma directory
COPY prisma/ ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine

WORKDIR /app

# Cria usuário não-root por segurança
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Copia apenas o necessário do estágio de build
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

# Set environment variables
USER nestjs

# Expose the port
EXPOSE 3001

# Healthcheck para o Docker saber se a API está viva
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "dist/src/main"]