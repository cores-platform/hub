import { useThemeStore } from '@/store/useThemeStore';
import {
  getThemeName,
  getThemeColorClass,
  availableThemes,
} from '@/lib/theme-utils';

export function MobileThemeSelector() {
  // 개별적으로 상태와 액션 가져오기
  const theme = useThemeStore(state => state.theme);
  const setTheme = useThemeStore(state => state.setTheme);

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground p-2">
        테마 선택
      </div>
      <div className="grid grid-cols-2 gap-2">
        {availableThemes.map((themeName) => (
          <button
            key={themeName}
            className={`p-2 text-sm rounded-md flex items-center gap-2 ${
              theme === themeName
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
            onClick={() => setTheme(themeName)}
          >
            <div
              className={`h-3 w-3 rounded-full ${getThemeColorClass(
                themeName
              )}`}
            ></div>
            {getThemeName(themeName)}
          </button>
        ))}
      </div>
    </div>
  );
}
