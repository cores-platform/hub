import { api } from './api';
import { User } from './api-auth';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  profileImage?: File;
}

export interface ProfileResponse {
  user: User;
}

// 클럽 인터페이스
export interface Club {
  _id: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  isPrivate: boolean;
  owner: {
    _id: string;
    username: string;
    email: string;
    profileImage?: string;
  };
  members: {
    user: string;
    role: 'owner' | 'admin' | 'member' | 'pending';
    joinedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ClubsResponse {
  clubs: Club[];
}

// 내 프로필 조회
export const getMyProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>('/user/profile');
  return response.data;
};

// 다른 사용자 프로필 조회 (필요할 경우 구현)
export const getUserProfile = async (
  userId: string
): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>(`/users/${userId}`);
  return response.data;
};

// 프로필 업데이트
export const updateProfile = async (
  data: UpdateProfileData
): Promise<ProfileResponse> => {
  // 텍스트와 파일이 함께 있을 경우 FormData 사용
  if (data.profileImage) {
    const formData = new FormData();

    if (data.firstName) formData.append('firstName', data.firstName);
    if (data.lastName) formData.append('lastName', data.lastName);
    formData.append('profileImage', data.profileImage);

    const response = await api.put<ProfileResponse>(
      '/user/profile',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } else {
    // 파일이 없는 경우 일반 JSON으로 요청
    const response = await api.put<ProfileResponse>('/user/profile', data);
    return response.data;
  }
};

// 사용자가 속한 모든 동아리 조회
export const getUserClubs = async (
  role?: string
): Promise<ClubsResponse> => {
  const query = role ? `?role=${role}` : '';
  const response = await api.get<ClubsResponse>(`/user/clubs${query}`);
  return response.data;
};

// 사용자가 관리하는 동아리 조회 (소유자 또는 관리자)
export const getUserManagedClubs = async (): Promise<ClubsResponse> => {
  const response = await api.get<ClubsResponse>('/user/owned-clubs');
  return response.data;
};
