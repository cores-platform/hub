import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useClubStore } from '@/store/clubStore';
import { useAuthStore } from '@/store/authStore';
import { ClubMemberRole } from '@/lib/api-club';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  RefreshCw,
  Settings,
  Users,
  UserPlus,
  UserMinus,
  Shield,
  ShieldOff,
  Trash2,
  Edit,
  Save,
  Star,
  Lock,
  Unlock,
} from '@/components/icons';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// 동아리 정보 수정 폼 스키마
const clubFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: '이름은 최소 2자 이상이어야 합니다.' })
    .max(50, { message: '이름은 최대 50자까지 가능합니다.' }),
  description: z
    .string()
    .min(10, { message: '설명은 최소 10자 이상이어야 합니다.' })
    .max(500, { message: '설명은 최대 500자까지 가능합니다.' }),
  category: z.string({
    required_error: '카테고리를 선택해주세요.',
  }),
  imageUrl: z.string().optional(),
  isPrivate: z.boolean().default(false),
});

type ClubFormValues = z.infer<typeof clubFormSchema>;

export default function ClubManagementPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('members');
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const {
    currentClub,
    isLoading,
    error,
    fetchClubById,
    updateClub,
    transferOwnership,
    deleteClub,
    approveJoinRequest,
    rejectJoinRequest,
    kickMember,
    promoteToAdmin,
    demoteFromAdmin,
  } = useClubStore();

  // 권한 체크
  const isOwner = user && currentClub?.owner._id === user._id;
  const isAdmin =
    user &&
    currentClub?.admins?.some((admin) => admin.user._id === user._id);
  const canManage = isOwner || isAdmin;

  const form = useForm<ClubFormValues>({
    resolver: zodResolver(clubFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      imageUrl: '',
      isPrivate: false,
    },
  });

  // 페이지 로드 시 동아리 정보 가져오기
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (clubId) {
      fetchClubById(clubId).catch(() => {
        toast.error('동아리 정보를 불러오는데 실패했습니다.');
      });
    } else {
      navigate('/clubs');
    }
  }, [clubId, isAuthenticated, navigate, fetchClubById]);

  // 동아리 정보를 폼에 설정
  useEffect(() => {
    if (currentClub) {
      form.reset({
        name: currentClub.name,
        description: currentClub.description,
        category: currentClub.category,
        imageUrl: currentClub.imageUrl || '',
        isPrivate: currentClub.isPrivate,
      });
    }
  }, [currentClub, form]);

  // 권한 확인 후 페이지 접근 제한
  useEffect(() => {
    if (currentClub && !canManage) {
      toast.error('동아리 관리 권한이 없습니다.');
      navigate(`/clubs/${clubId}`);
    }
  }, [currentClub, canManage, navigate, clubId]);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '날짜정보 없음';
    return format(date, 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
  };

  // 역할 이름 변환
  const getRoleName = (role: string) => {
    switch (role) {
      case ClubMemberRole.OWNER:
        return '소유자';
      case ClubMemberRole.ADMIN:
        return '관리자';
      case ClubMemberRole.MEMBER:
        return '멤버';
      case ClubMemberRole.PENDING:
        return '대기 중';
      default:
        return '';
    }
  };

  // 동아리 정보 업데이트
  const onSubmit = async (data: ClubFormValues) => {
    if (!clubId) return;

    try {
      await updateClub(clubId, data);
      toast.success('동아리 정보가 업데이트되었습니다.');
      setIsEditMode(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          '동아리 정보 업데이트에 실패했습니다.'
      );
    }
  };

  // 소유권 이전
  const handleTransferOwnership = async () => {
    if (!clubId || !selectedUserId) return;

    try {
      await transferOwnership(clubId, selectedUserId);
      toast.success('동아리 소유권이 이전되었습니다.');
      setTransferDialogOpen(false);
      setSelectedUserId('');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || '소유권 이전에 실패했습니다.'
      );
    }
  };

  // 동아리 삭제
  const handleDeleteClub = async () => {
    if (!clubId) return;

    try {
      await deleteClub(clubId);
      toast.success('동아리가 삭제되었습니다.');
      navigate('/my-clubs');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || '동아리 삭제에 실패했습니다.'
      );
    }
  };

  // 가입 신청 승인
  const handleApproveJoinRequest = async (userId: string) => {
    if (!clubId) return;

    try {
      await approveJoinRequest(clubId, userId);
      toast.success('가입 신청이 승인되었습니다.');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || '가입 승인에 실패했습니다.'
      );
    }
  };

  // 가입 신청 거부
  const handleRejectJoinRequest = async (userId: string) => {
    if (!clubId) return;

    try {
      await rejectJoinRequest(clubId, userId);
      toast.success('가입 신청이 거부되었습니다.');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || '가입 거부에 실패했습니다.'
      );
    }
  };

  // 회원 추방
  const handleKickMember = async (userId: string) => {
    if (!clubId) return;

    try {
      await kickMember(clubId, userId);
      toast.success('회원이 추방되었습니다.');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || '회원 추방에 실패했습니다.'
      );
    }
  };

  // 관리자로 승격
  const handlePromoteToAdmin = async (userId: string) => {
    if (!clubId) return;

    try {
      await promoteToAdmin(clubId, userId);
      toast.success('관리자로 승격되었습니다.');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || '관리자 승격에 실패했습니다.'
      );
    }
  };

  // 관리자 권한 해제
  const handleDemoteFromAdmin = async (userId: string) => {
    if (!clubId) return;

    try {
      await demoteFromAdmin(clubId, userId);
      toast.success('관리자 권한이 해제되었습니다.');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || '관리자 권한 해제에 실패했습니다.'
      );
    }
  };

  // 로딩 중 UI
  if (isLoading && !currentClub) {
    return <ClubManagementSkeleton />;
  }

  // 오류 발생 시 UI
  if (error && !currentClub) {
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
              onClick={() => clubId && fetchClubById(clubId)}
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

  // 동아리가 없는 경우
  if (!currentClub) {
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">동아리 관리</h1>
          <p className="text-muted-foreground mt-1">
            {currentClub.name} 동아리 관리 페이지
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(`/clubs/${clubId}`)}
        >
          동아리로 돌아가기
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="members">회원 목록</TabsTrigger>
          <TabsTrigger value="pending">가입 대기</TabsTrigger>
          <TabsTrigger
            value="settings"
            disabled={!isOwner}
          >
            동아리 설정
          </TabsTrigger>
          <TabsTrigger
            value="danger"
            disabled={!isOwner}
          >
            위험 설정
          </TabsTrigger>
        </TabsList>

        {/* 회원 관리 탭 */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                회원 목록
              </CardTitle>
              <CardDescription>
                총{' '}
                {currentClub.allMembers.length -
                  currentClub.pendingMembers!.length +
                  1}
                명의 회원이 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>역할</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentClub.owner && (
                    <TableRow>
                      <TableCell className="font-medium">
                        {currentClub.owner.username}
                      </TableCell>
                      <TableCell className="flex items-center">
                        <Star className="mr-1 h-4 w-4 text-yellow-500" />
                        소유자
                      </TableCell>
                    </TableRow>
                  )}
                  {currentClub.allMembers.map((member) => {
                    const userId = member.user._id;
                    const userName = member.user.username;
                    const role = member.role;

                    if (member.role === ClubMemberRole.PENDING) {
                      return null;
                    }

                    return (
                      <TableRow key={userId}>
                        <TableCell className="font-medium">
                          {userName}
                        </TableCell>
                        <TableCell>{getRoleName(role)}</TableCell>
                        <TableCell>{formatDate(member.joinedAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {isOwner && (
                              <>
                                {member.role === ClubMemberRole.MEMBER ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handlePromoteToAdmin(userId)
                                    }
                                  >
                                    <Shield className="mr-1 h-4 w-4" />
                                    관리자로
                                  </Button>
                                ) : (
                                  member.role === ClubMemberRole.ADMIN && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleDemoteFromAdmin(userId)
                                      }
                                    >
                                      <ShieldOff className="mr-1 h-4 w-4" />
                                      관리자 해제
                                    </Button>
                                  )
                                )}
                                <Dialog
                                  open={
                                    transferDialogOpen &&
                                    selectedUserId === userId
                                  }
                                  onOpenChange={(open) => {
                                    setTransferDialogOpen(open);
                                    if (!open) setSelectedUserId('');
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedUserId(userId);
                                        setTransferDialogOpen(true);
                                      }}
                                    >
                                      <Star className="mr-1 h-4 w-4" />
                                      소유자로
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        동아리 소유권 이전
                                      </DialogTitle>
                                      <DialogDescription>
                                        소유권을 {userName}님에게
                                        이전하시겠습니까? 이 작업은 되돌릴
                                        수 없으며, 현재 소유자는 관리자
                                        권한을 갖게 됩니다.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setTransferDialogOpen(false);
                                          setSelectedUserId('');
                                        }}
                                      >
                                        취소
                                      </Button>
                                      <Button
                                        onClick={handleTransferOwnership}
                                      >
                                        확인
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </>
                            )}
                            {(isOwner || isAdmin) && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                  >
                                    <UserMinus className="mr-1 h-4 w-4" />
                                    추방
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      회원 추방
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {userName}님을 동아리에서
                                      추방하시겠습니까? 이 작업은 되돌릴 수
                                      없습니다.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      취소
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleKickMember(userId)
                                      }
                                    >
                                      추방
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 가입 대기 탭 */}
        <TabsContent value="pending">
          <div className="space-y-6">
            {currentClub.pendingMembers &&
            currentClub.pendingMembers.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserPlus className="mr-2 h-5 w-5" />
                    가입 대기 중인 회원
                  </CardTitle>
                  <CardDescription>
                    승인 또는 거부가 필요한 회원 목록입니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>이름</TableHead>
                        <TableHead>가입 신청일</TableHead>
                        <TableHead className="text-right">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentClub.pendingMembers!.map((member) => (
                        <TableRow key={member.toString()}>
                          <TableCell>{member.user.username}</TableCell>
                          <TableCell>
                            {formatDate(member.joinedAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleApproveJoinRequest(
                                    typeof member.user === 'string'
                                      ? member.user
                                      : member.user._id
                                  )
                                }
                              >
                                승인
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleRejectJoinRequest(
                                    typeof member.user === 'string'
                                      ? member.user
                                      : member.user._id
                                  )
                                }
                              >
                                거부
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <p>대기 중인 회원이 없습니다.</p>
            )}
          </div>
        </TabsContent>

        {/* 동아리 설정 탭 (소유자만) */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                동아리 설정
              </CardTitle>
              <CardDescription>
                동아리 기본 정보 설정입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditMode ? (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>동아리 이름</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>동아리 설명</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>카테고리</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="카테고리 선택" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="학술">학술</SelectItem>
                              <SelectItem value="스포츠">스포츠</SelectItem>
                              <SelectItem value="문화예술">
                                문화예술
                              </SelectItem>
                              <SelectItem value="봉사">봉사</SelectItem>
                              <SelectItem value="친목">친목</SelectItem>
                              <SelectItem value="기타">기타</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이미지 URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            동아리 대표 이미지 URL을 입력하세요 (선택 사항)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isPrivate"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>비공개 동아리</FormLabel>
                            <FormDescription>
                              관리자의 승인이 있어야 가입이 가능합니다
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditMode(false)}
                      >
                        취소
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        저장
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium">동아리 이름</h3>
                    <p className="mt-1">{currentClub.name}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium">동아리 설명</h3>
                    <p className="mt-1 whitespace-pre-line">
                      {currentClub.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium">카테고리</h3>
                    <p className="mt-1">{currentClub.category}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium">가입 방식</h3>
                    <div className="mt-1 flex items-center">
                      {currentClub.isPrivate ? (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          <span>비공개 (관리자 승인 필요)</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="mr-2 h-4 w-4" />
                          <span>공개 (바로 가입 가능)</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium">생성일</h3>
                    <p className="mt-1">
                      {formatDate(currentClub.createdAt)}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => setIsEditMode(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      정보 수정
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 위험 설정 (소유자만) */}
        <TabsContent value="danger">
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive flex items-center">
                <Trash2 className="mr-2 h-5 w-5" />
                위험 영역
              </CardTitle>
              <CardDescription>
                동아리 삭제와 같은 되돌릴 수 없는 작업입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    동아리 삭제
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>동아리 삭제</AlertDialogTitle>
                    <AlertDialogDescription>
                      정말로 <strong>{currentClub.name}</strong> 동아리를
                      삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든
                      회원 정보와 데이터가 영구적으로 삭제됩니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteClub}>
                      삭제
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ClubManagementSkeleton() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-5 w-72 mt-1" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <Skeleton className="h-10 w-64 mb-6" />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-5 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center"
                  >
                    <Skeleton className="h-6 w-32" />
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-20" />
                      <Skeleton className="h-9 w-20" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
