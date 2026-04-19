# syntax=docker/dockerfile:1.7

# Build context = repo root (see deploy/docker-compose.yml).

# ---- deps: install node_modules in a dedicated layer ----
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY app/frontend/package.json app/frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prefer-offline


# ---- builder: next build with standalone output ----
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY app/frontend/ ./
# NEXT_PUBLIC_* values are baked into the bundle at build time. Override via
# --build-arg for prod builds (e.g. NEXT_PUBLIC_API_URL=https://api.gyeol.co).
ARG NEXT_PUBLIC_API_URL=https://api.gyeol.co
ARG NEXT_PUBLIC_S3_HOSTNAME=gyeol.s3.ap-southeast-2.amazonaws.com
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_S3_HOSTNAME=$NEXT_PUBLIC_S3_HOSTNAME
RUN pnpm build


# ---- runtime: only standalone output + static + public ----
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# `node:20-alpine` already has a `node` user (uid 1000). Reuse instead of
# creating a duplicate that would conflict on gid 1000.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
# `public/` is optional — the repo currently has no static assets.

USER node
EXPOSE 3000
CMD ["node", "server.js"]
