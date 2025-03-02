import { create } from 'zustand';
import {
  getClubBoards as apiGetClubBoards,
  getBoardById as apiGetBoardById,
  createBoard as apiCreateBoard,
  updateBoard as apiUpdateBoard,
  deleteBoard as apiDeleteBoard,
  Board,
} from '../lib/api-board';

interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  fetchClubBoards: (
    clubId: string,
    params?: { page?: number; limit?: number }
  ) => Promise<void>;
  fetchBoardById: (clubId: string, boardId: string) => Promise<void>;
  createBoard: (
    clubId: string,
    boardData: { name: string; description: string }
  ) => Promise<Board>;
  updateBoard: (
    clubId: string,
    boardId: string,
    boardData: { name?: string; description?: string; isActive?: boolean }
  ) => Promise<Board>;
  deleteBoard: (clubId: string, boardId: string) => Promise<void>;
  clearError: () => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: [],
  currentBoard: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchClubBoards: async (clubId, params) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiGetClubBoards(clubId, params);
      set({
        boards: response.boards,
        pagination: response.pagination || null,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '게시판 목록 조회 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  fetchBoardById: async (clubId: string, boardId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiGetBoardById(clubId, boardId);
      set({ currentBoard: response.board, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '게시판 조회 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  createBoard: async (clubId: string, boardData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiCreateBoard(clubId, boardData);

      // 게시판 목록에 새 게시판 추가
      const boards = [...get().boards, response.board];
      set({ boards, isLoading: false });

      return response.board;
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '게시판 생성 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  updateBoard: async (clubId: string, boardId: string, boardData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiUpdateBoard(clubId, boardId, boardData);

      // 현재 게시판이 수정된 게시판이면 업데이트
      if (get().currentBoard?._id === boardId) {
        set({ currentBoard: response.board });
      }

      // 게시판 목록 업데이트
      const boards = get().boards.map((board) =>
        board._id === boardId ? response.board : board
      );

      set({ boards, isLoading: false });
      return response.board;
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '게시판 수정 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  deleteBoard: async (clubId: string, boardId: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiDeleteBoard(clubId, boardId);

      // 삭제된 게시판을 목록에서 제거
      const boards = get().boards.filter((board) => board._id !== boardId);

      set({
        boards,
        currentBoard:
          get().currentBoard?._id === boardId ? null : get().currentBoard,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          '게시판 삭제 중 오류가 발생했습니다.',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
