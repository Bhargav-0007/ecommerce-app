import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiUrl } from '../lib/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      login: async (email, password) => {
        const res = await fetch(apiUrl('/api/auth/login'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error ?? 'Login failed');
        }
        const data = await res.json() as { token: string; user: AuthUser };
        set({ token: data.token, user: data.user });
      },

      logout: () => set({ token: null, user: null }),
      isAdmin: () => get().user?.role === 'ADMIN',
      isAuthenticated: () => !!get().token,
    }),
    { name: 'appkhila-auth' }
  )
);
