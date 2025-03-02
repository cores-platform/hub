import { Theme } from '@/store/useThemeStore';

// 테마 아이콘 컬러 가져오기
export function getThemeIconColor(theme: Theme) {
  switch (theme) {
    case 'purple':
      return 'text-purple-400';
    case 'blue':
      return 'text-blue-400';
    case 'green':
      return 'text-green-400';
    case 'orange':
      return 'text-orange-400';
    case 'dark':
      return 'text-gray-400';
    case 'light':
      return 'text-yellow-400';
    default:
      return '';
  }
}

// 테마 이름 가져오기
export function getThemeName(themeName: Theme) {
  switch (themeName) {
    case 'purple':
      return '퍼플 테마';
    case 'blue':
      return '블루 테마';
    case 'green':
      return '그린 테마';
    case 'orange':
      return '오렌지 테마';
    case 'dark':
      return '다크 테마';
    case 'light':
      return '라이트 테마';
    case 'system':
      return '시스템 테마';
    default:
      return '';
  }
}

// 테마 배경색 클래스 가져오기
export function getThemeColorClass(themeName: Theme) {
  switch (themeName) {
    case 'light':
      return 'bg-yellow-400';
    case 'dark':
      return 'bg-gray-700';
    case 'purple':
      return 'bg-purple-600';
    case 'blue':
      return 'bg-blue-600';
    case 'green':
      return 'bg-green-600';
    case 'orange':
      return 'bg-orange-600';
    case 'system':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
}

// 사용 가능한 모든 테마 목록
export const availableThemes: Theme[] = [
  'light',
  'dark',
  'purple',
  'blue',
  'green',
  'orange',
  'system',
];
