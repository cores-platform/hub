import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  User,
  Edit,
  Mail,
  Calendar as CalendarIcon,
  Clock,
} from '@/components/icons';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  // 개별 선택자를 사용하여 무한 루프 방지
  const currentUser = useUserStore((state) => state.currentUser);
  const fetchMyProfile = useUserStore((state) => state.fetchMyProfile);
  const isLoading = useUserStore((state) => state.isLoading);
  const error = useUserStore((state) => state.error);

  // 로그인 여부 확인
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyProfile();
    }
  }, [isAuthenticated, fetchMyProfile]);

  // 사용자 이니셜 생성 함수
  const getUserInitials = () => {
    if (!currentUser) return '?';

    if (currentUser.firstName && currentUser.lastName) {
      return `${currentUser.firstName.charAt(
        0
      )}${currentUser.lastName.charAt(0)}`;
    }

    return currentUser.username.charAt(0).toUpperCase();
  };

  // 가입일 포맷팅
  const formatDate = (dateString?: string) => {
    if (!dateString) return '정보 없음';
    return format(new Date(dateString), 'yyyy년 MM월 dd일', { locale: ko });
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">오류 발생</CardTitle>
            <CardDescription>
              프로필 정보를 불러오는 중 오류가 발생했습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-destructive">{error}</p>
            <Button
              onClick={() => fetchMyProfile()}
              className="mt-4"
            >
              다시 시도
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">프로필 정보 없음</CardTitle>
            <CardDescription>
              프로필 정보를 불러올 수 없습니다. 로그인이 필요합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link to="/login">로그인</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              {currentUser.profileImage ? (
                <AvatarImage
                  src={currentUser.profileImage}
                  alt={currentUser.username}
                />
              ) : (
                <AvatarFallback className="text-2xl">
                  {getUserInitials()}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          <CardTitle className="text-2xl">
            {currentUser.firstName && currentUser.lastName
              ? `${currentUser.firstName} ${currentUser.lastName}`
              : currentUser.username}
          </CardTitle>
          <CardDescription className="flex items-center justify-center gap-1 mt-1">
            <User className="h-4 w-4" /> @{currentUser.username}
          </CardDescription>
          <div className="mt-2">
            <Badge
              variant="outline"
              className="text-primary"
            >
              {currentUser.role === 'admin' ? '관리자' : '일반 사용자'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">사용자 정보</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">이메일:</span>
                <span>{currentUser.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">가입일:</span>
                <span>{formatDate(currentUser.createdAt)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">최근 로그인:</span>
                <span>{formatDate(currentUser.lastLogin)}</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">상태:</span>
                <span>
                  {currentUser.isActive ? (
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-500 hover:bg-green-500/10"
                    >
                      활성
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-red-500/10 text-red-500 hover:bg-red-500/10"
                    >
                      비활성
                    </Badge>
                  )}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-6">
          <Button asChild>
            <Link to="/profile/edit">
              <Edit className="h-4 w-4 mr-2" /> 프로필 수정
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// 프로필 스켈레톤 UI
function ProfileSkeleton() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>
          <Skeleton className="h-8 w-40 mx-auto mb-2" />
          <Skeleton className="h-4 w-32 mx-auto" />
          <div className="mt-2 flex justify-center">
            <Skeleton className="h-5 w-20" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator />

          <div className="space-y-4">
            <Skeleton className="h-6 w-32 mb-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2"
                >
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-6">
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    </div>
  );
}
