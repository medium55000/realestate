# ========== 1️⃣ Build stage ==========
FROM node:18 AS build

# 작업 디렉터리 생성
WORKDIR /app

# package.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 앱 소스 복사
COPY . .

# Vite는 build 시점에 .env.*를 읽지만, 프로덕션에서 런타임 주입은 불가능하므로
# 필요한 환경변수는 --build-arg로 전달하거나, Cloud Run 환경변수에서 직접 주입
RUN npm run build

# ========== 2️⃣ Serve stage ==========
FROM nginx:alpine

# Vite build 결과물을 nginx 기본 HTML 폴더에 복사
COPY --from=build /app/dist /usr/share/nginx/html
# 커스텀 Nginx 설정(8080 리슨)
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# Nginx 기본 포트 노출
#EXPOSE 80
# Cloud Run은 8080을 기대
EXPOSE 8080

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
