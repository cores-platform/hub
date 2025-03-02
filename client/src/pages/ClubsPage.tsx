import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Users,
  Globe,
  Lock,
  RefreshCw,
  User,
  CalendarIcon,
} from '@/components/icons';
import { useClubStore } from '@/store/clubStore';
import { useAuthStore } from '@/store/authStore';
import { Club } from '@/lib/api-club';
import { joinClub as apiJoinClub } from '@/lib/api-club';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function ClubsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { clubs, pagination, fetchClubs } = useClubStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 페이지 로드 시 동아리 목록 가져오기
  useEffect(() => {
    loadClubs();
  }, [currentPage, selectedCategory]);

  // 검색어 입력 후 일정 시간이 지난 후에 검색 수행
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        loadClubs();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadClubs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await fetchClubs({
        search: searchTerm,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        page: currentPage,
        limit: 9, // 한 페이지에 9개씩 표시
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        '동아리 목록을 불러오는데 실패했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 핸들러
  const handleSearch = () => {
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
    loadClubs();
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 이동
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '날짜 정보 없음';

    try {
      const date = new Date(dateString);
      // 유효한 날짜인지 확인 (Invalid Date 체크)
      if (isNaN(date.getTime())) {
        return '날짜 정보 없음';
      }
      return format(date, 'yyyy년 MM월 dd일', { locale: ko });
    } catch (error) {
      console.error('날짜 포맷팅 오류:', error);
      return '날짜 정보 없음';
    }
  };

  // 로딩 중 UI
  if (isLoading && clubs.length === 0) {
    return <ClubsPageSkeleton />;
  }

  // 오류 발생 시 UI
  if (error && clubs.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">오류가 발생했습니다</CardTitle>
            <CardDescription>
              동아리 목록을 불러오는 중 문제가 발생했습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button
              onClick={loadClubs}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              다시 시도
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">동아리 목록</h1>
          <p className="text-muted-foreground mt-1">
            다양한 동아리를 찾아보고 가입하세요
          </p>
        </div>
        {isAuthenticated && (
          <Button asChild>
            <Link to="/clubs/create">
              <Plus className="mr-2 h-4 w-4" />
              동아리 만들기
            </Link>
          </Button>
        )}
      </div>

      <Separator className="mb-6" />

      {/* 검색 및 필터링 */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow flex gap-2">
          <Input
            placeholder="동아리 이름 또는 설명 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-grow"
          />
          <Button onClick={handleSearch}>검색</Button>
        </div>
        <Select
          value={selectedCategory}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 카테고리</SelectItem>
            <SelectItem value="학술">학술</SelectItem>
            <SelectItem value="스포츠">스포츠</SelectItem>
            <SelectItem value="문화예술">문화예술</SelectItem>
            <SelectItem value="봉사">봉사</SelectItem>
            <SelectItem value="친목">친목</SelectItem>
            <SelectItem value="기타">기타</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {clubs.length === 0 ? (
        <Card className="text-center p-6">
          <CardHeader>
            <div className="mx-auto bg-muted rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
              <Users className="h-8 w-8" />
            </div>
            <CardTitle className="text-xl">
              조건에 맞는 동아리가 없습니다
            </CardTitle>
            <CardDescription>
              검색어나 카테고리를 변경하여 다시 시도해보세요
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {isAuthenticated ? (
              <Button
                asChild
                variant="outline"
              >
                <Link to="/clubs/create">
                  <Plus className="mr-2 h-4 w-4" />
                  직접 동아리 만들기
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
              >
                <Link to="/login">로그인하여 동아리 만들기</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <ClubCard
                key={club._id}
                club={club}
                formatDate={formatDate}
                isAuthenticated={isAuthenticated}
                refreshClubs={loadClubs}
              />
            ))}
          </div>

          {/* 페이지네이션 */}
          {pagination.pages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                    className={
                      currentPage <= 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === pagination.pages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, index, array) => {
                    // 생략 부분 표시
                    if (index > 0 && array[index - 1] !== page - 1) {
                      return (
                        <PaginationItem key={`ellipsis-${page}`}>
                          <span className="px-4">...</span>
                        </PaginationItem>
                      );
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < pagination.pages &&
                      handlePageChange(currentPage + 1)
                    }
                    className={
                      currentPage >= pagination.pages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {/* 새로고침 버튼 */}
      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          onClick={loadClubs}
          className="gap-2"
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
          />
          동아리 목록 새로고침
        </Button>
      </div>
    </div>
  );
}

interface ClubCardProps {
  club: Club;
  formatDate: (dateString: string | null | undefined) => string;
  isAuthenticated: boolean;
  refreshClubs: () => Promise<void>;
}

// 동아리 카드 컴포넌트
function ClubCard({
  club,
  formatDate,
  isAuthenticated,
  refreshClubs,
}: ClubCardProps) {
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoinClub = async () => {
    if (!isAuthenticated) {
      toast.error('로그인 후 이용 가능합니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiJoinClub(club._id);
      setJoinDialogOpen(false);
      toast.success(
        club.isPrivate
          ? `'${club.name}' 동아리 가입 신청이 완료되었습니다.`
          : `'${club.name}' 동아리에 가입되었습니다.`
      );

      // 가입 후 목록 새로고침
      await refreshClubs();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || '동아리 가입에 실패했습니다.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-40 bg-muted">
        {club.imageUrl ? (
          <img
            src={club.imageUrl}
            alt={club.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Users className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge
            variant="secondary"
            className="flex items-center gap-1"
          >
            {club.isPrivate ? (
              <>
                <Lock className="h-3 w-3" /> 비공개
              </>
            ) : (
              <>
                <Globe className="h-3 w-3" /> 공개
              </>
            )}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{club.name}</CardTitle>
        </div>
        <CardDescription>{club.category}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="line-clamp-3 text-sm">
          {club.description || '설명이 없습니다.'}
        </p>

        <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{club.memberCount || 0}명의 멤버</span>
        </div>

        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <CalendarIcon className="h-3 w-3" />
          <span>생성일: {formatDate(club.createdAt)}</span>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4 gap-2">
        <Button
          asChild
          className="flex-1"
        >
          <Link to={`/clubs/${club._id}`}>상세보기</Link>
        </Button>

        {isAuthenticated && !club.userMembershipStatus && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setJoinDialogOpen(true)}
          >
            가입하기
          </Button>
        )}

        {/* 가입 확인 다이얼로그 */}
        <Dialog
          open={joinDialogOpen}
          onOpenChange={setJoinDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                동아리 가입{club.isPrivate ? ' 신청' : ''}
              </DialogTitle>
              <DialogDescription>
                {club.isPrivate
                  ? `'${club.name}' 동아리는 비공개 동아리입니다. 가입 신청 후 관리자의 승인이 필요합니다.`
                  : `'${club.name}' 동아리에 가입하시겠습니까?`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setJoinDialogOpen(false)}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                onClick={handleJoinClub}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    처리 중...
                  </>
                ) : club.isPrivate ? (
                  '가입 신청'
                ) : (
                  '가입하기'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

// 동아리 목록 로딩 스켈레톤 UI
function ClubsPageSkeleton() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <Separator className="mb-6" />

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Skeleton className="h-10 flex-grow" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card
              key={i}
              className="overflow-hidden"
            >
              <Skeleton className="h-40 rounded-none" />
              <CardHeader>
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-3/4" />
                </div>
                <Skeleton className="h-4 w-1/3 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-1" />
                <Skeleton className="h-4 w-2/3 mt-1" />

                <div className="mt-4">
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="mt-1">
                  <Skeleton className="h-3 w-32" />
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
}
