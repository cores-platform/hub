import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { PostCard } from '@/components/post/PostCard';
import { usePostStore } from '@/store/postStore';
import { useBoardStore } from '@/store/boardStore';
import { useAuthStore } from '@/store/authStore';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
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

export default function BoardPostsPage() {
  const { clubId, boardId } = useParams<{
    clubId: string;
    boardId: string;
  }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { posts, pagination, isLoading, fetchPosts, deletePost } =
    usePostStore();
  const { currentBoard, fetchBoardById } = useBoardStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (boardId && clubId) {
      fetchBoardById(clubId, boardId);
      fetchPosts(clubId, boardId, { page: currentPage, limit: 10 });
    }
  }, [boardId, clubId, currentPage, fetchBoardById, fetchPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubId || !boardId) return;
    fetchPosts(clubId, boardId, { search: searchTerm, page: 1 });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!clubId || !boardId || !postToDelete) return;

    try {
      await deletePost(clubId, boardId, postToDelete);
      toast.success('게시글이 삭제되었습니다.');
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || '게시글 삭제에 실패했습니다.'
      );
    }
  };

  // 작성자 또는 관리자인지 확인
  const isAuthorOrAdmin = (authorId: string) => {
    if (!user) return false;
    return user._id === authorId; // 실제 애플리케이션에서는 관리자 권한도 확인해야 함
  };

  if (isLoading && !posts.length) {
    return (
      <div className="p-4">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border rounded-lg p-4"
            >
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {currentBoard?.name || '게시판'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {currentBoard?.description}
        </p>
      </div>

      <Tabs
        defaultValue="posts"
        className="mb-6"
      >
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="posts">전체 게시글</TabsTrigger>
            <TabsTrigger value="popular">인기 게시글</TabsTrigger>
          </TabsList>

          <Button asChild>
            <Link
              to={`/clubs/${clubId}/app/boards/${boardId}/posts/create`}
            >
              <PlusCircle className="mr-2 h-4 w-4" />새 게시글 작성
            </Link>
          </Button>
        </div>

        <div className="my-4">
          <form
            onSubmit={handleSearch}
            className="flex gap-2"
          >
            <Input
              placeholder="게시글 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button
              type="submit"
              variant="outline"
            >
              검색
            </Button>
          </form>
        </div>

        <TabsContent
          value="posts"
          className="mt-6"
        >
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  clubId={clubId || ''}
                  boardId={boardId || ''}
                  isAuthorOrAdmin={isAuthorOrAdmin(
                    typeof post.author === 'object'
                      ? post.author._id
                      : post.author
                  )}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg bg-muted/30">
              <h3 className="text-lg font-medium mb-2">
                게시글이 없습니다
              </h3>
              <p className="text-muted-foreground mb-4">
                아직 작성된 게시글이 없습니다. 첫 번째 게시글을
                작성해보세요.
              </p>
              <Button asChild>
                <Link
                  to={`/clubs/${clubId}/app/boards/${boardId}/posts/create`}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />새 게시글 작성
                </Link>
              </Button>
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1)
                          handlePageChange(currentPage - 1);
                      }}
                    />
                  </PaginationItem>

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < pagination.totalPages)
                          handlePageChange(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="popular"
          className="mt-6"
        >
          <div className="text-center py-8 border rounded-lg bg-muted/30">
            <p className="text-muted-foreground">
              조회수 기준 인기 게시글이 표시됩니다.
            </p>
          </div>
        </TabsContent>
      </Tabs>

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
            <AlertDialogCancel onClick={() => setPostToDelete(null)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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
