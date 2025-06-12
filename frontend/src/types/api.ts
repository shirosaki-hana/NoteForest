// API 타입 정의
export interface Note {
  uuid: string;
  title: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  body?: string; // read API에서만 포함
}

export interface NoteListResponse {
  success: boolean;
  data: Note[];
  count: number;
  error?: string;
}

export interface NoteResponse {
  success: boolean;
  data?: Note;
  error?: string;
}

export interface WriteResponse {
  success: boolean;
  message?: string;
  uuid?: string;
  error?: string;
}

export interface DeleteResponse {
  success: boolean;
  message?: string;
  deletedUuid?: string;
  error?: string;
}
