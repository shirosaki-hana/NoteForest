# NoteForest 🌲

**NoteForest**는 Markdown 기반으로 메모를 작성하고 관리할 수 있는 단일 사용자 지향형 웹 애플리케이션입니다.

개인 서버(NAS)나 로컬 환경에서 실행하여 혼자만 사용하는 것을 목표로 설계되었으며, 간단하고 직관적인 노트 관리 시스템을 제공합니다.

## ✨ 주요 기능
- **인증 시스템**: 개인 사용을 위한 간단한 로그인 기능
- **반응형 UI**: Material-UI 기반의 모던하고 직관적인 인터페이스
- **파일 시스템 저장**: 데이터베이스 없이 마크다운 파일로 직접 저장
- **PWA 지원**: 웹앱으로 설치 가능
- **키보드 단축키**: 효율적인 노트 작성을 위한 단축키 지원

## 🛠️ 기술 스택

### Frontend
- **React 19** + **TypeScript** + **Vite**
- **Material-UI (MUI)** - UI 컴포넌트
- **React Router** - 라우팅

### Backend
- **Node.js** + **Express** + **TypeScript**
- **bcrypt** - 비밀번호 해싱
- **gray-matter** - 마크다운 파일 처리

## 시작하기

### 사전 요구사항
- Node.js 18+ 
- pnpm (권장) 또는 npm

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd NoteForest

# 의존성 설치
pnpm install
```

### 개발 환경 실행

```bash
# 프론트엔드와 백엔드를 동시에 개발 모드로 실행
pnpm run dev

# 또는 개별 실행
pnpm run dev:frontend  # 프론트엔드만 실행
pnpm run dev:backend   # 백엔드만 실행
```

### 프로덕션 빌드

```bash
# 전체 프로젝트 빌드
pnpm run build

# 또는 개별 빌드
pnpm run build:frontend  # 프론트엔드만 빌드
pnpm run build:backend   # 백엔드만 빌드
```

### 프로덕션 실행

```bash
# 빌드 후 백엔드 서버 시작
pnpm run start
```

## 프로젝트 구조

```
NoteForest/
├── frontend/          # React 프론트엔드
│   ├── src/
│   │   ├── components/    # UI 컴포넌트
│   │   ├── hooks/         # React 훅스
│   │   ├── theme/         # MUI 테마
│   │   └── utils/         # 유틸리티 함수
│   └── public/
├── backend/           # Express 백엔드
│   ├── src/
│   │   └── lib/           # 백엔드 라이브러리
│   ├── auth/              # 인증 관련 파일
│   └── database/          # 마크다운 파일 저장소
└── package.json       # 루트 패키지 설정
```

## 사용 가능한 명령어

### 루트 레벨 명령어
- `pnpm run dev` - 프론트엔드와 백엔드를 동시에 개발 모드로 실행
- `pnpm run build` - 전체 프로젝트 빌드
- `pnpm run start` - 프로덕션 서버 시작
- `pnpm run clean` - 모든 빌드 파일 및 node_modules 정리

### 개별 패키지 명령어
- `pnpm run dev:frontend` / `pnpm run dev:backend` - 개별 개발 서버 실행
- `pnpm run build:frontend` / `pnpm run build:backend` - 개별 빌드

## 보안 고려사항

이 애플리케이션은 개인 사용을 목적으로 설계되었습니다:
- 단일 사용자 인증만 지원
- 로컬 네트워크 또는 개인 서버에서의 사용을 권장
- 공개 인터넷에 노출하기 전에 추가적인 보안 조치 필요
