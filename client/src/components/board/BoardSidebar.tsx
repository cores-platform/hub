import { cn } from '@/lib/utils';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Home, Clock, Layout } from 'lucide-react';
import { useBoardStore } from '@/store/boardStore';
import { useAuthStore } from '@/store/authStore';
import { useClubStore } from '@/store/clubStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect } from 'react';

interface BoardSidebarProps {
  className?: string;
}

export function BoardSidebar({ className }: BoardSidebarProps) {
  const { clubId } = useParams<{ clubId: string }>();
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
          >
            <Link to={`/clubs/${clubId}/app`}>
              <Home className="mr-2 h-4 w-4" />홈
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
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
    <div
      className={cn(
        'hidden md:flex flex-col h-full w-64 border-r',
        className
      )}
    >
      {sidebarContent}
    </div>
  );
}
