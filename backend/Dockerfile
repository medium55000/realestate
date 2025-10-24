# ========== 1 Base image ==========
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# (DATABASE_URL, AUTH0, PORT)

RUN npx prisma generate

EXPOSE 8080


CMD ["node", "index.js"]
