import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PostForm } from '@/components/post/PostForm';
import { usePostStore } from '@/store/postStore';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditPostPage() {
  const { clubId, boardId, postId } = useParams<{
    clubId: string;
    boardId: string;
    postId: string;
  }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentPost, fetchPostById, updatePost } = usePostStore();

  useEffect(() => {
    if (!clubId || !boardId || !postId) {
      navigate(`/clubs/${clubId}/app/boards/${boardId}`);
      return;
    }

    fetchPostById(clubId, boardId, postId).catch(() => {
      toast.error('게시글 정보를 불러오는데 실패했습니다.');
      navigate(`/clubs/${clubId}/app/boards/${boardId}`);
    });
  }, [clubId, boardId, postId, fetchPostById, navigate]);

  const handleSubmit = async (data: { title: string; content: string }) => {
    if (!clubId || !boardId || !postId) return;

    setIsSubmitting(true);
    try {
      await updatePost(clubId, boardId, postId, data);
      toast.success('게시글이 수정되었습니다.');
      navigate(`/clubs/${clubId}/app/boards/${boardId}/posts/${postId}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || '게시글 수정에 실패했습니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentPost) {
    return (
      <div className="container max-w-4xl p-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/clubs/${clubId}/app/boards/${boardId}`)}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </Button>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() =>
            navigate(
              `/clubs/${clubId}/app/boards/${boardId}/posts/${postId}`
            )
          }
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </Button>
        <h1 className="text-2xl font-bold">게시글 수정</h1>
        <p className="text-muted-foreground">기존 게시글을 수정합니다.</p>
      </div>

      <PostForm
        post={currentPost}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
