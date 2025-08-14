import { useCallback } from 'react';

interface StoredNote {
  noteId: string;
  title: string;
  tags: string[];
  content: string;
  lastModified: number;
  originalLastModified?: number; // 백엔드에서 불러온 원본의 마지막 수정 시간
}

const STORAGE_KEY = 'noteforest_draft';

export function useLocalStorage() {
  // 편집 중인 노트를 localStorage에 저장
  const saveDraft = useCallback(
    (
      noteId: string,
      title: string,
      tags: string[],
      content: string,
      originalLastModified?: number
    ) => {
      if (!noteId) return;

      const draft: StoredNote = {
        noteId,
        title,
        tags,
        content,
        lastModified: Date.now(),
        originalLastModified,
      };

      try {
        localStorage.setItem(`${STORAGE_KEY}_${noteId}`, JSON.stringify(draft));
      } catch (error) {
        console.warn('localStorage 저장 실패:', error);
      }
    },
    []
  );

  // localStorage에서 편집 중인 노트 불러오기
  const loadDraft = useCallback((noteId: string): StoredNote | null => {
    if (!noteId) return null;

    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${noteId}`);
      if (stored) {
        return JSON.parse(stored) as StoredNote;
      }
    } catch (error) {
      console.warn('localStorage 불러오기 실패:', error);
    }
    return null;
  }, []);

  // 특정 노트의 draft 삭제
  const clearDraft = useCallback((noteId: string) => {
    if (!noteId) return;

    try {
      localStorage.removeItem(`${STORAGE_KEY}_${noteId}`);
    } catch (error) {
      console.warn('localStorage 삭제 실패:', error);
    }
  }, []);

  // 모든 draft 키 목록 가져오기
  const getAllDraftKeys = useCallback((): string[] => {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEY)) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.warn('localStorage 키 목록 불러오기 실패:', error);
      return [];
    }
  }, []);

  // 오래된 draft 정리 (7일 이상 된 것들)
  const cleanOldDrafts = useCallback(() => {
    const keys = getAllDraftKeys();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    keys.forEach(key => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const draft = JSON.parse(stored) as StoredNote;
          if (draft.lastModified < sevenDaysAgo) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        console.warn('오래된 draft 정리 실패:', error);
      }
    });
  }, [getAllDraftKeys]);

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    getAllDraftKeys,
    cleanOldDrafts,
  };
}
