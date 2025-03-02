import { api } from './api';
import { User } from './api-auth';

export interface Club {
  _id: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  owner: User;
  allMembers: ClubMember[];
  members: ClubMember[];
  isActive: boolean;
  isPrivate: boolean;
  memberCount?: number;
  userMembershipStatus?: string;
  admins?: ClubMember[];
  pendingMembers?: ClubMember[];
  createdAt: string;
  updatedAt: string;
}

export enum ClubMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  PENDING = 'pending',
}

export interface ClubMember {
  user: User;
  role: ClubMemberRole;
  joinedAt: string;
}

export interface ClubsResponse {
  clubs: Club[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ClubResponse {
  club: Club;
}

export interface ClubMembershipResponse {
  message: string;
  role?: string;
}

// 모든 동아리 조회
export const getAllClubs = async (params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ClubsResponse> => {
  const response = await api.get<ClubsResponse>('/clubs', { params });
  return response.data;
};

// 특정 동아리 조회
export const getClubById = async (
  clubId: string
): Promise<ClubResponse> => {
  const response = await api.get<ClubResponse>(`/clubs/${clubId}`);
  return response.data;
};

// 동아리 가입 신청
export const joinClub = async (
  clubId: string
): Promise<ClubMembershipResponse> => {
  const response = await api.post<ClubMembershipResponse>(
    `/clubs/${clubId}/join`
  );
  return response.data;
};

// 동아리 탈퇴
export const leaveClub = async (
  clubId: string
): Promise<ClubMembershipResponse> => {
  const response = await api.post<ClubMembershipResponse>(
    `/clubs/${clubId}/leave`
  );
  return response.data;
};

// ---------------- 동아리 관리 API 함수 ----------------

// 동아리 정보 업데이트 (소유자)
export const updateClub = async (
  clubId: string,
  data: {
    name?: string;
    description?: string;
    category?: string;
    imageUrl?: string;
    isPrivate?: boolean;
  }
): Promise<ClubResponse> => {
  const response = await api.put<ClubResponse>(`/clubs/${clubId}`, data);
  return response.data;
};

// 동아리 소유권 이전 (소유자)
export const transferOwnership = async (
  clubId: string,
  userId: string
): Promise<ClubResponse> => {
  const response = await api.post<ClubResponse>(
    `/clubs/${clubId}/transfer-ownership`,
    { userId }
  );
  return response.data;
};

// 동아리 삭제 (소유자)
export const deleteClub = async (
  clubId: string
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `/clubs/${clubId}`
  );
  return response.data;
};

// 가입 신청 승인 (관리자/소유자)
export const approveJoinRequest = async (
  clubId: string,
  userId: string
): Promise<{ message: string; member: ClubMember }> => {
  const response = await api.post<{ message: string; member: ClubMember }>(
    `/clubs/${clubId}/approve`,
    { userId }
  );
  return response.data;
};

// 가입 신청 거부 (관리자/소유자)
export const rejectJoinRequest = async (
  clubId: string,
  userId: string
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(
    `/clubs/${clubId}/reject`,
    { userId }
  );
  return response.data;
};

// 회원 추방 (관리자/소유자)
export const kickMember = async (
  clubId: string,
  userId: string
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(
    `/clubs/${clubId}/kick`,
    { userId }
  );
  return response.data;
};

// 회원을 관리자로 승격 (소유자)
export const promoteToAdmin = async (
  clubId: string,
  userId: string
): Promise<{ message: string; member: ClubMember }> => {
  const response = await api.post<{ message: string; member: ClubMember }>(
    `/clubs/${clubId}/promote`,
    { userId }
  );
  return response.data;
};

// 관리자를 일반 회원으로 강등 (소유자)
export const demoteFromAdmin = async (
  clubId: string,
  userId: string
): Promise<{ message: string; member: ClubMember }> => {
  const response = await api.post<{ message: string; member: ClubMember }>(
    `/clubs/${clubId}/demote`,
    { userId }
  );
  return response.data;
};
