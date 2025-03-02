import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera, Save, User } from '@/components/icons';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';

// 프로필 수정 스키마
const profileSchema = z.object({
  firstName: z.string().min(1, '이름을 입력해주세요.'),
  lastName: z.string().min(1, '성을 입력해주세요.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(
    null
  );
  const [profileImagePreview, setProfileImagePreview] = useState<
    string | null
  >(null);

  // 개별 선택자를 사용하여 무한 루프 방지
  const currentUser = useUserStore((state) => state.currentUser);
  const fetchMyProfile = useUserStore((state) => state.fetchMyProfile);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const isLoading = useUserStore((state) => state.isLoading);
  const error = useUserStore((state) => state.error);

  // 로그인 여부 확인
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 폼 초기화
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
    },
  });

  // 사용자 정보 로드
  useEffect(() => {
    if (isAuthenticated) {
      fetchMyProfile();
    } else {
      // 로그인되지 않은 상태면 로그인 페이지로 리다이렉트
      navigate('/login');
    }
  }, [isAuthenticated, fetchMyProfile, navigate]);

  // 사용자 정보가 로드되면 폼 값 업데이트
  useEffect(() => {
    if (currentUser) {
      form.reset({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
      });

      // 프로필 이미지가 있으면 미리보기로 설정
      if (currentUser.profileImage) {
        setProfileImagePreview(currentUser.profileImage);
      }
    }
  }, [currentUser, form]);

  // 이미지 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);

      // 미리보기 URL 생성
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
    }
  };

  // 폼 제출 핸들러
  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        profileImage: profileImageFile || undefined,
      });

      toast.success('프로필이 성공적으로 업데이트되었습니다.');
      navigate('/profile');
    } catch (error: any) {
      toast.error(
        error.message ||
          '프로필 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    }
  };

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

  // 로딩 중 UI
  if (isLoading && !currentUser) {
    return <ProfileEditSkeleton />;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            프로필 수정
          </CardTitle>
          <CardDescription className="text-center">
            개인 정보를 업데이트하세요.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* 프로필 이미지 업로드 */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24">
                    {profileImagePreview ? (
                      <AvatarImage
                        src={profileImagePreview}
                        alt="프로필 미리보기"
                      />
                    ) : currentUser?.profileImage ? (
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

                  <label
                    htmlFor="profile-image"
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </label>

                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  이미지를 클릭하여 프로필 사진을 변경하세요
                </p>
              </div>

              <Separator />

              {/* 이름 입력 필드 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="이름"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>성</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="성"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 사용자명 (읽기 전용) */}
              <div className="space-y-2">
                <FormLabel>사용자명</FormLabel>
                <div className="flex items-center rounded-md border border-input px-3 py-2 text-sm">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    @{currentUser?.username}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  사용자명은 변경할 수 없습니다.
                </p>
              </div>

              {/* 이메일 (읽기 전용) */}
              <div className="space-y-2">
                <FormLabel>이메일</FormLabel>
                <Input
                  value={currentUser?.email}
                  disabled
                  className="bg-muted text-muted-foreground"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/profile')}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    '저장 중...'
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> 변경사항 저장
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// 프로필 수정 스켈레톤 UI
function ProfileEditSkeleton() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex flex-col items-center space-y-2">
            <Skeleton className="h-8 w-40 mx-auto" />
            <Skeleton className="h-4 w-60 mx-auto" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="flex justify-end space-x-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
