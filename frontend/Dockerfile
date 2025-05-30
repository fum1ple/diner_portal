FROM node:22-alpine AS builder

ENV TZ Asia/Tokyo

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

# 本番向けにビルドする場合
# RUN yarn build

# 開発環境用のイメージ
FROM node:22-alpine AS development

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 4000

CMD ["yarn", "dev", "-p", "4000"]

# 本番環境用のイメージを作成する場合の例
# FROM node:22-alpine AS production
# WORKDIR /app
# COPY --from=builder /app/.next /app/.next
# COPY --from=builder /app/public /app/public
# COPY --from=builder /app/node_modules /app/node_modules
# COPY --from=builder /app/package.json /app/
# EXPOSE 4000
# CMD ["yarn", "start", "-p", "4000"]