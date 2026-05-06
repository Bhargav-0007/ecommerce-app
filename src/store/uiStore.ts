import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface UiState {
  mobileMenuOpen: boolean;
  toasts: Toast[];
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  mobileMenuOpen: false,
  toasts: [],

  toggleMobileMenu: () =>
    set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),

  closeMobileMenu: () => set({ mobileMenuOpen: false }),

  addToast: (type, message) => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3500);
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
