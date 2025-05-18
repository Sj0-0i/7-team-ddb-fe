# 1단계: 빌드 스테이지
FROM node:20-alpine AS builder

# 경량화 위해 필수 패키지만 설치
RUN apk add --no-cache libc6-compat

WORKDIR /app

# pnpm 전역 설치
RUN npm install -g pnpm

# 의존성 설치를 위한 파일 복사
COPY package.json pnpm-lock.yaml ./

# 의존성 설치
RUN pnpm install

# 소스 코드 복사
COPY . .

# 빌드 타임 환경변수 인자 정의
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_KAKAOMAP_KEY

# 빌드 시점 환경변수로 사용될 수 있도록 ENV로 설정
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_KAKAOMAP_KEY=$NEXT_PUBLIC_KAKAOMAP_KEY

# Next.js 빌드 (이 시점에 env가 삽입됨)
RUN pnpm run build

# 2단계: 런타임 스테이지
FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

# 실행에 필요한 파일만 복사
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]