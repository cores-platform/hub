import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { BoardForm } from '@/components/board/BoardForm';
import { useBoardStore } from '@/store/boardStore';

export default function CreateBoardPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createBoard } = useBoardStore();

  const handleSubmit = async (data: {
    name: string;
    description: string;
  }) => {
    if (!clubId) return;

    setIsSubmitting(true);
    try {
      const { ...boardData } = data;
      await createBoard(clubId, boardData);
      toast.success('게시판이 생성되었습니다.');
      navigate(`/clubs/${clubId}/app`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || '게시판 생성에 실패했습니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/clubs/${clubId}/app`)}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </Button>
        <h1 className="text-2xl font-bold">새 게시판 생성</h1>
        <p className="text-muted-foreground">
          동아리에 새로운 게시판을 생성합니다.
        </p>
      </div>

      <BoardForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
