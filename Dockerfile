# --- Build Vue client ---
FROM node:20-alpine AS client-builder
WORKDIR /build/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# --- Production server ---
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY server/ ./server/
COPY --from=client-builder /build/client/dist ./client/dist

ENV PORT=6002
EXPOSE 6002

CMD ["node", "server/index.js"]
