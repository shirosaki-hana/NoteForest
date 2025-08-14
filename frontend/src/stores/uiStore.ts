import { create } from 'zustand';

interface UiState {
  sidebarOpen: boolean;
  isEditMode: boolean;
  toggleSidebar: () => void;
  toggleEditMode: () => void;
}

export const useUiStore = create<UiState>(set => ({
  sidebarOpen: false,
  isEditMode: true,
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  toggleEditMode: () => set(state => ({ isEditMode: !state.isEditMode })),
}));
