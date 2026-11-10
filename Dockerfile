FROM node:22-bookworm-slim AS deps

WORKDIR /app
RUN corepack enable && corepack prepare yarn@1.22.22 --activate
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:22-bookworm-slim AS builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare yarn@1.22.22 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY package.json yarn.lock ./
COPY . .
RUN mkdir -p public && yarn build

FROM node:22-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# CMS content database. Mount a persistent volume at /data, otherwise edits are
# lost whenever the container is replaced.
RUN mkdir -p /data && chown nextjs:nodejs /data
ENV CMS_DB_PATH=/data/cms.db
VOLUME ["/data"]

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
