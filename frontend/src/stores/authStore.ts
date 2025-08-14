import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isPasswordSet: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  setupPassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  checkPasswordStatus: () => Promise<void>;
  init: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  isPasswordSet: false,

  checkPasswordStatus: async () => {
    try {
      const response = await fetch('/auth/status', { credentials: 'include' });
      const data = await response.json();
      set({ isPasswordSet: !!data.passwordSet });
    } catch {
      set({ isPasswordSet: false });
    }
  },

  checkAuth: async () => {
    try {
      const response = await fetch('/auth/check', { credentials: 'include' });
      set({ isAuthenticated: response.ok });
    } catch {
      set({ isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (password: string) => {
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (response.ok) {
        set({ isAuthenticated: true });
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: '로그인 중 오류가 발생했습니다.' };
    }
  },

  setupPassword: async (password: string) => {
    try {
      const response = await fetch('/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (response.ok) {
        set({ isAuthenticated: true, isPasswordSet: true });
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: '비밀번호 설정 중 오류가 발생했습니다.' };
    }
  },

  logout: async () => {
    try {
      await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
    } finally {
      set({ isAuthenticated: false });
    }
  },

  init: async () => {
    await get().checkPasswordStatus();
    await get().checkAuth();
  },
}));
