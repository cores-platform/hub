import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  changePassword as apiChangePassword,
  isAuthenticated as checkAuth,
  User,
  LoginCredentials,
  RegisterCredentials,
  PasswordChangeData,
} from '../lib/api-auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  changePassword: (data: PasswordChangeData) => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: checkAuth(),
      isLoading: false,
      error: null,

      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          const data = await apiLogin(credentials);
          set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error:
              error.response?.data?.message ||
              '로그인 중 오류가 발생했습니다.',
          });
          throw error;
        }
      },

      register: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          const data = await apiRegister(credentials);
          set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error:
              error.response?.data?.message ||
              '회원가입 중 오류가 발생했습니다.',
          });
          throw error;
        }
      },

      logout: () => {
        apiLogout();
        set({ user: null, isAuthenticated: false });
      },

      changePassword: async (data) => {
        try {
          set({ isLoading: true, error: null });
          await apiChangePassword(data);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error:
              error.response?.data?.message ||
              '비밀번호 변경 중 오류가 발생했습니다.',
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async () => {
        const isAuthenticated = await checkAuth();
        set({ isAuthenticated });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
