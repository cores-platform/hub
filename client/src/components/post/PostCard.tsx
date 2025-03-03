import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  MessageCircle,
  Eye,
} from 'lucide-react';
import { Post } from '@/lib/api-post';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// EditorJS 데이터에서 텍스트만 추출하는 함수
const extractTextFromEditorData = (content: string) => {
  try {
    // JSON 형식인지 확인
    if (typeof content === 'string' && content.startsWith('{')) {
      const editorData = JSON.parse(content);
      if (editorData.blocks && Array.isArray(editorData.blocks)) {
        return editorData.blocks
          .map((block: any) => {
            if (block.type === 'paragraph') {
              return block.data.text;
            } else if (block.type === 'header') {
              return block.data.text;
            } else if (block.type === 'list') {
              return block.data.items.join(' ');
            }
            return '';
          })
          .join(' ');
      }
    }

    // 일반 텍스트인 경우 HTML 태그 제거
    return content.replace(/(<\/?[^>]+(>|$)|&[a-z]+;)/g, '');
  } catch (error) {
    // 파싱 에러시 원본 텍스트에서 HTML 태그만 제거
    return content.replace(/(<\/?[^>]+(>|$)|&[a-z]+;)/g, '');
  }
};

interface PostCardProps {
  post: Post;
  clubId: string;
  boardId: string;
  isAuthorOrAdmin: boolean;
  onDelete: (postId: string) => void;
  compact?: boolean;
}

export function PostCard({
  post,
  clubId,
  boardId,
  isAuthorOrAdmin,
  onDelete,
  compact = false,
}: PostCardProps) {
  const authorName =
    typeof post.author === 'object' ? post.author.username : '익명';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl hover:text-primary transition-colors">
              <Link
                to={`/clubs/${clubId}/app/boards/${boardId}/posts/${post._id}`}
              >
                {post.title}
              </Link>
            </CardTitle>
            {!compact && (
              <CardDescription className="mt-1">
                작성자: {authorName} •{' '}
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: ko,
                })}
              </CardDescription>
            )}
          </div>
          {isAuthorOrAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">메뉴</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    to={`/clubs/${clubId}/app/boards/${boardId}/posts/${post._id}/edit`}
                    className="flex items-center"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    게시글 수정
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(post._id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  게시글 삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      {!compact && (
        <CardContent>
          <p className="line-clamp-2 text-muted-foreground">
            {extractTextFromEditorData(post.content)}
          </p>
        </CardContent>
      )}
      <CardFooter className="text-sm text-muted-foreground pt-1">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> {post.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />{' '}
              {post.comments?.length || 0}
            </span>
          </div>
          {compact && (
            <span className="text-xs">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: ko,
              })}
            </span>
          )}
          {!compact && (
            <Button
              asChild
              variant="ghost"
              size="sm"
            >
              <Link
                to={`/clubs/${clubId}/app/boards/${boardId}/posts/${post._id}`}
              >
                자세히 보기
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
