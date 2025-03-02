import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useBoardStore } from '@/store/boardStore';
import { useClubStore } from '@/store/clubStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PenSquare, ArrowLeft, Settings } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function BoardDetailPage() {
  const { clubId, boardId } = useParams<{
    clubId: string;
    boardId: string;
  }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<
    Array<{
      id: number;
      title: string;
      content: string;
      author: string;
      createdAt: string;
    }>
  >([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const { currentBoard, fetchBoardById } = useBoardStore();
  const { currentClub } = useClubStore();
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
    if (!boardId || !clubId) {
      navigate(`/clubs/${clubId}/app`);
      return;
    }

    setIsLoading(true);
    fetchBoardById(clubId, boardId)
      .then(() => setIsLoading(false))
      .catch(() => {
        toast.error('게시판 정보를 불러오는데 실패했습니다.');
        navigate(`/clubs/${clubId}/app`);
      });

    // TODO: Fetch actual posts from API when available
    setPosts([
      {
        id: 1,
        title: '샘플 게시글',
        content: '이 게시판의 첫 번째 게시글입니다.',
        author: '관리자',
        createdAt: new Date().toISOString(),
      },
    ]);
  }, [boardId, clubId, fetchBoardById, navigate]);

  const handleCreatePost = () => {
    if (!newPostTitle || !newPostContent) {
      toast.error('제목과 내용을 입력해주세요.');
      return;
    }
    const newPost = {
      id: Date.now(),
      title: newPostTitle,
      content: newPostContent,
      author: user?.username || '익명',
      createdAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    toast.success('게시글이 생성되었습니다.');
  };

  if (isLoading || !currentBoard) {
    return (
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => navigate(`/clubs/${clubId}/app`)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </Button>
        <div className="mb-4">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-10 w-72 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate(`/clubs/${clubId}/app`)}
          className="mr-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로 가기
        </Button>
        {isOwnerOrAdmin && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link to={`/clubs/${clubId}/app/boards/${boardId}/edit`}>
                <Settings className="mr-2 h-4 w-4" />
                게시판 관리
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{currentBoard.name}</h1>
        <p className="text-muted-foreground mt-1">
          {currentBoard.description}
        </p>
      </div>

      <Tabs defaultValue="posts">
        <TabsList className="mb-4">
          <TabsTrigger value="posts">게시글</TabsTrigger>
          <TabsTrigger value="new">새 글 작성</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{post.content}</p>
                    <div className="text-sm text-muted-foreground mt-2">
                      작성자: {post.author} |{' '}
                      {new Date(post.createdAt).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">
                  아직 게시글이 없습니다.
                </p>
                <Button
                  variant="outline"
                  asChild
                >
                  <Link to="#">
                    <PenSquare className="mr-2 h-4 w-4" /> 첫 글 작성하기
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>새 게시글 작성</CardTitle>
              <CardDescription>
                '{currentBoard.name}' 게시판에 새 글을 작성합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="mb-4">
                  <Input
                    placeholder="게시글 제목"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <Textarea
                    placeholder="게시글 내용을 입력하세요"
                    rows={10}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleCreatePost}>게시글 등록</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
