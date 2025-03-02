import { Link } from 'react-router-dom';

export function DesktopNav() {
  return (
    <nav className="hidden md:flex items-center gap-6">
      <Link
        to="/"
        className="text-sm font-medium hover:text-primary"
      >
        홈
      </Link>
      <Link
        to="/clubs"
        className="text-sm font-medium hover:text-primary"
      >
        동아리 찾기
      </Link>
      <Link
        to="/about"
        className="text-sm font-medium hover:text-primary"
      >
        소개
      </Link>
    </nav>
  );
}
