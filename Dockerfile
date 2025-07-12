# syntax=docker/dockerfile:1

FROM node:22.16.0-alpine AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY . .
RUN pnpm install --frozen-lockfile

# --- Development image ---
FROM builder AS development
EXPOSE 3000
CMD ["sh", "-c", "pnpm run db:migrate:dev && pnpm run dev"]

# --- Production image ---
FROM node:22.16.0-alpine AS production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

RUN apk update
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache openssl

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma

RUN pnpm install --frozen-lockfile --prod=true

CMD ["sh", "-c", "pnpm db:migrate:prod && pnpm start"]
