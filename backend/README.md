# NoteForest API 가이드라인 (MVP)

이 문서는 프론트엔드 개발을 위한 NoteForest REST API 구조 설명입니다.
각 엔드포인트의 역할, 요청/응답 JSON 구조, 예시를 제공합니다.

---

## 인증 시스템

- 쿠키 기반 세션 인증을 사용합니다.
- 세션 쿠키명: `nf_session`
- 세션 유효기간: 24시간
- 모든 `/api/*` 엔드포인트는 인증(로그인) 후에만 접근 가능합니다.

---

## 인증 API 엔드포인트

### 1. 비밀번호 설정 상태 확인

- **GET** `/auth/status`
- 비밀번호가 설정되어 있는지 확인합니다.

#### 응답(JSON)

```json
{
  "passwordSet": true // 또는 false
}
```

---

### 2. 인증 상태 확인

- **GET** `/auth/check`
- 현재 사용자의 인증 상태를 확인합니다.

#### 응답(JSON)

- 인증됨:

```json
{
  "authenticated": true
}
```

- 인증되지 않음:

```json
{
  "authenticated": false
}
```

---

### 3. 비밀번호 설정 (최초 설정)

- **POST** `/auth/setup`
- 최초 비밀번호를 설정합니다. (이미 설정된 경우 실패)

#### 요청(JSON)

```json
{
  "password": "설정할 비밀번호 (8자 이상, string, 필수)"
}
```

#### 응답(JSON)

- 성공:

```json
{
  "success": true
}
```

- 실패:

```json
{
  "error": "에러 메시지"
}
```

---

### 4. 로그인

- **POST** `/auth/login`
- 설정된 비밀번호로 로그인합니다.

#### 요청(JSON)

```json
{
  "password": "비밀번호 (string, 필수)"
}
```

#### 응답(JSON)

- 성공:

```json
{
  "success": true
}
```

- 실패:

```json
{
  "error": "에러 메시지"
}
```

---

### 5. 로그아웃

- **POST** `/auth/logout`
- 현재 세션을 종료합니다.

#### 응답(JSON)

```json
{
  "success": true
}
```

---

## 메모 API 엔드포인트

### 1. 메모 생성/수정

- **POST** `/api/write`
- 메모를 새로 생성하거나, uuid가 이미 존재하면 해당 메모를 수정합니다.

#### 요청(JSON)

```json
{
  "uuid": "메모의 UUID (string, 필수)",
  "title": "제목 (string, 필수)",
  "tags": ["태그1", "태그2"],
  "createdAt": "ISO8601 날짜 (생략 가능)",
  "body": "마크다운 본문 (string, 필수)"
}
```

#### 응답(JSON)

- 성공:

```json
{
  "success": true,
  "message": "메모가 성공적으로 저장되었습니다.",
  "uuid": "생성/수정된 메모의 UUID"
}
```

- 실패:

```json
{
  "success": false,
  "error": "에러 메시지"
}
```

---

### 2. 메모 읽기

- **GET** `/api/read/:uuid`
- 특정 메모의 상세 내용을 조회합니다.

#### 응답(JSON)

- 성공:

```json
{
  "success": true,
  "data": {
    "uuid": "메모 UUID",
    "title": "제목",
    "tags": ["태그1", "태그2"],
    "createdAt": "ISO8601 날짜",
    "updatedAt": "ISO8601 날짜",
    "body": "마크다운 본문"
  }
}
```

- 실패:

```json
{
  "success": false,
  "error": "에러 메시지"
}
```

---

### 3. 메모 목록 조회

- **GET** `/api/list`
- 모든 메모의 요약 목록을 최신순으로 반환합니다.

#### 응답(JSON)

- 성공:

```json
{
  "success": true,
  "data": [
    {
      "uuid": "메모 UUID",
      "title": "제목",
      "tags": ["태그1", "태그2"],
      "createdAt": "ISO8601 날짜",
      "updatedAt": "ISO8601 날짜"
    }
  ],
  "count": 1
}
```

- 실패:

```json
{
  "success": false,
  "error": "에러 메시지"
}
```

---

### 4. 메모 삭제

- **DELETE** `/api/:uuid`
- 특정 메모를 삭제합니다.

#### 응답(JSON)

- 성공:

```json
{
  "success": true,
  "message": "메모가 성공적으로 삭제되었습니다.",
  "deletedUuid": "삭제된 메모의 UUID"
}
```

- 실패:

```json
{
  "success": false,
  "error": "에러 메시지"
}
```

---

## 참고사항

### 인증 플로우

1. 첫 사용자: `/auth/status` → `/auth/setup` → 자동 로그인
2. 기존 사용자: `/auth/status` → `/auth/login`
3. 인증 상태 확인: `/auth/check`
4. 로그아웃: `/auth/logout`

### 기타

- 모든 날짜/시간은 ISO8601 문자열(예: 2025-06-13T12:34:56.789Z)로 반환됩니다.
- uuid는 표준 UUID v4 형식이어야 합니다.
- body는 마크다운 원문입니다.
- 세션 쿠키(`nf_session`)는 httpOnly로 설정되며, 24시간 유효합니다.
- 인증이 필요한 API(/api/\*)에 접근 시 인증되지 않은 경우 401 Unauthorized 응답을 받습니다.

---
