import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('https://pylon-app.com/api/user/register', {
        username,
        email,
        password,
        firstName,
        lastName,
      });
      // 회원가입 성공 시 로그인 페이지로 이동
      navigate('/login');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800">
      <form onSubmit={handleRegister} className="bg-slate-900 p-8 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">회원가입</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-white mb-2">사용자 이름</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
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
        <div className="mb-4">
          <label className="block text-white mb-2">비밀번호</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">이름</label>
          <input 
            type="text" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="예: 홍"
            className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-white mb-2">성</label>
          <input 
            type="text" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="예: 길동"
            className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button type="submit" className="btn-primary w-full">회원가입</button>
        <p className="text-center text-slate-400 mt-4">
          이미 계정이 있으신가요? <a href="/login" className="text-indigo-500 hover:text-indigo-400">로그인</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage; 