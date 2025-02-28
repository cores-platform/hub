import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainLayout from './layouts/MainLayout';
import HomeLayout from './layouts/HomeLayout';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className='dark'>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          {/* 홈 관련 라우트 */}
          <Route element={<HomeLayout />}>
            <Route index element={<HomePage />} />
            {/* 홈 레이아웃을 사용하는 다른 페이지들 */}
          </Route>

          {/* 인증 관련 라우트 */}
          <Route path='login' element={<LoginPage />} />
          <Route path='register' element={<RegisterPage />} />

          {/* 앱 관련 라우트 */}
          <Route path='app' element={<AppLayout />}>
            <Route path='dashboard' element={<div>대시보드 페이지</div>} />
            <Route path='profile' element={<div>프로필 페이지</div>} />
            {/* 앱 레이아웃을 사용하는 다른 페이지들 */}
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
