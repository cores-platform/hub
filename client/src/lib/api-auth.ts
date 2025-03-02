import {
  api,
  setToken,
  removeToken,
  isAuthenticated as checkToken,
} from './api';

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

// 로그인
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/user/login', credentials);
  if (response.data.token) {
    setToken(response.data.token);
  }
  return response.data;
};

// 회원가입
export const register = async (
  credentials: RegisterCredentials
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    '/user/register',
    credentials
  );
  if (response.data.token) {
    setToken(response.data.token);
  }
  return response.data;
};

// 로그아웃
export const logout = (): void => {
  removeToken();
};

// 비밀번호 변경
export const changePassword = async (
  data: PasswordChangeData
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(
    '/user/change-password',
    data
  );
  return response.data;
};

// 현재 인증 상태 확인
export const isAuthenticated = (): boolean => {
  return checkToken();
};
