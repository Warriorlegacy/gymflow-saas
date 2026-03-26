FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.json tailwind.config.js next.config.js ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm install
RUN pnpm --filter @gymflow/web build
EXPOSE 3000
CMD ["pnpm", "--filter", "@gymflow/web", "start"]

