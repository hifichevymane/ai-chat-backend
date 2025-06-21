# syntax=docker/dockerfile:1
FROM node:22.16.0-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install

# Copy the rest of the code
COPY . .

# Expose app port (default 8000)
EXPOSE 8000

# Start in dev mode
CMD ["sh", "-c", "pnpm run db:deploy && pnpm run dev"]
