import { Link } from 'react-router-dom';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User, Users } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Create a wrapper component to forward refs to Link
const ForwardedLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof Link>
>((props, ref) => (
  <Link
    ref={ref}
    {...props}
  />
));
ForwardedLink.displayName = 'ForwardedLink';

interface AuthButtonsProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function AuthButtons({
  isAuthenticated,
  onLogout,
}: AuthButtonsProps) {
  return (
    <>
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="z-50"
            sideOffset={8}
          >
            <DropdownMenuItem asChild>
              <ForwardedLink
                to="/profile"
                className="flex items-center"
              >
                <User className="mr-2 h-4 w-4" />
                <span>프로필</span>
              </ForwardedLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <ForwardedLink
                to="/my-clubs"
                className="flex items-center"
              >
                <Users className="mr-2 h-4 w-4" />
                <span>내 동아리</span>
              </ForwardedLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>로그아웃</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link to="/login">
              <LogIn className="h-4 w-4 mr-2" />
              로그인
            </Link>
          </Button>
          <Button
            variant="default"
            size="sm"
            asChild
          >
            <Link to="/register">회원가입</Link>
          </Button>
        </>
      )}
    </>
  );
}
