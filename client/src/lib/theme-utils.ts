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
    case 'cyberpunk':
      return 'text-yellow-300';
    case 'discord':
      return 'text-indigo-400';
    case 'nord':
      return 'text-sky-400';
    case 'dracula':
      return 'text-pink-400';
    case 'monokai':
      return 'text-amber-400';
    case 'solarized':
      return 'text-cyan-400';
    case 'github':
      return 'text-gray-500';
    case 'retro':
      return 'text-teal-400';
    case 'pastel':
      return 'text-rose-300';
    case 'neon':
      return 'text-lime-400';
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
    case 'cyberpunk':
      return '사이버펑크';
    case 'discord':
      return '디스코드';
    case 'nord':
      return '노드';
    case 'dracula':
      return '드라큘라';
    case 'monokai':
      return '모노카이';
    case 'solarized':
      return '솔라라이즈드';
    case 'github':
      return '깃허브';
    case 'retro':
      return '레트로';
    case 'pastel':
      return '파스텔';
    case 'neon':
      return '네온';
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
    case 'cyberpunk':
      return 'bg-yellow-500';
    case 'discord':
      return 'bg-indigo-600';
    case 'nord':
      return 'bg-sky-700';
    case 'dracula':
      return 'bg-pink-700';
    case 'monokai':
      return 'bg-amber-600';
    case 'solarized':
      return 'bg-cyan-600';
    case 'github':
      return 'bg-gray-500';
    case 'retro':
      return 'bg-teal-600';
    case 'pastel':
      return 'bg-rose-300';
    case 'neon':
      return 'bg-lime-500';
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
  'cyberpunk',
  'discord',
  'nord',
  'dracula',
  'monokai',
  'solarized',
  'github',
  'retro',
  'pastel',
  'neon',
];
