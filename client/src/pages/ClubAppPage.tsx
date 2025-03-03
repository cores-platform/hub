import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useClubStore } from '@/store/clubStore';
import { useAuthStore } from '@/store/authStore';
import { BoardSidebar } from '@/components/board/BoardSidebar';
import { BoardHeader } from '@/components/board/BoardHeader';

export default function ClubAppPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const { currentClub, fetchClubById } = useClubStore();
  const { user } = useAuthStore();

  // Check if user is a member of the club
  const isMember =
    user &&
    currentClub &&
    (currentClub.owner._id === user._id ||
      currentClub.admins?.some((admin) => admin.user._id === user._id) ||
      currentClub.members?.some((member) => member.user._id === user._id));

  useEffect(() => {
    if (clubId) {
      fetchClubById(clubId);
    }
  }, [clubId, fetchClubById]);

  useEffect(() => {
    if (currentClub && !isMember) {
      toast.error('동아리 멤버만 앱에 접근할 수 있습니다.');
      navigate(`/clubs/${clubId}`);
    }
  }, [currentClub, isMember, navigate, clubId]);

  if (!currentClub || !isMember) {
    // Loading or not a member
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 모바일 전용 헤더 */}
      <BoardHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* 데스크탑 전용 사이드바 */}
        <BoardSidebar />

        {/* 메인 콘텐츠 */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
