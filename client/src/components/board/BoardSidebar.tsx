import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Menu,
  PlusCircle,
  Settings,
  Home,
  MessageSquareText,
  LayoutList,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBoardStore } from '@/store/boardStore';
import { useClubStore } from '@/store/clubStore';
import { useAuthStore } from '@/store/authStore';

interface BoardSidebarProps {
  className?: string;
}

export function BoardSidebar({ className }: BoardSidebarProps) {
  const { clubId } = useParams<{ clubId: string }>();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const { boards, fetchClubBoards } = useBoardStore();
  const { currentClub } = useClubStore();
  const { user } = useAuthStore();

  // Check if the user is a club owner or admin (can manage boards)
  const isOwnerOrAdmin =
    currentClub &&
    user &&
    ((typeof currentClub.owner === 'object' &&
      currentClub.owner._id === user._id) ||
      (Array.isArray(currentClub.admins) &&
        currentClub.admins.some(
          (admin) =>
            typeof admin.user === 'object' && admin.user._id === user._id
        )));

  useEffect(() => {
    if (clubId) {
      fetchClubBoards(clubId).catch(console.error);
    }
  }, [clubId, fetchClubBoards]);

  const sidebarContent = (
    <>
      <div className="px-3 py-2">
        <div className="mb-2 px-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold tracking-tight">
            {currentClub?.name || '동아리 앱'}
          </h2>
        </div>
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <Link to={`/clubs/${clubId}/app`}>
              <Home className="mr-2 h-4 w-4" />홈
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <Link to={`/clubs/${clubId}/app/posts`}>
              <MessageSquareText className="mr-2 h-4 w-4" />
              최근 게시글
            </Link>
          </Button>
        </div>
      </div>
      <Separator />
      <div className="px-3 py-2">
        <div className="mb-2 px-4 flex justify-between items-center">
          <h2 className="text-sm font-semibold tracking-tight">게시판</h2>
          {isOwnerOrAdmin && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              asChild
            >
              <Link to={`/clubs/${clubId}/app/boards/create`}>
                <PlusCircle className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          <div className="space-y-1">
            {boards.map((board) => (
              <Button
                key={board._id}
                variant="ghost"
                className={cn(
                  'w-full justify-start font-normal transition-all duration-200',
                  location.pathname ===
                    `/clubs/${clubId}/app/boards/${board._id}`
                    ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-medium'
                    : 'hover:bg-muted/50'
                )}
                size="sm"
                asChild
              >
                <Link to={`/clubs/${clubId}/app/boards/${board._id}`}>
                  <LayoutList className="mr-2 h-4 w-4" />
                  {board.name}
                </Link>
              </Button>
            ))}
            {boards.length === 0 && (
              <div className="px-4 py-2 text-sm text-muted-foreground">
                게시판이 없습니다.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      {isOwnerOrAdmin && (
        <>
          <Separator />
          <div className="px-3 py-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link to={`/clubs/${clubId}/app/settings`}>
                <Settings className="mr-2 h-4 w-4" />앱 설정
              </Link>
            </Button>
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      {/* Mobile menu (Sheet) */}
      <Sheet
        open={open}
        onOpenChange={setOpen}
      >
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">메뉴 열기</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-72"
        >
          <div className="flex flex-col h-full">{sidebarContent}</div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div
        className={cn(
          'hidden md:flex flex-col h-full w-64 border-r',
          className
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
}
