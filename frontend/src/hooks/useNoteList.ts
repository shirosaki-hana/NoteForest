import { useState, useEffect } from 'react';
import type { Note } from '../types/api';
import { getNoteList } from '../utils/api';

export interface UseNoteListReturn {
  notes: Note[];
  loading: boolean;
  error: string | null;
  loadNotes: () => Promise<void>;
  refetchNotes: () => Promise<void>;
}

export function useNoteList(isOpen: boolean): UseNoteListReturn {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const response = await getNoteList();

      if (response.success) {
        setNotes(response.data);
        setError(null);
      } else {
        setError(response.error || '노트를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetchNotes = async () => {
    await loadNotes();
  };

  useEffect(() => {
    if (isOpen) {
      loadNotes();
    }
  }, [isOpen]);

  return {
    notes,
    loading,
    error,
    loadNotes,
    refetchNotes,
  };
}
