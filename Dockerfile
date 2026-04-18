FROM node:20-alpine

WORKDIR /app
COPY . .

ENV NODE_ENV=production
ENV PORT=5173

EXPOSE 5173

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -qO- "http://127.0.0.1:${PORT}/api/health" || exit 1

CMD ["node", "src/server.js"]
