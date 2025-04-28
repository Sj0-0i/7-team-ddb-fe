# 돌핀(Dolphin) 프론트엔드 👋

## 프로젝트 소개 🐬
돌핀(Dolphin)은 사용자 중심의 커뮤니티 플랫폼으로, 위치 기반 정보 공유와 소통을 통해 더 나은 사용자 경험을 제공합니다. 본 프로젝트는 React 기반의 프론트엔드 아키텍처를 사용하며, 모듈화된 구조와 최신 웹 기술을 적용하여 안정적이고 유지보수가 용이한 애플리케이션을 구현하고 있습니다.

## 팀 위키 
- [서비스 위키 보러가기](https://github.com/orgs/7-team-ddb/wiki)
- [서비스 칸반보드 보러가기](https://github.com/orgs/100-hours-a-week/projects/139)

## 목차 📑
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [설치 및 실행 방법](#설치-및-실행-방법)
- [개발 가이드](#개발-가이드)
- [주요 기능](#주요-기능)
- [프로젝트 관리](#프로젝트-관리)
- [팀원](#팀원)

## 기술 스택 🛠️

### Core
- **React 18**: 컴포넌트 기반 UI 라이브러리
- **TypeScript**: 정적 타입 지원으로 코드 안정성 향상
- **Next.js**: React 기반 프레임워크, SSR/SSG 지원

### 상태 관리 및 API
- **React-Query**: 서버 상태 관리
- **Zustand**: 클라이언트 상태 관리
- **Fetch API**: HTTP 클라이언트

### 스타일링
- **Emotion**: CSS-in-JS 라이브러리
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크

### 테스트 및 품질 관리
- **Jest**: 자바스크립트 테스트 프레임워크
- **React Testing Library**: React 컴포넌트 테스트
- **Storybook**: UI 컴포넌트 개발 및 문서화

### 기타 도구
- **ESLint/Prettier**: 코드 스타일 및 품질 관리
- **Husky/lint-staged**: Git 훅 기반 코드 검사

## 프로젝트 구조 📂
```
/src
├── /assets # 이미지, 폰트, 아이콘 등 정적 파일
├── /components # 재사용 가능한 UI 컴포넌트
│ ├── /common # 공통 컴포넌트 (Button, Input 등)
│ ├── /layout # 레이아웃 관련 컴포넌트
│ └── /domain # 도메인별 컴포넌트
├── /constants # 상수값 정의
├── /features # 기능 단위 모듈
│ ├── /auth # 인증 관련 기능
│ ├── /user # 사용자 관련 기능
│ ├── /community # 커뮤니티 관련 기능
│ ├── /place # 장소 관련 기능
│ └── /onboarding # 온보딩 관련 기능
├── /hooks # 커스텀 훅
├── /pages # 라우팅 페이지
├── /services # API 서비스 로직
├── /store # 상태 관리
├── /styles # 글로벌 스타일, 테마 설정
├── /types # TypeScript 타입 정의
└── /utils # 유틸리티 함수
```

## 설치 및 실행 방법 💻

### 사전 요구사항
- Node.js 16.x 이상
- npm 8.x 이상 또는 yarn 1.22.x 이상

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-organization/dolphin-frontend.git

# 디렉토리 이동
cd dolphin-frontend

# 의존성 설치
npm install
# 또는
yarn install
```

### 개발 서버 실행

```bash
# 개발 서버 실행
npm run dev
# 또는
yarn dev

# 기본적으로 http://localhost:3000 에서 확인 가능
```

### 빌드 및 프로덕션 실행

```bash
# 프로덕션용 빌드
npm run build
# 또는
yarn build

# 프로덕션 서버 실행
npm run start
# 또는
yarn start
```

## 개발 가이드 📝

### 코딩 컨벤션
- 컴포넌트는 함수형 컴포넌트로 작성합니다.
- 파일명은 PascalCase로 작성합니다. (예: `UserProfile.tsx`)
- 상수는 UPPER_SNAKE_CASE로 작성합니다. (예: `MAX_COUNT`)
- 변수와 함수는 camelCase로 작성합니다. (예: `getUserData()`)
- 타입과 인터페이스는 PascalCase로 작성합니다. (예: `UserProfileProps`)

### 컴포넌트 구조
- 컴포넌트는 기능/역할별로 분리하여 작성합니다.
- 컴포넌트의 재사용성을 고려합니다.
- Props는 명확하게 타입을 정의합니다.
- 불필요한 렌더링을 줄이기 위해 `React.memo`, `useMemo`, `useCallback`을 적절히 활용합니다.

### 테스트
- 모든 컴포넌트는 기본적인 렌더링 테스트를 작성합니다.
- 핵심 비즈니스 로직은 단위 테스트를 작성합니다.
- Storybook을 통해 UI 컴포넌트를 문서화합니다.

## 주요 기능 ✨

### 사용자 도메인
- 소셜 로그인 (카카오, 구글)
- 사용자 프로필 관리
- 사용자 설정 및 알림 관리

### 커뮤니티 도메인
- 게시글 작성 및 조회
- 댓글 및 대댓글 기능
- 게시글 검색 및 필터링

### 장소 도메인
- 위치 기반 정보 탐색
- 장소 검색 및 북마크
- 지도 통합 인터페이스

### 온보딩 도메인
- 새 사용자 가이드
- 서비스 소개 및 튜토리얼

## 프로젝트 관리 📊

### 이슈 관리
- GitHub Issues를 활용한 이슈 추적
- 기능 단위 브랜치 관리 (feature/*, bugfix/*)

### 배포 프로세스
- CI/CD 파이프라인을 통한 자동화된 배포
- 개발(dev), 스테이징(staging), 프로덕션(prod) 환경 분리

### 문서화
- API 명세서 및 인터페이스 문서 관리
- 컴포넌트 가이드라인 및 디자인 시스템 문서화

## 팀원 👨‍💻👩‍💻
# 돌핀(Dolphin) 프론트엔드 👋

## 프로젝트 소개 🐬
돌핀(Dolphin)은 사용자 중심의 커뮤니티 플랫폼으로, 위치 기반 정보 공유와 소통을 통해 더 나은 사용자 경험을 제공합니다. 본 프로젝트는 React 기반의 프론트엔드 아키텍처를 사용하며, 모듈화된 구조와 최신 웹 기술을 적용하여 안정적이고 유지보수가 용이한 애플리케이션을 구현하고 있습니다.

## 팀 위키 
- [서비스 위키 보러가기](https://github.com/orgs/7-team-ddb/wiki)
- [서비스 칸반보드 보러가기](https://github.com/orgs/100-hours-a-week/projects/139)

## 목차 📑
- [기술 스택](#기술-스택-🛠️)
- [프로젝트 구조](#프로젝트-구조)
- [설치 및 실행 방법](#설치-및-실행-방법)
- [개발 가이드](#개발-가이드)
- [주요 기능](#주요-기능)
- [프로젝트 관리](#프로젝트-관리)
- [팀원](#팀원)

## 기술 스택 🛠️

### Core
- **React 18**: 컴포넌트 기반 UI 라이브러리
- **TypeScript**: 정적 타입 지원으로 코드 안정성 향상
- **Next.js**: React 기반 프레임워크, SSR/SSG 지원

### 상태 관리 및 API
- **React-Query**: 서버 상태 관리
- **Zustand**: 클라이언트 상태 관리
- **Fetch API**: HTTP 클라이언트

### 스타일링
- **Emotion**: CSS-in-JS 라이브러리
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크

### 테스트 및 품질 관리
- **Jest**: 자바스크립트 테스트 프레임워크
- **React Testing Library**: React 컴포넌트 테스트
- **Storybook**: UI 컴포넌트 개발 및 문서화

### 기타 도구
- **ESLint/Prettier**: 코드 스타일 및 품질 관리
- **Husky/lint-staged**: Git 훅 기반 코드 검사

## 프로젝트 구조 📂
```
/src
├── /assets # 이미지, 폰트, 아이콘 등 정적 파일
├── /components # 재사용 가능한 UI 컴포넌트
│ ├── /common # 공통 컴포넌트 (Button, Input 등)
│ ├── /layout # 레이아웃 관련 컴포넌트
│ └── /domain # 도메인별 컴포넌트
├── /constants # 상수값 정의
├── /features # 기능 단위 모듈
│ ├── /auth # 인증 관련 기능
│ ├── /user # 사용자 관련 기능
│ ├── /community # 커뮤니티 관련 기능
│ ├── /place # 장소 관련 기능
│ └── /onboarding # 온보딩 관련 기능
├── /hooks # 커스텀 훅
├── /pages # 라우팅 페이지
├── /services # API 서비스 로직
├── /store # 상태 관리
├── /styles # 글로벌 스타일, 테마 설정
├── /types # TypeScript 타입 정의
└── /utils # 유틸리티 함수
```

## 설치 및 실행 방법 💻

### 사전 요구사항
- Node.js 16.x 이상
- npm 8.x 이상 또는 yarn 1.22.x 이상

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-organization/dolphin-frontend.git

# 디렉토리 이동
cd dolphin-frontend

# 의존성 설치
npm install
# 또는
yarn install
```

### 개발 서버 실행

```bash
# 개발 서버 실행
npm run dev
# 또는
yarn dev

# 기본적으로 http://localhost:3000 에서 확인 가능
```

### 빌드 및 프로덕션 실행

```bash
# 프로덕션용 빌드
npm run build
# 또는
yarn build

# 프로덕션 서버 실행
npm run start
# 또는
yarn start
```

## 개발 가이드 📝

### 코딩 컨벤션
- 컴포넌트는 함수형 컴포넌트로 작성합니다.
- 파일명은 PascalCase로 작성합니다. (예: `UserProfile.tsx`)
- 상수는 UPPER_SNAKE_CASE로 작성합니다. (예: `MAX_COUNT`)
- 변수와 함수는 camelCase로 작성합니다. (예: `getUserData()`)
- 타입과 인터페이스는 PascalCase로 작성합니다. (예: `UserProfileProps`)

### 컴포넌트 구조
- 컴포넌트는 기능/역할별로 분리하여 작성합니다.
- 컴포넌트의 재사용성을 고려합니다.
- Props는 명확하게 타입을 정의합니다.
- 불필요한 렌더링을 줄이기 위해 `React.memo`, `useMemo`, `useCallback`을 적절히 활용합니다.

### 테스트
- 모든 컴포넌트는 기본적인 렌더링 테스트를 작성합니다.
- 핵심 비즈니스 로직은 단위 테스트를 작성합니다.
- Storybook을 통해 UI 컴포넌트를 문서화합니다.

## 주요 기능 ✨

### 사용자 도메인
- 소셜 로그인 (카카오, 구글)
- 사용자 프로필 관리
- 사용자 설정 및 알림 관리

### 커뮤니티 도메인
- 게시글 작성 및 조회
- 댓글 및 대댓글 기능
- 게시글 검색 및 필터링

### 장소 도메인
- 위치 기반 정보 탐색
- 장소 검색 및 북마크
- 지도 통합 인터페이스

### 온보딩 도메인
- 새 사용자 가이드
- 서비스 소개 및 튜토리얼

## 프로젝트 관리 📊

### 이슈 관리
- GitHub Issues를 활용한 이슈 추적
- 기능 단위 브랜치 관리 (feature/*, bugfix/*)

### 배포 프로세스
- CI/CD 파이프라인을 통한 자동화된 배포
- 개발(dev), 스테이징(staging), 프로덕션(prod) 환경 분리

### 문서화
- API 명세서 및 인터페이스 문서 관리
- 컴포넌트 가이드라인 및 디자인 시스템 문서화

## 팀원 👨‍💻👩‍💻

| 이름 | 역할 | 주요 업무 |
|------------------|------|------------|
| suzy.kang (강수지) | 프론트엔드/팀장 | • 프론트엔드 개발<br>• UI/UX 설계<br>• 사용자 인터페이스 구현<br>• 애자일 스크럼 관리<br>• 칸반보드 및 GitHub 위키 관리<br>• 디스코드 봇 설정 및 자동화 시스템 구축
| eric.choi (최진우) | 백엔드 | • 백엔드 시스템 설계 및 개발<br>• API 설계 및 구현<br>• 데이터베이스 모델링 |
| juny.lee (이현준) | 인공지능 | • AI 모델 설계 및 개발<br>• 모델 학습 및 최적화<br>• 데이터 분석 및 처리 |
| jensen.hwang (황찬희) | 인공지능 | • AI 모델 설계 및 개발<br>• 추천 시스템 구현<br>• 성능 분석 및 개선 |
| peter.kang (강동석) | 클라우드 | • 클라우드 인프라 구축<br>• 시스템 아키텍처 설계<br>• 서버 관리 및 모니터링 |
| lily.shin (신지영) | 클라우드 | • 클라우드 서비스 구현<br>• 배포 자동화<br>• 보안 및 성능 최적화 |

## 라이센스 📄
MIT License

## 라이센스 📄
MIT License
