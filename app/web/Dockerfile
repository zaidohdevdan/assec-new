# Stage 1: Install Dependencies
FROM node:20-alpine AS deps

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the application code
COPY . .

# Pass build arguments to env variables
ARG NEXT_PUBLIC_API_URL=/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Create production build of Next.js
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner

# Set the build argument for API URL
WORKDIR /app

# Create a non-root user for security
RUN addgroup --gid 1001 nodejs && adduser --uid 1001 --gid 1001 --system nextjs

# Copy Next.js build output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set environment variables
USER nextjs

# Expose the port
EXPOSE 3000
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the server
CMD ["node", "server.js"]
