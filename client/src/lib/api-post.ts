import { api } from './api';

// 게시글 인터페이스
export interface Post {
  _id: string;
  title: string;
  content: string;
  author: string | { _id: string; username: string };
  board: string | { _id: string; name: string };
  club: string;
  isActive: boolean;
  type: 'notice' | 'general' | 'event';
  likes: string[];
  comments: {
    user: string | { _id: string; username: string };
    content: string;
    createdAt: string;
  }[];
  attachments: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

// 응답 인터페이스
export interface PostsResponse {
  posts: Post[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PostResponse {
  post: Post;
  message?: string;
}

// 게시글 목록 조회
export const getPosts = async (
  clubId: string,
  boardId: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
  }
): Promise<PostsResponse> => {
  const response = await api.get<PostsResponse>(
    `/clubs/${clubId}/boards/${boardId}/posts`,
    { params }
  );
  return response.data;
};

// 특정 게시글 조회
export const getPostById = async (
  clubId: string,
  boardId: string,
  postId: string
): Promise<PostResponse> => {
  const response = await api.get<PostResponse>(
    `/clubs/${clubId}/boards/${boardId}/posts/${postId}`
  );
  return response.data;
};

// 게시글 생성
export const createPost = async (
  clubId: string,
  boardId: string,
  postData: {
    title: string;
    content: string;
    attachments?: string[];
  }
): Promise<PostResponse> => {
  const response = await api.post<PostResponse>(
    `/clubs/${clubId}/boards/${boardId}/posts`,
    postData
  );
  return response.data;
};

// 게시글 수정
export const updatePost = async (
  clubId: string,
  boardId: string,
  postId: string,
  postData: {
    title?: string;
    content?: string;
    attachments?: string[];
  }
): Promise<PostResponse> => {
  const response = await api.put<PostResponse>(
    `/clubs/${clubId}/boards/${boardId}/posts/${postId}`,
    postData
  );
  return response.data;
};

// 게시글 삭제
export const deletePost = async (
  clubId: string,
  boardId: string,
  postId: string
): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `/clubs/${clubId}/boards/${boardId}/posts/${postId}`
  );
  return response.data;
};