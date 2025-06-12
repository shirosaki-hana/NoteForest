import type { NoteListResponse, NoteResponse, WriteResponse, DeleteResponse } from '../types/api';

const API_BASE = '/api';

// API 호출을 위한 기본 fetch 래퍼
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include', // 쿠키 기반 세션을 위해 필요
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// 메모 목록 조회
export async function getNoteList(): Promise<NoteListResponse> {
  return apiCall<NoteListResponse>('/list');
}

// 특정 메모 조회
export async function getNote(uuid: string): Promise<NoteResponse> {
  return apiCall<NoteResponse>(`/read/${uuid}`);
}

// 메모 생성/수정
export async function writeNote(note: {
  uuid: string;
  title: string;
  tags: string[];
  body: string;
  createdAt?: string;
}): Promise<WriteResponse> {
  return apiCall<WriteResponse>('/write', {
    method: 'POST',
    body: JSON.stringify(note),
  });
}

// 메모 삭제
export async function deleteNote(uuid: string): Promise<DeleteResponse> {
  return apiCall<DeleteResponse>(`/${uuid}`, {
    method: 'DELETE',
  });
}
