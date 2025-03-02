import {
  Home,
  User,
  LogOut,
  LogIn,
  Settings,
  Plus,
  Menu,
  X,
  Palette,
  CircleIcon,
  Info,
  Calendar,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Edit,
  Camera,
  Save,
  Mail,
  Clock,
  Calendar as CalendarIcon,
  Star,
  BookOpen,
  Award,
  MapPin,
  Users,
  Lock,
  RefreshCw,
  UserPlus,
  UserMinus,
  Shield,
  ShieldOff,
  Trash2,
  Unlock,
  Rocket,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export {
  Home,
  User,
  LogOut,
  LogIn,
  Settings,
  Plus,
  Menu,
  X,
  Palette,
  CircleIcon,
  Info,
  Calendar,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Edit,
  Camera,
  Save,
  Mail,
  Clock,
  CalendarIcon,
  Star,
  BookOpen,
  Award,
  MapPin,
  Users,
  Lock,
  RefreshCw,
  UserPlus,
  UserMinus,
  Shield,
  ShieldOff,
  Trash2,
  Unlock,
  Rocket,
};

// 클럽 아이콘
export const ClubIcon = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('size-6', className)}
      {...props}
    >
      <path d="M17 11h1a3 3 0 0 1 0 6h-1" />
      <path d="M9 12v6" />
      <path d="M13 12v6" />
      <path d="M14 7.5c-1 0-1.5-.5-2.5-.5s-1.5.5-2.5.5-1.5-.5-2.5-.5-1.5.5-2.5.5" />
      <path d="M9 7v5" />
      <path d="M13 7v5" />
      <path d="M21 5.5c-1 0-1.5-.5-2.5-.5s-1.5.5-2.5.5-1.5-.5-2.5-.5-1.5.5-2.5.5" />
      <path d="M21 9.5c-1 0-1.5-.5-2.5-.5s-1.5.5-2.5.5-1.5-.5-2.5-.5-1.5.5-2.5.5" />
    </svg>
  );
};

// 이벤트 아이콘 컴포넌트
export function EventIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect
        width="18"
        height="18"
        x="3"
        y="4"
        rx="2"
        ry="2"
      />
      <line
        x1="16"
        x2="16"
        y1="2"
        y2="6"
      />
      <line
        x1="8"
        x2="8"
        y1="2"
        y2="6"
      />
      <line
        x1="3"
        x2="21"
        y1="10"
        y2="10"
      />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}

// 소개 아이콘 컴포넌트
export function AboutIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
      />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

// 로고 아이콘 컴포넌트
export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
      />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
