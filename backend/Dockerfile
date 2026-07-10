# ------------------------------------------------------------
# SupportCopilot Backend Dockerfile
# ------------------------------------------------------------

FROM node:20-bookworm-slim AS base

WORKDIR /app

# Prisma requires OpenSSL
RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# ------------------------------------------------------------
# Install dependencies
# ------------------------------------------------------------
FROM base AS deps

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

# ------------------------------------------------------------
# Build
# ------------------------------------------------------------
FROM base AS build

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# ------------------------------------------------------------
# Runtime
# ------------------------------------------------------------
FROM base AS runtime

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist
COPY package*.json ./

EXPOSE 4000

CMD ["node", "dist/src/index.js"]