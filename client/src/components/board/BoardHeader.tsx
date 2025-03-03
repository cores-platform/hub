import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Menu,
  MessageSquareText,
  Settings,
  Home,
  Clock,
  Layout,
  PlusCircle,
} from 'lucide-react';
import { useBoardStore } from '@/store/boardStore';
import { useAuthStore } from '@/store/authStore';
import { useClubStore } from '@/store/clubStore';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function BoardHeader() {
  const { clubId } = useParams<{ clubId: string }>();
  const [open, setOpen] = useState(false);
  const { boards, fetchClubBoards } = useBoardStore();
  const { user } = useAuthStore();
  const { currentClub } = useClubStore();

  useEffect(() => {
    if (clubId) {
      fetchClubBoards(clubId);
    }
  }, [clubId, fetchClubBoards]);

  const isOwnerOrAdmin =
    user &&
    currentClub &&
    (currentClub.owner._id === user._id ||
      currentClub.admins?.some((admin) => admin.user._id === user._id));

  const sidebarContent = (
    <>
      <div className="px-3 py-4">
        <div className="mb-2">
          <h2 className="px-4 text-lg font-semibold tracking-tight">
            {currentClub?.name || '동아리 앱'}
          </h2>
        </div>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
            onClick={() => setOpen(false)}
          >
            <Link to={`/clubs/${clubId}/app`}>
              <Home className="mr-2 h-4 w-4" />홈
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
            onClick={() => setOpen(false)}
          >
            <Link to={`/clubs/${clubId}/app/posts`}>
              <Clock className="mr-2 h-4 w-4" />
              최근 게시글
            </Link>
          </Button>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-sm font-semibold tracking-tight">게시판</h2>
          {isOwnerOrAdmin && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link to={`/clubs/${clubId}/app/boards/create`}>
                <PlusCircle className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px] px-1">
          <div className="space-y-1 p-2">
            {boards.map((board) => (
              <Button
                key={board._id}
                variant="ghost"
                className="w-full justify-start font-normal"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link to={`/clubs/${clubId}/app/boards/${board._id}`}>
                  <Layout className="mr-2 h-4 w-4" />
                  {board.name}
                </Link>
              </Button>
            ))}
            {boards.length === 0 && (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                게시판이 없습니다
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );

  return (
    <div className="md:hidden sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          <Sheet
            open={open}
            onOpenChange={setOpen}
          >
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-md"
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
          <h2 className="font-medium truncate">
            {currentClub?.name || '동아리 앱'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-md"
            asChild
          >
            <Link to={`/clubs/${clubId}/app/posts`}>
              <MessageSquareText className="h-5 w-5" />
            </Link>
          </Button>

          {isOwnerOrAdmin && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-md"
              asChild
            >
              <Link to={`/clubs/${clubId}/app/settings`}>
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
