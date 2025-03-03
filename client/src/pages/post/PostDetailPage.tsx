import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Edit, Trash2, ThumbsUp } from 'lucide-react';

import EditorJSComponent from '@/components/editor/EditorJS';
import { Button } from '@/components/ui/button';
import { usePostStore } from '@/store/postStore';
import { useAuthStore } from '@/store/authStore';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
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

// 포스트 데이터 파싱 함수
const parsePostContent = (content: string | undefined) => {
  if (!content) return { blocks: [] };

  try {
    // JSON 문자열인 경우 파싱
    if (
      typeof content === 'string' &&
      content.startsWith('{') &&
      content.endsWith('}')
    ) {
      const parsedData = JSON.parse(content);

      // 유효한 Editor.js 데이터 구조인지 확인
      if (parsedData && Array.isArray(parsedData.blocks)) {
        // 각 블록의 데이터 구조 검증
        const validBlocks = parsedData.blocks.map((block: any) => {
          if (!block.data) block.data = {};

          // paragraph 블록에 text 필드가 없는 경우 추가
          if (block.type === 'paragraph' && block.data.text === undefined) {
            block.data.text = '';
          }

          return block;
        });

        return {
          ...parsedData,
          blocks: validBlocks,
        };
      }
    }

    // 일반 텍스트인 경우 paragraph 블록으로 변환
    // 각 줄을 별도의 paragraph로 처리
    const paragraphs = content.split('\n\n').filter(Boolean);
    const blocks =
      paragraphs.length > 0
        ? paragraphs.map((text) => ({
            type: 'paragraph',
            data: { text },
          }))
        : [{ type: 'paragraph', data: { text: content } }];

    return { blocks };
  } catch (error) {
    console.error('Content parsing error:', error);
    // 파싱 실패 시 단일 paragraph 블록으로 저장
    return {
      blocks: [{ type: 'paragraph', data: { text: content } }],
    };
  }
};

export default function PostDetailPage() {
  const { clubId, boardId, postId } = useParams<{
    clubId: string;
    boardId: string;
    postId: string;
  }>();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { currentPost, isLoading, fetchPostById, deletePost } =
    usePostStore();
  const { user } = useAuthStore();

  // 인스턴스 ID를 사용하여 에디터 고유 식별
  const editorInstanceId = useMemo(
    () => `editor-view-${currentPost?._id || 'unknown'}-${Date.now()}`,
    [currentPost?._id]
  );

  // 게시글 내용을 EditorJS 형식으로
  const [editorData, setEditorData] = useState<any>({ blocks: [] });

  useEffect(() => {
    if (clubId && boardId && postId) {
      fetchPostById(clubId, boardId, postId).catch(() => {
        toast.error('게시글을 불러오는데 실패했습니다.');
        navigate(`/clubs/${clubId}/app/boards/${boardId}`);
      });
    }
  }, [clubId, boardId, postId, fetchPostById, navigate]);

  useEffect(() => {
    if (currentPost?.content) {
      setEditorData(parsePostContent(currentPost.content));
    }
  }, [currentPost?.content]);

  const handleDelete = async () => {
    if (!clubId || !boardId || !postId) return;

    try {
      await deletePost(clubId, boardId, postId);
      toast.success('게시글이 삭제되었습니다.');
      navigate(`/clubs/${clubId}/app/boards/${boardId}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || '게시글 삭제에 실패했습니다.'
      );
    }
  };

  // 본인 게시글인지 확인
  const isAuthor =
    currentPost &&
    user &&
    (typeof currentPost.author === 'object'
      ? currentPost.author._id === user._id
      : currentPost.author === user._id);

  if (isLoading || !currentPost) {
    return (
      <div className="container max-w-4xl py-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/clubs/${clubId}/app/boards/${boardId}`)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          목록으로
        </Button>

        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <div className="flex justify-between">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const authorName =
    typeof currentPost.author === 'object'
      ? currentPost.author.username
      : '익명';

  return (
    <div className="container max-w-4xl p-6">
      <Button
        variant="ghost"
        onClick={() => navigate(`/clubs/${clubId}/app/boards/${boardId}`)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        목록으로
      </Button>

      <div className="border rounded-lg bg-card">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{currentPost.title}</h1>

          <div className="flex justify-between items-center text-sm text-muted-foreground mb-6 pb-4 border-b">
            <div>
              작성자: {authorName} •
              {formatDistanceToNow(new Date(currentPost.createdAt), {
                addSuffix: true,
                locale: ko,
              })}
            </div>
            <div>조회수: {currentPost.views}</div>
          </div>

          <div className="mt-4 prose dark:prose-invert max-w-none">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
              </>
            ) : (
              <div className="border rounded-md p-4">
                {currentPost?.content && !isLoading && (
                  <div className="static-editor-container">
                    <EditorJSComponent
                      key={editorInstanceId}
                      data={editorData}
                      onChange={() => {}}
                      placeholder="내용을 확인하세요"
                      readOnly={true}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              좋아요 {currentPost.likes?.length || 0}
            </Button>
          </div>
        </div>

        {isAuthor && (
          <div className="flex justify-end gap-2 p-4 border-t bg-muted/20">
            <Button
              asChild
              variant="outline"
              size="sm"
            >
              <Link
                to={`/clubs/${clubId}/app/boards/${boardId}/posts/${postId}/edit`}
              >
                <Edit className="mr-2 h-4 w-4" />
                수정
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              삭제
            </Button>
          </div>
        )}
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수
              없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
