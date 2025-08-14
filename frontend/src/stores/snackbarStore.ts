import { create } from 'zustand';

type SnackbarSeverity = 'success' | 'error' | 'info';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
  show: (message: string, severity?: SnackbarSeverity) => void;
  hide: () => void;
}

export const useSnackbarStore = create<SnackbarState>(set => ({
  open: false,
  message: '',
  severity: 'success',
  show: (message: string, severity: SnackbarSeverity = 'success') =>
    set({ open: true, message, severity }),
  hide: () => set({ open: false }),
}));
