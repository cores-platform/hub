import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme =
  | 'light'
  | 'dark'
  | 'system'
  | 'purple'
  | 'blue'
  | 'green'
  | 'orange';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// 로컬스토리지에서 테마 값 가져오기 (없으면 purple 반환)
const getInitialTheme = (): Theme => {
  try {
    const storedTheme = localStorage.getItem('clubhub-theme');
    if (storedTheme) {
      const parsed = JSON.parse(storedTheme);
      if (parsed && parsed.state && parsed.state.theme) {
        return parsed.state.theme as Theme;
      }
    }
  } catch (e) {
    console.error('테마 로드 중 오류 발생:', e);
  }
  return 'purple';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: getInitialTheme(),
      setTheme: (theme: Theme) => set({ theme }),
    }),
    {
      name: 'clubhub-theme',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
