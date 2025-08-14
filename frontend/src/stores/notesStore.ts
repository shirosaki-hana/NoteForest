import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { getNote, writeNote } from '../utils/api';

interface NotesState {
  selectedNoteId: string;
  title: string;
  tags: string[];
  content: string;
  editorKey: number;
  saving: boolean;
  loading: boolean;

  selectNote: (
    noteId: string,
    showMessage?: (m: string, s?: 'success' | 'error' | 'info') => void
  ) => Promise<void>;
  newNote: (showMessage?: (m: string, s?: 'success' | 'error' | 'info') => void) => string;
  save: (showMessage?: (m: string, s?: 'success' | 'error' | 'info') => void) => Promise<void>;

  setTitle: (title: string) => void;
  setTags: (tags: string[]) => void;
  setContent: (content: string) => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  selectedNoteId: '',
  title: '',
  tags: [],
  content: '',
  editorKey: 0,
  saving: false,
  loading: false,

  selectNote: async (noteId, showMessage) => {
    if (!noteId) {
      set({ selectedNoteId: '', title: '', tags: [], content: '', editorKey: get().editorKey + 1 });
      return;
    }
    try {
      set({ loading: true, selectedNoteId: noteId });
      const response = await getNote(noteId);
      if (response.success && response.data) {
        const loadedTitle = response.data.title || '';
        const loadedTags = response.data.tags || [];
        const loadedContent = response.data.body || '';

        set({
          title: loadedTitle,
          tags: loadedTags,
          content: loadedContent,
          editorKey: get().editorKey + 1,
        });
      } else {
        throw new Error(response.error || '메모를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('메모 로드 중 오류:', error);
      const message =
        error instanceof Error ? error.message : '메모를 불러오는 중 오류가 발생했습니다.';
      showMessage?.(message, 'error');
      set({ selectedNoteId: '', title: '', tags: [], content: '' });
    } finally {
      set({ loading: false });
    }
  },

  newNote: showMessage => {
    const newId = uuidv4();
    set({
      selectedNoteId: newId,
      title: '',
      tags: [],
      content: '',
      editorKey: get().editorKey + 1,
    });
    showMessage?.('새 메모가 생성되었습니다.', 'info');
    return newId;
  },

  save: async showMessage => {
    const { selectedNoteId, title, tags, content } = get();
    if (!selectedNoteId) {
      showMessage?.('메모를 선택해주세요.', 'error');
      return;
    }
    if (!title.trim() && !content.trim()) {
      showMessage?.('제목이나 내용을 입력해주세요.', 'error');
      return;
    }
    try {
      set({ saving: true });
      const response = await writeNote({
        uuid: selectedNoteId,
        title: title.trim() || '제목 없음',
        tags,
        body: content,
      });
      if (response.success) {
        showMessage?.('메모가 성공적으로 저장되었습니다.', 'success');
      } else {
        throw new Error(response.error || '메모 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('메모 저장 중 오류:', error);
      const message = error instanceof Error ? error.message : '메모 저장 중 오류가 발생했습니다.';
      showMessage?.(message, 'error');
    } finally {
      set({ saving: false });
    }
  },

  setTitle: (title: string) => {
    set({ title });
  },
  setTags: (tags: string[]) => {
    set({ tags });
  },
  setContent: (content: string) => {
    set({ content });
  },
}));
