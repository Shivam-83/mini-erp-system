FROM node:18-alpine
WORKDIR /app

# install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --production

# copy source
COPY . .

ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "index.js"]
