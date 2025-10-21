FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json ./
COPY api_gateway/package.json ./api_gateway/package.json
COPY service_users/package.json ./service_users/package.json
COPY service_orders/package.json ./service_orders/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN npm install --legacy-peer-deps

FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build -w service_orders

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/service_orders/dist ./service_orders/dist
COPY service_orders/package.json ./service_orders/package.json

CMD ["node", "service_orders/dist/server.js"]

