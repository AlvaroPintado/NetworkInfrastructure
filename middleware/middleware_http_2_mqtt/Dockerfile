FROM node:22-slim

WORKDIR /app

COPY . .

RUN npm install

EXPOSE ${PORT:-5001}

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-5001}/ || exit 1

CMD ["node", "app.js"]
