import { create } from 'zustand';
import {
  getPosts as apiGetPosts,
  getPostById as apiGetPostById,
  createPost as apiCreatePost,
  updatePost as apiUpdatePost,
  deletePost as apiDeletePost,
  Post,
  PostsResponse
} from '../lib/api-post';

interface PostState {
  // 상태 변수
  posts: Post[];
  currentPost: Post | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  
  // 메서드
  fetchPosts: (
    clubId: string,
    boardId: string,
    params?: { page?: number; limit?: number; search?: string }
  ) => Promise<PostsResponse>;
  
  fetchPostById: (
    clubId: string,
    boardId: string,
    postId: string
  ) => Promise<Post>;
  
  createPost: (
    clubId: string,
    boardId: string,
    postData: { title: string; content: string; attachments?: string[] }
  ) => Promise<Post>;
  
  updatePost: (
    clubId: string,
    boardId: string,
    postId: string,
    postData: { title?: string; content?: string; attachments?: string[] }
  ) => Promise<Post>;
  
  deletePost: (
    clubId: string,
    boardId: string,
    postId: string
  ) => Promise<void>;
  
  clearError: () => void;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  currentPost: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchPosts: async (clubId, boardId, params) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiGetPosts(clubId, boardId, params);
      set({
        posts: response.posts,
        pagination: response.pagination || null,
        isLoading: false,
      });
      return response;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || '게시글 목록 조회 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  fetchPostById: async (clubId, boardId, postId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiGetPostById(clubId, boardId, postId);
      set({ currentPost: response.post, isLoading: false });
      return response.post;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || '게시글 조회 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  createPost: async (clubId, boardId, postData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiCreatePost(clubId, boardId, postData);
      
      // 게시글 목록에 새 게시글 추가
      set((state) => ({
        posts: [response.post, ...state.posts],
        isLoading: false,
      }));
      
      return response.post;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || '게시글 생성 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  updatePost: async (clubId, boardId, postId, postData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiUpdatePost(clubId, boardId, postId, postData);
      
      // 현재 게시글이 수정된 게시글이면 업데이트
      if (get().currentPost?._id === postId) {
        set({ currentPost: response.post });
      }
      
      // 게시글 목록 업데이트
      const posts = get().posts.map((post) =>
        post._id === postId ? response.post : post
      );
      
      set({ posts, isLoading: false });
      return response.post;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || '게시글 수정 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  deletePost: async (clubId, boardId, postId) => {
    try {
      set({ isLoading: true, error: null });
      await apiDeletePost(clubId, boardId, postId);
      
      // 삭제된 게시글을 목록에서 제거
      const posts = get().posts.filter((post) => post._id !== postId);
      
      set({
        posts,
        currentPost: get().currentPost?._id === postId ? null : get().currentPost,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || '게시글 삭제 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));