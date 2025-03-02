import { Link } from 'react-router-dom';
import { LogoIcon } from '@/components/icons';

export function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 font-bold text-xl text-primary"
    >
      <LogoIcon className="h-6 w-6" />
      <span>클럽허브</span>
    </Link>
  );
}
