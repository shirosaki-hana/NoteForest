# NoteForest API 가이드라인 (MVP)

이 문서는 프론트엔드 개발자를 위한 NoteForest 메모 CRUD API 명세서입니다. 각 엔드포인트의 역할, 요청/응답 JSON 구조, 예시를 제공합니다. (내부 처리/DB 구조는 다루지 않습니다)

---

## 인증

- 모든 /api/* 엔드포인트는 인증(로그인) 후에만 접근 가능합니다. (쿠키 기반 세션)

---

## 메모 API 엔드포인트

### 1. 메모 생성/수정
- **POST** `/api/write`
- 메모를 새로 생성하거나, uuid가 이미 존재하면 해당 메모를 수정합니다.

#### 요청(JSON)
```
{
  "uuid": "메모의 UUID (string, 필수)",
  "title": "제목 (string, 필수)",
  "tags": ["태그1", "태그2"], // (string[])
  "createdAt": "ISO8601 날짜 (생략 가능)",
  "body": "마크다운 본문 (string, 필수)"
}
```

#### 응답(JSON)
- 성공:
```
{
  "success": true,
  "message": "메모가 성공적으로 저장되었습니다.",
  "uuid": "생성/수정된 메모의 UUID"
}
```
- 실패:
```
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
```
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
```
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
```
{
  "success": true,
  "data": [
    {
      "uuid": "메모 UUID",
      "title": "제목",
      "tags": ["태그1", "태그2"],
      "createdAt": "ISO8601 날짜",
      "updatedAt": "ISO8601 날짜"
    },
    ...
  ],
  "count": 1 // 전체 메모 개수
}
```
- 실패:
```
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
```
{
  "success": true,
  "message": "메모가 성공적으로 삭제되었습니다.",
  "deletedUuid": "삭제된 메모의 UUID"
}
```
- 실패:
```
{
  "success": false,
  "error": "에러 메시지"
}
```

---

## 참고사항
- 모든 날짜/시간은 ISO8601 문자열(예: 2025-06-13T12:34:56.789Z)로 반환됩니다.
- uuid는 표준 UUID v4 형식이어야 합니다.
- body는 마크다운 원문입니다.
- 인증이 필요한 API이므로, 로그인 후 세션 쿠키가 필요합니다.

---

이 가이드라인을 참고하여 프론트엔드에서 API 요청/응답 구조를 설계하세요.
