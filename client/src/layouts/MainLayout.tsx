import { Outlet } from 'react-router-dom';

// 모든 레이아웃의 공통 래퍼 컴포넌트
const MainLayout = () => {
  return (
    <div className='bg-app text-app border-app h-screen'>
      {/* 여기에 헤더, 네비게이션 등을 추가할 수 있습니다 */}
      <main>
        <Outlet />
      </main>
      {/* 여기에 푸터를 추가할 수 있습니다 */}
    </div>
  );
};

export default MainLayout;
