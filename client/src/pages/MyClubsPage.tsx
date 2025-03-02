import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Users,
  Globe,
  Lock,
  User,
  CalendarIcon,
  RefreshCw,
} from '@/components/icons';
import { useAuthStore } from '@/store/authStore';
import { getUserClubs, getUserManagedClubs, Club } from '@/lib/api-user';
import { leaveClub as apiLeaveClub } from '@/lib/api-club';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function MyClubsPage() {
  // 로그인 여부 확인
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [managedClubs, setManagedClubs] = useState<Club[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 로그인 상태가 아니면 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchClubs();
  }, [isAuthenticated, navigate]);

  const fetchClubs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 모든 가입 동아리 가져오기
      const allClubsResponse = await getUserClubs();
      setAllClubs(allClubsResponse.clubs);

      // 관리자로 속한 동아리 가져오기
      const managedClubsResponse = await getUserManagedClubs();
      setManagedClubs(managedClubsResponse.clubs);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        '동아리 목록을 불러오는데 실패했습니다.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 동아리 탈퇴 처리
  const handleLeaveClub = async (clubId: string, clubName: string) => {
    try {
      await apiLeaveClub(clubId);
      toast.success(`'${clubName}' 동아리에서 탈퇴했습니다.`);
      // 목록 새로고침
      fetchClubs();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || '동아리 탈퇴에 실패했습니다.';
      toast.error(errorMessage);
    }
  };

  // 역할에 따른 배지 컬러 결정
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10';
      case 'admin':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/10';
      case 'member':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/10';
      case 'pending':
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/10';
      default:
        return '';
    }
  };

  // 역할 한글 이름
  const getRoleName = (role: string) => {
    switch (role) {
      case 'owner':
        return '소유자';
      case 'admin':
        return '관리자';
      case 'member':
        return '멤버';
      case 'pending':
        return '대기 중';
      default:
        return '';
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy년 MM월 dd일', { locale: ko });
  };

  // 사용자 역할 찾기
  const getUserRoleInClub = (club: Club) => {
    // 현재 사용자의 ID가 필요
    // 실제 구현에서는 사용자 ID를 사용해야 함
    // 여기서는 members 배열에서 role이 owner인 첫 번째 항목 반환
    const ownerMember = club.members.find((m) => m.role === 'owner');
    return ownerMember ? ownerMember.role : 'member';
  };

  // 로딩 중 UI
  if (isLoading) {
    return <MyClubsSkeleton />;
  }

  // 오류 발생 시 UI
  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">오류가 발생했습니다</CardTitle>
            <CardDescription>
              동아리 정보를 불러오는 중 문제가 발생했습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button
              onClick={fetchClubs}
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

  // 현재 선택된 탭에 따라 보여줄 클럽 목록 선택
  const displayClubs = activeTab === 'all' ? allClubs : managedClubs;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">내 동아리</h1>
          <p className="text-muted-foreground mt-1">
            가입한 동아리 및 관리 중인 동아리를 확인하세요
          </p>
        </div>
        <Button asChild>
          <Link to="/clubs/create">
            <Plus className="mr-2 h-4 w-4" />
            동아리 만들기
          </Link>
        </Button>
      </div>

      <Separator className="mb-6" />

      {/* 탭 메뉴 */}
      <Tabs
        defaultValue="all"
        className="mb-6"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="all">모든 동아리</TabsTrigger>
          <TabsTrigger value="managed">관리 중인 동아리</TabsTrigger>
        </TabsList>
      </Tabs>

      {displayClubs.length === 0 ? (
        <Card className="text-center p-6">
          <CardHeader>
            <div className="mx-auto bg-muted rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
              <Users className="h-8 w-8" />
            </div>
            <CardTitle className="text-xl">
              {activeTab === 'all'
                ? '가입한 동아리가 없습니다'
                : '관리 중인 동아리가 없습니다'}
            </CardTitle>
            <CardDescription>
              {activeTab === 'all'
                ? '새로운 동아리에 가입하거나 직접 만들어보세요'
                : '새로운 동아리를 만들어 관리자가 되어보세요'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                variant="default"
              >
                <Link to="/clubs">동아리 찾아보기</Link>
              </Button>
              <Button
                asChild
                variant="outline"
              >
                <Link to="/clubs/create">
                  <Plus className="mr-2 h-4 w-4" />
                  동아리 만들기
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayClubs.map((club) => (
            <ClubCard
              key={club._id}
              club={club}
              userRole={getUserRoleInClub(club)}
              getRoleBadgeVariant={getRoleBadgeVariant}
              getRoleName={getRoleName}
              formatDate={formatDate}
              onLeaveClub={handleLeaveClub}
            />
          ))}
        </div>
      )}

      {/* 새로고침 버튼 */}
      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          onClick={fetchClubs}
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
  userRole: string;
  getRoleBadgeVariant: (role: string) => string;
  getRoleName: (role: string) => string;
  formatDate: (dateString: string) => string;
  onLeaveClub: (clubId: string, clubName: string) => Promise<void>;
}

// 동아리 카드 컴포넌트
function ClubCard({
  club,
  userRole,
  getRoleBadgeVariant,
  getRoleName,
  formatDate,
  onLeaveClub,
}: ClubCardProps) {
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLeave = async () => {
    setIsSubmitting(true);
    try {
      await onLeaveClub(club._id, club.name);
      setLeaveDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 소유자인 경우 탈퇴 불가능
  const canLeave = userRole !== 'owner';

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
          <Badge className={getRoleBadgeVariant(userRole)}>
            {getRoleName(userRole)}
          </Badge>
        </div>
        <CardDescription>{club.category}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="line-clamp-3 text-sm">
          {club.description || '설명이 없습니다.'}
        </p>

        <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{club.members.length}명의 멤버</span>
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

        {canLeave && (
          <Button
            variant="outline"
            className="flex-1 text-destructive border-destructive hover:bg-destructive/10"
            onClick={() => setLeaveDialogOpen(true)}
          >
            탈퇴하기
          </Button>
        )}

        {/* 탈퇴 확인 다이얼로그 */}
        <Dialog
          open={leaveDialogOpen}
          onOpenChange={setLeaveDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>동아리 탈퇴</DialogTitle>
              <DialogDescription>
                정말로 '{club.name}' 동아리에서 탈퇴하시겠습니까? 이 작업은
                되돌릴 수 없습니다.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setLeaveDialogOpen(false)}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                variant="destructive"
                onClick={handleLeave}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  '탈퇴하기'
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
function MyClubsSkeleton() {
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

      <div className="w-full max-w-md mb-6">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3)
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
                  <Skeleton className="h-5 w-16" />
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
