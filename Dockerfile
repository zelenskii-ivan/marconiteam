# Сборка статики
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_SITE_URL=https://marcony-krd.ru
ARG VITE_YM_COUNTER_ID=
ENV VITE_SITE_URL=$VITE_SITE_URL
ENV VITE_YM_COUNTER_ID=$VITE_YM_COUNTER_ID

RUN node scripts/generate-icons.mjs && node scripts/generate-images.mjs
RUN npm run build

# Продакшен: nginx
FROM nginx:1.27-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/security-headers.conf /etc/nginx/conf.d/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ > /dev/null || exit 1
