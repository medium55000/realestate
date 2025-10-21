# ========== 1️⃣ Base image ==========
FROM node:18

# 작업 디렉터리
WORKDIR /app

# package.json 복사 후 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 복사
COPY . .

# .env 파일은 COPY 하지 말고, Cloud Run 환경변수에서 직접 세팅
# (DATABASE_URL, AUTH0, PORT 등)

# Prisma Client 생성
RUN npx prisma generate

# Express 서버 포트
EXPOSE 8000

# 서버 실행 (nodemon X, 실제 배포용)
CMD ["node", "index.js"]
