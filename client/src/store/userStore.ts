import { create } from 'zustand';
import {
  getMyProfile as apiGetMyProfile,
  getUserProfile as apiGetUserProfile,
  updateProfile as apiUpdateProfile,
  UpdateProfileData,
} from '../lib/api-user';
import { User } from '../lib/api-auth';

interface UserState {
  currentUser: User | null;
  viewedUser: User | null;
  isLoading: boolean;
  error: string | null;
  fetchMyProfile: () => Promise<void>;
  fetchUserProfile: (userId: string) => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  viewedUser: null,
  isLoading: false,
  error: null,

  fetchMyProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await apiGetMyProfile();
      set({ currentUser: data.user, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '프로필 조회 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  fetchUserProfile: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const data = await apiGetUserProfile(userId);
      set({ viewedUser: data.user, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '사용자 프로필 조회 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  updateProfile: async (data: UpdateProfileData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiUpdateProfile(data);
      set({ currentUser: response.user, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '프로필 업데이트 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
