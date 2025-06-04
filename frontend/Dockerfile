FROM node:22-alpine AS base

ENV TZ Asia/Tokyo

WORKDIR /app

# 依存関係のキャッシュ最適化
FROM base AS deps
# deps ステージ: 依存関係のみインストール（package.json変更時のみ実行）
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 開発環境用のイメージ
FROM base AS development

# Node.js のキャッシュとパフォーマンスを最適化
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 4000

CMD ["yarn", "dev", "-p", "4000"]

# 本番環境用のイメージ
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM base AS production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 4000

CMD ["node", "server.js"]