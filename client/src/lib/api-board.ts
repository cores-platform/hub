import { api } from './api';

export interface Board {
  _id: string;
  name: string;
  description: string;
  club: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardsResponse {
  boards: Board[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface BoardResponse {
  board: Board;
}

// 동아리 내 모든 게시판 조회
export const getClubBoards = async (
  clubId: string,
  params?: {
    page?: number;
    limit?: number;
  }
): Promise<BoardsResponse> => {
  const response = await api.get<BoardsResponse>(
    `/clubs/${clubId}/boards`,
    {
      params,
    }
  );
  return response.data;
};

// 특정 게시판 조회
export const getBoardById = async (
  clubId: string,
  boardId: string
): Promise<BoardResponse> => {
  const response = await api.get<BoardResponse>(
    `/clubs/${clubId}/boards/${boardId}`
  );
  return response.data;
};

// 게시판 생성 (관리자 또는 소유자만 가능)
export const createBoard = async (
  clubId: string,
  boardData: {
    name: string;
    description: string;
  }
): Promise<BoardResponse> => {
  const response = await api.post<BoardResponse>(
    `/clubs/${clubId}/boards`,
    boardData
  );
  return response.data;
};

// 게시판 수정 (관리자 또는 소유자만 가능)
export const updateBoard = async (
  clubId: string,
  boardId: string,
  boardData: {
    name?: string;
    description?: string;
    isActive?: boolean;
  }
): Promise<BoardResponse> => {
  const response = await api.put<BoardResponse>(
    `/clubs/${clubId}/boards/${boardId}`,
    boardData
  );
  return response.data;
};

// 게시판 삭제 (관리자 또는 소유자만 가능)
export const deleteBoard = async (
  clubId: string,
  boardId: string
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `/clubs/${clubId}/boards/${boardId}`
  );
  return response.data;
};
