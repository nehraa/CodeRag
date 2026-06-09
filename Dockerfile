# syntax=docker/dockerfile:1.7
# Multi-stage Dockerfile for @abhinav2203/coderag.
# Build a production image that exposes the HTTP service (default port 4119)
# and can also run the CLI / MCP server over stdio.

ARG NODE_VERSION=20

# ---------- build stage ----------
FROM node:${NODE_VERSION}-bookworm-slim AS build
WORKDIR /app

# Install build dependencies first so they cache across source changes.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Build the TypeScript sources to dist/.
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Prune dev dependencies so we can copy a clean node_modules to the runtime image.
RUN npm prune --omit=dev

# ---------- runtime stage ----------
FROM node:${NODE_VERSION}-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    CODERAG_REPO_PATH=/repo \
    CODERAG_STORAGE_ROOT=/data/.coderag \
    CODERAG_SERVICE_HOST=0.0.0.0 \
    CODERAG_SERVICE_PORT=4119

# Create and switch to a non-root user for the running container.
RUN groupadd --system --gid 1001 coderag \
    && useradd  --system --uid 1001 --gid coderag --create-home --shell /usr/sbin/nologin coderag \
    && mkdir -p /data /repo \
    && chown -R coderag:coderag /app /data /repo

COPY --from=build --chown=coderag:coderag /app/node_modules ./node_modules
COPY --from=build --chown=coderag:coderag /app/dist         ./dist
COPY --from=build --chown=coderag:coderag /app/package.json  ./package.json

USER coderag

# HTTP service / metrics / health endpoints.
EXPOSE 4119

# Default to serving the HTTP API. Override the command to run other subcommands,
# e.g. `docker run ... coderag serve-mcp` for the stdio MCP server, or
# `docker run ... coderag init` to build the index inside /repo.
CMD ["node", "dist/bin/coderag.js", "serve-http"]
