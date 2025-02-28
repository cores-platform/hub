import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://pylon-app.com/api/user/login', { email, password });
      // JWT 토큰을 localStorage에 저장 (필요에 따라 상태관리 라이브러리 사용 가능)
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800">
      <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">로그인</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-white mb-2">이메일</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-white mb-2">비밀번호</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full">로그인</button>
        <p className="text-center text-slate-400 mt-4">
          계정이 없으신가요? <a href="/register" className="text-indigo-500 hover:text-indigo-400">회원가입</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage; 