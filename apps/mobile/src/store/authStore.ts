import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../api/auth.queries';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedIntake: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  socialLogin: (provider: 'apple' | 'google', token: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setIntakeComplete: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  hasCompletedIntake: false,

  login: async (email, password) => {
    const result = await authApi.login(email, password);
    await SecureStore.setItemAsync('accessToken', result.data.accessToken);
    set({ user: result.data.user, isAuthenticated: true });
  },

  register: async (data) => {
    const result = await authApi.register(data);
    await SecureStore.setItemAsync('accessToken', result.data.accessToken);
    set({ user: result.data.user, isAuthenticated: true });
  },

  socialLogin: async (provider, token, firstName, lastName) => {
    const result = provider === 'apple'
      ? await authApi.socialApple(token, firstName, lastName)
      : await authApi.socialGoogle(token);
    await SecureStore.setItemAsync('accessToken', result.data.accessToken);
    set({ user: result.data.user, isAuthenticated: true });
  },

  logout: async () => {
    try { await authApi.logout(); } catch {}
    await SecureStore.deleteItemAsync('accessToken');
    set({ user: null, isAuthenticated: false, hasCompletedIntake: false });
  },

  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (!token) {
        set({ isLoading: false });
        return;
      }
      const result = await authApi.me();
      set({ user: result.data, isAuthenticated: true, isLoading: false });
    } catch {
      await SecureStore.deleteItemAsync('accessToken');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setIntakeComplete: () => set({ hasCompletedIntake: true }),
}));
