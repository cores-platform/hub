import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useClubStore } from '@/store/clubStore';
import { useAuthStore } from '@/store/authStore';
import { BoardSidebar } from '@/components/board/BoardSidebar';

export default function ClubAppPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const { currentClub, fetchClubById } = useClubStore();
  const { user, isAuthenticated } = useAuthStore();

  // Check if user is a member of the club
  const isMember =
    currentClub &&
    user &&
    // Is owner
    ((typeof currentClub.owner === 'object' &&
      currentClub.owner._id === user._id) ||
      // Is admin
      (Array.isArray(currentClub.admins) &&
        currentClub.admins.some(
          (admin) =>
            typeof admin.user === 'object' && admin.user._id === user._id
        )) ||
      // Is regular member
      (Array.isArray(currentClub.members) &&
        currentClub.members.some(
          (member) =>
            typeof member.user === 'object' && member.user._id === user._id
        )));

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!clubId) {
      navigate('/clubs');
      return;
    }

    fetchClubById(clubId).catch(() => {
      toast.error('동아리 정보를 불러오는데 실패했습니다.');
    });
  }, [clubId, navigate, fetchClubById, isAuthenticated]);

  // Redirect non-members back to club detail page
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
    <div className="flex h-screen">
      <BoardSidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
