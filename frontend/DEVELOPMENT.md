# NoteForest Frontend

SMUI (Svelte Material UI) 기반의 모던한 프론트엔드 애플리케이션입니다.

## 🚀 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build
```

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── common/         # 공통 컴포넌트 (Loading, Modal 등)
│   └── layout/         # 레이아웃 컴포넌트 (Header, Footer 등)
├── stores/             # Svelte stores (상태 관리)
├── utils/              # 유틸리티 함수들
├── App.svelte          # 메인 앱 컴포넌트
├── main.ts             # 앱 진입점
└── app.css             # 전역 스타일
```

## 🎨 사용된 기술

- **Svelte 5** - 반응형 웹 프레임워크
- **TypeScript** - 타입 안전성
- **SMUI** - Material Design 컴포넌트
- **Vite** - 빠른 빌드 도구
- **PNPM** - 효율적인 패키지 매니저

## 🌟 주요 기능

- ✅ SMUI 기반 Material Design 컴포넌트
- ✅ 다크/라이트 테마 지원
- ✅ 타입스크립트 완전 지원
- ✅ 반응형 디자인
- ✅ 컴포넌트 기반 아키텍처
- ✅ API 유틸리티 함수
- ✅ 상태 관리 (Svelte stores)

## 📝 개발 가이드

### 새 컴포넌트 추가

```svelte
<!-- src/components/common/MyComponent.svelte -->
<script lang="ts">
  export let title: string;
</script>

<div class="my-component">
  <h3>{title}</h3>
</div>

<style>
  .my-component {
    padding: 16px;
  }
</style>
```

### API 호출 예시

```typescript
import { api } from '../utils/api';

// GET 요청
const response = await api.get('/users');

// POST 요청
const response = await api.post('/users', { name: 'John' });
```

### 새 Store 추가

```typescript
// src/stores/myStore.ts
import { writable } from 'svelte/store';

export const myData = writable([]);
```

## 🎯 다음 단계

이제 자유롭게 개발을 시작하세요! 
- 새로운 페이지 추가
- 컴포넌트 라이브러리 확장
- API 연동
- 라우팅 추가 (svelte-spa-router 권장)

## 📚 유용한 링크

- [Svelte 공식 문서](https://svelte.dev)
- [SMUI 컴포넌트](https://sveltematerialui.com)
- [Material Design Icons](https://fonts.google.com/icons)
- [TypeScript 문서](https://www.typescriptlang.org)
