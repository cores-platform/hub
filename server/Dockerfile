# Node.js 이미지를 기반으로 설정
FROM node:22

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 애플리케이션 소스 복사
COPY . .

# 빌드 (TypeScript를 사용하는 경우)
RUN npm run build

# 애플리케이션 포트 설정
EXPOSE 5000

# 애플리케이션 시작 명령어
CMD ["npm", "start"] 