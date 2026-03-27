FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable
RUN npm install -g pnpm@9

# Copy workspace config
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.json ./

# Copy app and package source
COPY apps/web/package.json apps/web/
COPY apps/backend/package.json apps/backend/
COPY packages/lib/package.json packages/lib/
COPY packages/ui/package.json packages/ui/
COPY packages/services/package.json packages/services/

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source code
COPY apps/web/ apps/web/
COPY apps/backend/ apps/backend/
COPY packages/ packages/

# Build shared packages first
RUN pnpm --filter @gymflow/lib build || true
RUN pnpm --filter @gymflow/ui build || true
RUN pnpm --filter @gymflow/services build || true

# Build web
RUN pnpm --filter @gymflow/web build

# Production stage for web
FROM node:20-alpine AS web
WORKDIR /app
RUN corepack enable
RUN npm install -g pnpm@9
COPY --from=base /app /app
EXPOSE 3000
CMD ["pnpm", "--filter", "@gymflow/web", "start"]

# Production stage for backend
FROM node:20-alpine AS backend
WORKDIR /app
RUN corepack enable
RUN npm install -g pnpm@9
COPY --from=base /app /app
EXPOSE 4000
CMD ["pnpm", "--filter", "@gymflow/backend", "start"]
