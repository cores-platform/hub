import { createContext, useContext, useEffect, useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

// useThemeStore에서 가져온 Theme 타입을 사용합니다
type Theme =
  | 'dark'
  | 'light'
  | 'purple'
  | 'blue'
  | 'green'
  | 'orange'
  | 'cyberpunk'
  | 'discord'
  | 'nord'
  | 'dracula'
  | 'monokai'
  | 'solarized'
  | 'github'
  | 'retro'
  | 'pastel'
  | 'neon';

interface ThemeProviderProps {
  children: React.ReactNode;
}

// 기존 ThemeContext를 유지하여 호환성 지원
const ThemeContext = createContext<
  | {
      theme: Theme;
      setTheme: (theme: Theme) => void;
    }
  | undefined
>(undefined);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Zustand 스토어 상태와 액션 개별적으로 가져오기
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const [mounted, setMounted] = useState(false);

  // 컴포넌트 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 테마에 따라 document 클래스 업데이트
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(
      'light',
      'dark',
      'purple',
      'blue',
      'green',
      'orange',
      'cyberpunk',
      'discord',
      'nord',
      'dracula',
      'monokai',
      'solarized',
      'github',
      'retro',
      'pastel',
      'neon'
    );

    root.classList.add(theme);
  }, [theme]);

  // 하위 컴포넌트에서 기존 useTheme 훅이 작동하도록 context 제공
  const value = {
    theme: theme as Theme, // 타입 호환성을 위한 임시 처리
    setTheme: (theme: Theme) => setTheme(theme as any), // 타입 호환성을 위한 임시 처리
  };

  // SSR 중에 테마 차이로 인한 깜박임 방지
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={value}
      {...props}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// 기존 코드와의 호환성을 위한 훅
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
