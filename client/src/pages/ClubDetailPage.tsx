import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  User,
  Globe,
  Lock,
  CalendarIcon,
  Clock,
  RefreshCw,
  Rocket,
  X,
} from '@/components/icons';
import { useClubStore } from '@/store/clubStore';
import { useAuthStore } from '@/store/authStore';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TabsContent } from '@/components/ui/tabs';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClubMemberRole } from '@/lib/api-club';

export default function ClubDetailPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string>('');

  const {
    currentClub,
    fetchClubById,
    joinClub,
    leaveClub,
    approveJoinRequest,
    rejectJoinRequest,
  } = useClubStore();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!clubId) {
      navigate('/clubs');
      return;
    }

    loadClubDetails();
  }, [clubId, navigate]);

  const loadClubDetails = async () => {
    if (!clubId) return;

    setIsLoading(true);
    setError(null);

    try {
      await fetchClubById(clubId);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        '동아리 정보를 불러오는데 실패했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinClub = async () => {
    if (!clubId) return;

    try {
      await joinClub(clubId);
      setJoinDialogOpen(false);
      toast.success('동아리 가입 신청이 완료되었습니다.');

      // 가입 후 동아리 정보 새로고침
      await loadClubDetails();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || '동아리 가입 신청에 실패했습니다.';
      toast.error(errorMessage);
    }
  };

  const handleLeaveClub = async () => {
    if (!clubId) return;

    try {
      await leaveClub(clubId);
      setLeaveDialogOpen(false);
      toast.success('동아리에서 탈퇴했습니다.');

      // 탈퇴 후 동아리 정보 새로고침
      await loadClubDetails();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || '동아리 탈퇴에 실패했습니다.';
      toast.error(errorMessage);
    }
  };

  const handleApproveJoinRequest = async (userId: string) => {
    if (!clubId) return;

    try {
      setIsLoading(true);
      await approveJoinRequest(clubId, userId);
      await fetchClubById(clubId);
      toast.success('회원 가입이 승인되었습니다.');
    } catch (error: any) {
      console.error('가입 승인 실패:', error);
      const errorMessage =
        error.response?.data?.message ||
        '회원 가입 승인 중 오류가 발생했습니다.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectJoinRequest = async (userId: string) => {
    if (!clubId) return;

    try {
      setIsLoading(true);
      await rejectJoinRequest(clubId, userId);
      await fetchClubById(clubId);
      toast.success('회원 가입이 거절되었습니다.');
    } catch (error: any) {
      console.error('가입 거절 실패:', error);
      const errorMessage =
        error.response?.data?.message ||
        '회원 가입 거절 중 오류가 발생했습니다.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const openApproveDialog = (userId: string, username: string) => {
    setSelectedUserId(userId);
    setSelectedUsername(username);
    setApproveDialogOpen(true);
  };

  const openRejectDialog = (userId: string, username: string) => {
    setSelectedUserId(userId);
    setSelectedUsername(username);
    setRejectDialogOpen(true);
  };

  // 사용자의 동아리 가입 상태 확인
  const getUserMembershipStatus = () => {
    if (!currentClub || !isAuthenticated) return null;

    // 소유자인지 확인
    if (
      typeof currentClub.owner === 'object' &&
      currentClub.owner._id === user?._id
    ) {
      return ClubMemberRole.OWNER;
    }

    // 관리자인지 확인
    if (
      Array.isArray(currentClub.admins) &&
      currentClub.admins.some((admin) => admin.user._id === user?._id)
    ) {
      return ClubMemberRole.ADMIN;
    }

    // 일반 멤버인지 확인
    if (
      Array.isArray(currentClub.members) &&
      currentClub.members.some((member) => member.user._id === user?._id)
    ) {
      return ClubMemberRole.MEMBER;
    }

    // 가입 대기 중인지 확인
    if (
      Array.isArray(currentClub.pendingMembers) &&
      currentClub.pendingMembers.some(
        (member) => member.user._id === user?._id
      )
    ) {
      return ClubMemberRole.PENDING;
    }

    return null;
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
  if (isLoading) {
    return <ClubDetailSkeleton />;
  }

  // 오류 발생 시 UI
  if (error || !currentClub) {
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={loadClubDetails}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                다시 시도
              </Button>
              <Button
                variant="outline"
                asChild
              >
                <Link to="/clubs">동아리 목록으로 돌아가기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const membershipStatus = getUserMembershipStatus();
  const isOwner = membershipStatus === 'owner';
  const isAdmin = membershipStatus === 'admin';
  const isMember = membershipStatus === 'member';
  const isPending = membershipStatus === 'pending';
  const canJoin = isAuthenticated && !membershipStatus;
  const canLeave = isAuthenticated && (isMember || isAdmin); // 소유자는 탈퇴할 수 없음

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽 사이드바: 동아리 기본 정보 */}
        <Card className="lg:col-span-1">
          <div className="relative h-48 bg-muted">
            {currentClub.imageUrl ? (
              <img
                src={currentClub.imageUrl}
                alt={currentClub.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Users className="h-20 w-20 text-muted-foreground/50" />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="flex items-center gap-1"
              >
                {currentClub.isPrivate ? (
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
            <CardTitle className="text-2xl">{currentClub.name}</CardTitle>
            <CardDescription>{currentClub.category}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">설명</h3>
              <p className="text-sm text-muted-foreground">
                {currentClub.description || '설명이 없습니다.'}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-1">소유자</h3>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={
                      typeof currentClub.owner === 'object' &&
                      currentClub.owner.profileImage
                        ? currentClub.owner.profileImage
                        : undefined
                    }
                    alt="Club Owner"
                  />
                  <AvatarFallback>
                    {typeof currentClub.owner === 'object' &&
                    currentClub.owner.username
                      ? currentClub.owner.username
                          .substring(0, 2)
                          .toUpperCase()
                      : 'OW'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  {typeof currentClub.owner === 'object' &&
                  currentClub.owner.username
                    ? currentClub.owner.username
                    : '소유자 정보 없음'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>
                {typeof currentClub.memberCount === 'number'
                  ? currentClub.memberCount
                  : currentClub.members.length}{' '}
                명의 멤버
              </span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>생성일: {formatDate(currentClub.createdAt)}</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                최근 업데이트: {formatDate(currentClub.updatedAt)}
              </span>
            </div>

            <Separator />

            {/* 가입 상태 표시 및 액션 버튼 */}
            <div className="space-y-2">
              {membershipStatus && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">가입 상태:</span>
                  <Badge
                    variant={
                      isPending
                        ? 'outline'
                        : isOwner
                        ? 'default'
                        : isAdmin
                        ? 'secondary'
                        : 'outline'
                    }
                    className={
                      isPending
                        ? 'bg-gray-500/10 text-gray-500'
                        : isOwner
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : isAdmin
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-green-500/10 text-green-500'
                    }
                  >
                    {isOwner
                      ? '소유자'
                      : isAdmin
                      ? '관리자'
                      : isMember
                      ? '멤버'
                      : isPending
                      ? '승인 대기 중'
                      : ''}
                  </Badge>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {isOwner && (
                  <Button
                    asChild
                    variant="outline"
                  >
                    <Link to={`/clubs/${clubId}/manage`}>동아리 관리</Link>
                  </Button>
                )}

                {isAdmin && (
                  <Button
                    asChild
                    variant="outline"
                  >
                    <Link to={`/clubs/${clubId}/manage`}>동아리 관리</Link>
                  </Button>
                )}

                {canJoin && (
                  <>
                    <Button
                      onClick={() => setJoinDialogOpen(true)}
                      variant="default"
                    >
                      동아리 가입{currentClub.isPrivate ? ' 신청' : ''}
                    </Button>
                    <JoinClubDialog
                      open={joinDialogOpen}
                      setOpen={setJoinDialogOpen}
                      onJoin={handleJoinClub}
                      isPrivate={currentClub.isPrivate}
                      clubName={currentClub.name}
                    />
                  </>
                )}

                {isPending && (
                  <Button
                    variant="outline"
                    disabled
                  >
                    가입 승인 대기 중
                  </Button>
                )}

                {canLeave && (
                  <>
                    <Button
                      onClick={() => setLeaveDialogOpen(true)}
                      variant="outline"
                      className="text-destructive border-destructive hover:bg-destructive/10"
                    >
                      동아리 탈퇴
                    </Button>
                    <LeaveClubDialog
                      open={leaveDialogOpen}
                      setOpen={setLeaveDialogOpen}
                      onLeave={handleLeaveClub}
                      clubName={currentClub.name}
                    />
                  </>
                )}

                {(isOwner || isAdmin || isMember) && (
                  <Button
                    asChild
                    variant="default"
                    className="shadow-md shadow-primary hover:scale-105 transition duration-200 ease-in-out"
                  >
                    <Link to={`/clubs/${currentClub._id}/app`}>
                      <Rocket className="h-4 w-4" />
                      동아리 앱
                    </Link>
                  </Button>
                )}

                {!isAuthenticated && (
                  <Button
                    asChild
                    variant="outline"
                  >
                    <Link to="/login">로그인하여 가입하기</Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 오른쪽: 동아리 탭 컨텐츠 */}
        <div className="lg:col-span-2">
          <Tabs
            defaultValue="members"
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="members">멤버</TabsTrigger>
              {/* <TabsTrigger value="posts">게시글</TabsTrigger> */}
              <TabsTrigger value="events">이벤트</TabsTrigger>
            </TabsList>

            {/* 멤버 탭 */}
            <TabsContent
              value="members"
              className="pt-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">멤버 목록</CardTitle>
                  <CardDescription>
                    이 동아리의 멤버 정보를 확인하세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* 소유자 */}
                    <div>
                      <h3 className="text-lg font-medium mb-2">소유자</h3>
                      <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                        <Avatar>
                          <AvatarImage
                            src={
                              typeof currentClub.owner === 'object' &&
                              currentClub.owner.profileImage
                                ? currentClub.owner.profileImage
                                : undefined
                            }
                            alt="Club Owner"
                          />
                          <AvatarFallback>
                            {typeof currentClub.owner === 'object' &&
                            currentClub.owner.username
                              ? currentClub.owner.username
                                  .substring(0, 2)
                                  .toUpperCase()
                              : 'OW'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {typeof currentClub.owner === 'object' &&
                            currentClub.owner.username
                              ? currentClub.owner.username
                              : '소유자 정보 없음'}
                          </p>
                          {typeof currentClub.owner === 'object' &&
                            currentClub.owner.email && (
                              <p className="text-sm text-muted-foreground">
                                {currentClub.owner.email}
                              </p>
                            )}
                        </div>
                        <Badge className="ml-auto bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10">
                          소유자
                        </Badge>
                      </div>
                    </div>

                    {/* 관리자 */}
                    {currentClub.admins &&
                      currentClub.admins.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">
                            관리자
                          </h3>
                          <div className="space-y-2">
                            {currentClub.admins.map((admin) => (
                              <div
                                key={admin.user._id}
                                className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50"
                              >
                                <Avatar>
                                  <AvatarImage
                                    src={admin.user.profileImage}
                                    alt={admin.user.username}
                                  />
                                  <AvatarFallback>
                                    {admin.user.username
                                      .substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {admin.user.username}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {admin.user.email}
                                  </p>
                                </div>
                                <Badge className="ml-auto bg-blue-500/10 text-blue-500 hover:bg-blue-500/10">
                                  관리자
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* 일반 멤버 */}
                    <div>
                      <h3 className="text-lg font-medium mb-2">멤버</h3>
                      {Array.isArray(currentClub.members) &&
                      currentClub.members.length ? (
                        <div className="space-y-2">
                          {currentClub.members.map((member) => {
                            return (
                              <div
                                key={member.user._id}
                                className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50"
                              >
                                <Avatar>
                                  <AvatarImage
                                    src={member.user.profileImage}
                                    alt={member.user.username}
                                  />
                                  <AvatarFallback>
                                    {member.user.username
                                      ? member.user.username
                                          .substring(0, 2)
                                          .toUpperCase()
                                      : 'ME'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {member.user.username ||
                                      '사용자 정보 없음'}
                                  </p>
                                  {member.user.email && (
                                    <p className="text-sm text-muted-foreground">
                                      {member.user.email}
                                    </p>
                                  )}
                                </div>
                                <Badge className="ml-auto bg-green-500/10 text-green-500 hover:bg-green-500/10">
                                  멤버
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          일반 멤버가 없습니다.
                        </p>
                      )}
                    </div>

                    {/* 승인 대기 중인 멤버 (관리자와 소유자에게만 표시) */}
                    {(isOwner || isAdmin) &&
                      currentClub.pendingMembers &&
                      currentClub.pendingMembers.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">
                            승인 대기 중인 멤버
                          </h3>
                          <div className="space-y-2">
                            {currentClub.pendingMembers.map((member) => (
                              <div
                                key={member.user._id}
                                className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50"
                              >
                                <Avatar>
                                  <AvatarImage
                                    src={member.user.profileImage}
                                    alt={member.user.username}
                                  />
                                  <AvatarFallback>
                                    {member.user.username
                                      .substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {member.user.username}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {member.user.email}
                                  </p>
                                </div>
                                <Badge className="ml-auto bg-gray-500/10 text-gray-500 hover:bg-gray-500/10">
                                  대기 중
                                </Badge>
                                <div className="flex gap-1">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={() =>
                                            openApproveDialog(
                                              member.user._id,
                                              member.user.username
                                            )
                                          }
                                          disabled={isLoading}
                                        >
                                          <CheckIcon className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>가입 승인</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>

                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-red-500 hover:bg-red-50"
                                          onClick={() =>
                                            openRejectDialog(
                                              member.user._id,
                                              member.user.username
                                            )
                                          }
                                          disabled={isLoading}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>가입 거절</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 게시글 탭 */}
            <TabsContent
              value="posts"
              className="pt-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">게시글</CardTitle>
                  <CardDescription>
                    이 동아리의 게시글 목록입니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    아직 게시글이 없습니다. 첫 게시글을 작성해보세요!
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 이벤트 탭 */}
            <TabsContent
              value="events"
              className="pt-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">이벤트</CardTitle>
                  <CardDescription>
                    이 동아리의 이벤트 목록입니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    예정된 이벤트가 없습니다.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 가입 승인 다이얼로그 */}
      <ApproveJoinRequestDialog
        open={approveDialogOpen}
        setOpen={setApproveDialogOpen}
        onApprove={async () => {
          if (selectedUserId) {
            await handleApproveJoinRequest(selectedUserId);
          }
        }}
        username={selectedUsername}
      />

      {/* 가입 거절 다이얼로그 */}
      <RejectJoinRequestDialog
        open={rejectDialogOpen}
        setOpen={setRejectDialogOpen}
        onReject={async () => {
          if (selectedUserId) {
            await handleRejectJoinRequest(selectedUserId);
          }
        }}
        username={selectedUsername}
      />
    </div>
  );
}

// 동아리 가입 다이얼로그
interface JoinClubDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onJoin: () => Promise<void>;
  isPrivate: boolean;
  clubName: string;
}

function JoinClubDialog({
  open,
  setOpen,
  onJoin,
  isPrivate,
  clubName,
}: JoinClubDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoin = async () => {
    setIsSubmitting(true);
    try {
      await onJoin();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>동아리 가입{isPrivate ? ' 신청' : ''}</DialogTitle>
          <DialogDescription>
            {isPrivate
              ? `'${clubName}' 동아리는 비공개 동아리입니다. 가입 신청 후 관리자의 승인이 필요합니다.`
              : `'${clubName}' 동아리에 가입하시겠습니까?`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            onClick={handleJoin}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                처리 중...
              </>
            ) : isPrivate ? (
              '가입 신청'
            ) : (
              '가입하기'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 동아리 탈퇴 다이얼로그
interface LeaveClubDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onLeave: () => Promise<void>;
  clubName: string;
}

function LeaveClubDialog({
  open,
  setOpen,
  onLeave,
  clubName,
}: LeaveClubDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLeave = async () => {
    setIsSubmitting(true);
    try {
      await onLeave();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>동아리 탈퇴</DialogTitle>
          <DialogDescription>
            정말로 '{clubName}' 동아리에서 탈퇴하시겠습니까? 이 작업은
            되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
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
  );
}

// 동아리 상세 스켈레톤 UI
function ClubDetailSkeleton() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽 사이드바 스켈레톤 */}
        <Card className="lg:col-span-1">
          <Skeleton className="h-48 rounded-none" />
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/3 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Skeleton className="h-4 w-1/4 mb-1" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-1" />
              <Skeleton className="h-4 w-2/3 mt-1" />
            </div>

            <Separator />

            <div>
              <Skeleton className="h-4 w-1/4 mb-1" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>

            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-3/4" />

            <Separator />

            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* 오른쪽 탭 컨텐츠 스켈레톤 */}
        <div className="lg:col-span-2">
          <Skeleton className="h-10 w-full max-w-md mb-4" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-6 w-1/4 mb-2" />
                  <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-grow">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-1/2 mt-1" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>

                <div>
                  <Skeleton className="h-6 w-1/4 mb-2" />
                  <div className="space-y-2">
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/50"
                        >
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex-grow">
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-4 w-1/2 mt-1" />
                          </div>
                          <Skeleton className="h-6 w-16" />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// 체크 아이콘 컴포넌트
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// 가입 승인 다이얼로그
interface ApproveJoinRequestDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onApprove: () => Promise<void>;
  username: string;
}

function ApproveJoinRequestDialog({
  open,
  setOpen,
  onApprove,
  username,
}: ApproveJoinRequestDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onApprove();
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>가입 승인</DialogTitle>
          <DialogDescription>
            '{username}' 사용자의 가입 요청을 승인하시겠습니까?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                처리 중...
              </>
            ) : (
              '승인하기'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 가입 거절 다이얼로그
interface RejectJoinRequestDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onReject: () => Promise<void>;
  username: string;
}

function RejectJoinRequestDialog({
  open,
  setOpen,
  onReject,
  username,
}: RejectJoinRequestDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      await onReject();
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>가입 거절</DialogTitle>
          <DialogDescription>
            '{username}' 사용자의 가입 요청을 거절하시겠습니까? 이 작업은
            되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                처리 중...
              </>
            ) : (
              '거절하기'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
