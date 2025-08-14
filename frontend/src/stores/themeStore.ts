import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggleMode: () => void;
}

const storageKey = 'noteforest_theme';

export const useThemeStore = create<ThemeState>(set => ({
  mode: (() => {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  })(),
  toggleMode: () =>
    set(prev => {
      const next = prev.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem(storageKey, next);
      return { mode: next };
    }),
}));
