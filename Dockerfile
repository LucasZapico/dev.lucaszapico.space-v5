FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install all dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Production
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["pnpm", "start"]
