import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PostForm } from '@/components/post/PostForm';
import { usePostStore } from '@/store/postStore';
import { useBoardStore } from '@/store/boardStore';

export default function CreatePostPage() {
  const { clubId, boardId } = useParams<{
    clubId: string;
    boardId: string;
  }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPost } = usePostStore();
  const { currentBoard, fetchBoardById } = useBoardStore();

  React.useEffect(() => {
    if (boardId && clubId) {
      fetchBoardById(clubId, boardId);
    }
  }, [boardId, clubId, fetchBoardById]);

  const handleSubmit = async (data: { title: string; content: string }) => {
    if (!clubId || !boardId) return;

    setIsSubmitting(true);
    try {
      await createPost(clubId, boardId, data);
      toast.success('게시글이 작성되었습니다.');
      navigate(`/clubs/${clubId}/app/boards/${boardId}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || '게시글 작성에 실패했습니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/clubs/${clubId}/app/boards/${boardId}`)}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </Button>
        <h1 className="text-2xl font-bold">새 게시글 작성</h1>
        <p className="text-muted-foreground">
          {currentBoard?.name || '게시판'}에 새로운 게시글을 작성합니다.
        </p>
      </div>

      <PostForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
