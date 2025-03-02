import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from '@/components/icons';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { DesktopNav } from '@/components/layout/desktop-nav';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Logo } from '@/components/layout/logo';
import { Footer } from '@/components/layout/footer';
import { AuthButtons } from '@/components/auth/auth-buttons';
import { useAuthStore } from '@/store/authStore';

export default function HomeLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Auth 스토어 상태를 개별적으로 가져오기
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  // 화면 크기가 변경될 때 모바일 메뉴 닫기
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 경로가 변경될 때 모바일 메뉴 닫기
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // 인증 상태 확인
  // useEffect(() => {
  //   checkAuth();
  // }, [checkAuth]);

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-950">
      {/* 헤더 */}
      <header className="border-b dark:border-gray-800 sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Logo />
          </div>

          {/* 데스크탑 메뉴 */}
          <DesktopNav />

          {/* 데스크탑 로그인/프로필 버튼 */}
          <div className="hidden md:flex items-center gap-4">
            {/* 테마 토글 */}
            <ThemeToggle />

            {/* 인증 버튼 */}
            <AuthButtons
              isAuthenticated={isAuthenticated}
              onLogout={logout}
            />
          </div>

          {/* 모바일 메뉴 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
            aria-label="메뉴 열기"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </header>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <MobileNav
          isAuthenticated={isAuthenticated}
          onLogout={logout}
        />
      )}

      {/* 메인 컨텐츠 */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  );
}
