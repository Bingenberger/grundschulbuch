FROM node:22.23.4-bookworm-slim@sha256:4b150b48b4116e2a22f2c39cc27025fbf4f153e2078fd3b14d159fdb5c7279da AS dependencies
ENV npm_config_cache=/tmp/npm-cache NEXT_TELEMETRY_DISABLED=1
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM dependencies AS builder
COPY next.config.ts tsconfig.json ./
COPY src ./src
COPY public ./public
RUN npm run build -- --webpack

FROM builder AS tests
COPY eslint.config.mjs ./
COPY scripts ./scripts
COPY test ./test
RUN npm run typecheck && npm run lint && npm test

FROM node:22.23.4-bookworm-slim@sha256:4b150b48b4116e2a22f2c39cc27025fbf4f153e2078fd3b14d159fdb5c7279da AS runtime
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 GRUNDSCHULBUCH_DATA_DIR=/data
WORKDIR /app
COPY --from=builder /build/.next/standalone ./
COPY --from=builder /build/.next/static ./.next/static
COPY --from=builder /build/public ./public
COPY --from=dependencies /build/node_modules/bcryptjs ./node_modules/bcryptjs
COPY scripts/start.mjs scripts/migrate.mjs scripts/bootstrap.mjs ./scripts/
COPY src/lib/store.mjs src/lib/sessions.mjs src/lib/accounts.mjs ./src/lib/
RUN groupadd --gid 10001 buch && useradd --uid 10001 --gid 10001 --no-create-home buch \
    && mkdir -p /data && chown 10001:10001 /data && chmod 700 /data
USER 10001:10001
EXPOSE 3000
CMD ["node", "scripts/start.mjs"]
