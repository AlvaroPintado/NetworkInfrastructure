FROM node:18
WORKDIR /app
COPY bot.js .
COPY package*.json ./
RUN npm install
CMD ["node", "bot.js"]