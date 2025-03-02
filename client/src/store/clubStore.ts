import { create } from 'zustand';
import {
  getAllClubs as apiGetAllClubs,
  getClubById as apiGetClubById,
  joinClub as apiJoinClub,
  leaveClub as apiLeaveClub,
  Club,
  updateClub as apiUpdateClub,
  transferOwnership as apiTransferOwnership,
  deleteClub as apiDeleteClub,
  approveJoinRequest as apiApproveJoinRequest,
  rejectJoinRequest as apiRejectJoinRequest,
  kickMember as apiKickMember,
  promoteToAdmin as apiPromoteToAdmin,
  demoteFromAdmin as apiDemoteFromAdmin,
} from '../lib/api-club';

interface ClubState {
  clubs: Club[];
  currentClub: Club | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  isLoading: boolean;
  error: string | null;
  fetchClubs: (params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  fetchClubById: (clubId: string) => Promise<void>;
  joinClub: (clubId: string) => Promise<void>;
  leaveClub: (clubId: string) => Promise<void>;
  clearError: () => void;
  updateClub: (
    clubId: string,
    data: {
      name?: string;
      description?: string;
      category?: string;
      imageUrl?: string;
      isPrivate?: boolean;
    }
  ) => Promise<void>;
  transferOwnership: (clubId: string, userId: string) => Promise<void>;
  deleteClub: (clubId: string) => Promise<void>;
  approveJoinRequest: (clubId: string, userId: string) => Promise<void>;
  rejectJoinRequest: (clubId: string, userId: string) => Promise<void>;
  kickMember: (clubId: string, userId: string) => Promise<void>;
  promoteToAdmin: (clubId: string, userId: string) => Promise<void>;
  demoteFromAdmin: (clubId: string, userId: string) => Promise<void>;
}

export const useClubStore = create<ClubState>((set) => ({
  clubs: [],
  currentClub: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  isLoading: false,
  error: null,

  fetchClubs: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiGetAllClubs(params);
      set({
        clubs: response.clubs,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '동아리 목록 조회 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  fetchClubById: async (clubId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiGetClubById(clubId);
      set({ currentClub: response.club, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '동아리 정보 조회 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  joinClub: async (clubId: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiJoinClub(clubId);

      // 성공 후 동아리 정보 다시 가져오기
      const response = await apiGetClubById(clubId);
      set({ currentClub: response.club, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '동아리 가입 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  leaveClub: async (clubId: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiLeaveClub(clubId);

      // 성공 후 동아리 정보 다시 가져오기
      const response = await apiGetClubById(clubId);
      set({ currentClub: response.club, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '동아리 탈퇴 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  updateClub: async (clubId: string, data) => {
    try {
      set({ isLoading: true, error: null });
      await apiUpdateClub(clubId, data);

      // 성공 후 동아리 정보 다시 가져오기
      const response = await apiGetClubById(clubId);
      set({ currentClub: response.club, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '동아리 정보 업데이트 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  transferOwnership: async (clubId: string, userId: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiTransferOwnership(clubId, userId);

      // 성공 후 동아리 정보 다시 가져오기
      const response = await apiGetClubById(clubId);
      set({ currentClub: response.club, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '동아리 소유권 이전 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  deleteClub: async (clubId: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiDeleteClub(clubId);
      set({ currentClub: null, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '동아리 삭제 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  approveJoinRequest: async (clubId: string, userId: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiApproveJoinRequest(clubId, userId);

      // 성공 후 동아리 정보 다시 가져오기
      const response = await apiGetClubById(clubId);
      set({ currentClub: response.club, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '가입 신청 승인 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  rejectJoinRequest: async (clubId: string, userId: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiRejectJoinRequest(clubId, userId);

      // 성공 후 동아리 정보 다시 가져오기
      const response = await apiGetClubById(clubId);
      set({ currentClub: response.club, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '가입 신청 거부 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  kickMember: async (clubId: string, userId: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiKickMember(clubId, userId);

      // 성공 후 동아리 정보 다시 가져오기
      const response = await apiGetClubById(clubId);
      set({ currentClub: response.club, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '회원 추방 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  promoteToAdmin: async (clubId: string, userId: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiPromoteToAdmin(clubId, userId);

      // 성공 후 동아리 정보 다시 가져오기
      const response = await apiGetClubById(clubId);
      set({ currentClub: response.club, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '관리자 임명 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  demoteFromAdmin: async (clubId: string, userId: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiDemoteFromAdmin(clubId, userId);

      // 성공 후 동아리 정보 다시 가져오기
      const response = await apiGetClubById(clubId);
      set({ currentClub: response.club, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '관리자 해임 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },
}));
