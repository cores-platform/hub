import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Home,
  User,
  Settings,
  LogOut,
  LogIn,
  Plus,
  Users,
} from '@/components/icons';
import { MobileThemeSelector } from '@/components/theme/mobile-theme-selector';
import { ClubIcon, EventIcon } from '@/components/icons';

interface MobileNavProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function MobileNav({ isAuthenticated, onLogout }: MobileNavProps) {
  return (
    <div className="md:hidden fixed inset-0 top-16 z-20 bg-gray-950">
      <nav className="container mx-auto py-4 px-4 flex flex-col gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
        >
          <Home className="h-5 w-5" />홈
        </Link>
        <Link
          to="/clubs"
          className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
        >
          <ClubIcon className="h-5 w-5" />
          동아리 찾기
        </Link>
        <Link
          to="/events"
          className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
        >
          <EventIcon className="h-5 w-5" />
          이벤트
        </Link>

        <hr className="my-2 border-t dark:border-gray-800" />

        {/* 모바일 테마 선택 */}
        <MobileThemeSelector />

        <hr className="my-2 border-t dark:border-gray-800" />

        {isAuthenticated ? (
          <>
            <Link
              to="/profile"
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
            >
              <User className="h-5 w-5" />내 프로필
            </Link>
            <Link
              to="/my-clubs"
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
            >
              <Users className="h-5 w-5" />내 동아리
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
            >
              <Settings className="h-5 w-5" />
              설정
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-md text-left w-full"
            >
              <LogOut className="h-5 w-5" />
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
            >
              <LogIn className="h-5 w-5" />
              로그인
            </Link>
            <Link
              to="/register"
              className="w-full"
            >
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                회원가입
              </Button>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}
