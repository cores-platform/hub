import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { BoardForm } from '@/components/board/BoardForm';
import { useBoardStore } from '@/store/boardStore';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditBoardPage() {
  const { clubId, boardId } = useParams<{
    clubId: string;
    boardId: string;
  }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentBoard, fetchBoardById, updateBoard } = useBoardStore();

  useEffect(() => {
    if (boardId) {
      fetchBoardById(clubId!, boardId).catch(() => {
        toast.error('게시판 정보를 불러오는데 실패했습니다.');
        navigate(`/clubs/${clubId}/app`);
      });
    }
  }, [boardId, fetchBoardById, navigate, clubId]);

  const handleSubmit = async (data: {
    name: string;
    description: string;
    isActive: boolean;
  }) => {
    if (!boardId) return;

    setIsSubmitting(true);
    try {
      await updateBoard(clubId!, boardId, data);
      toast.success('게시판이 수정되었습니다.');
      navigate(`/clubs/${clubId}/app/boards/${boardId}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || '게시판 수정에 실패했습니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentBoard) {
    return (
      <div className="container max-w-2xl py-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/clubs/${clubId}/app`)}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </Button>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/clubs/${clubId}/app/boards/${boardId}`)}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </Button>
        <h1 className="text-2xl font-bold">게시판 수정</h1>
        <p className="text-muted-foreground">
          '{currentBoard.name}' 게시판의 정보를 수정합니다.
        </p>
      </div>

      <BoardForm
        board={currentBoard}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
