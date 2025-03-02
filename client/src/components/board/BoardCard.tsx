import { Link } from 'react-router-dom';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Board } from '@/lib/api-board';
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
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface BoardCardProps {
  board: Board;
  clubId: string;
  canManage: boolean;
  onDelete: (boardId: string) => void;
}

export function BoardCard({
  board,
  clubId,
  canManage,
  onDelete,
}: BoardCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{board.name}</CardTitle>
            <CardDescription>{board.description}</CardDescription>
          </div>
          {canManage && (
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
                    to={`/clubs/${clubId}/app/boards/${board._id}/edit`}
                    className="flex items-center"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    게시판 편집
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(board._id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  게시판 삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge variant={board.isActive ? 'default' : 'secondary'}>
            {board.isActive ? '활성화' : '비활성화'}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground pt-1">
        <div className="flex justify-between items-center w-full">
          <span>
            생성:{' '}
            {formatDistanceToNow(new Date(board.createdAt), {
              addSuffix: true,
              locale: ko,
            })}
          </span>
          <Button
            asChild
            variant="ghost"
            size="sm"
          >
            <Link to={`/clubs/${clubId}/app/boards/${board._id}`}>
              게시판 보기
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
