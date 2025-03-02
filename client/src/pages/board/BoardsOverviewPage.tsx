import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useBoardStore } from '@/store/boardStore';
import { useClubStore } from '@/store/clubStore';
import { useAuthStore } from '@/store/authStore';
import { BoardCard } from '@/components/board/BoardCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function BoardsOverviewPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { boards, isLoading, error, fetchClubBoards, deleteBoard } =
    useBoardStore();
  const { currentClub, fetchClubById } = useClubStore();
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
      // Load club details if not already loaded
      if (!currentClub || currentClub._id !== clubId) {
        fetchClubById(clubId).catch(() => {
          toast.error('동아리 정보를 불러오는데 실패했습니다.');
        });
      }

      // Load boards
      fetchClubBoards(clubId).catch(() => {
        toast.error('게시판 목록을 불러오는데 실패했습니다.');
      });
    }
  }, [clubId, fetchClubBoards, currentClub, fetchClubById]);

  const handleDeleteBoard = async () => {
    if (!boardToDelete) return;

    try {
      await deleteBoard(clubId!, boardToDelete);
      toast.success('게시판이 삭제되었습니다.');
      setIsDeleteDialogOpen(false);
      setBoardToDelete(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || '게시판 삭제에 실패했습니다.'
      );
    }
  };

  const onDeleteClick = (boardId: string) => {
    setBoardToDelete(boardId);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading && boards.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border rounded-lg p-6"
            >
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-20 mb-2" />
              <div className="flex justify-between mt-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {currentClub?.name || '동아리'} 게시판
        </h1>
        <p className="text-muted-foreground mt-1">
          전체 게시판 목록입니다.
        </p>
      </div>

      {isOwnerOrAdmin && (
        <div className="mb-6">
          <Button asChild>
            <Link to={`/clubs/${clubId}/app/boards/create`}>
              <PlusCircle className="mr-2 h-4 w-4" />새 게시판 만들기
            </Link>
          </Button>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {boards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <BoardCard
              key={board._id}
              board={board}
              clubId={clubId || ''}
              canManage={isOwnerOrAdmin || false}
              onDelete={onDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="bg-muted/50 border rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">게시판이 없습니다</h3>
          <p className="text-muted-foreground mb-4">
            아직 생성된 게시판이 없습니다. 첫 번째 게시판을 만들어보세요.
          </p>
          {isOwnerOrAdmin && (
            <Button asChild>
              <Link to={`/clubs/${clubId}/app/boards/create`}>
                <PlusCircle className="mr-2 h-4 w-4" />새 게시판 만들기
              </Link>
            </Button>
          )}
        </div>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게시판 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 게시판을 삭제하시겠습니까? 이 작업은 되돌릴 수
              없으며, 모든 게시글도 함께 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBoardToDelete(null)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBoard}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
