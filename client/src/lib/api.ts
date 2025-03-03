import axios from 'axios';

// 기본 API 클라이언트 설정
export const api = axios.create({
  baseURL: 'https://pylon-app.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 인증 오류 (401) 처리
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // 로그인 페이지로 리다이렉트 등의 처리가 필요할 수 있음
    }
    return Promise.reject(error);
  }
);

// 토큰 관련 유틸리티 함수
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
