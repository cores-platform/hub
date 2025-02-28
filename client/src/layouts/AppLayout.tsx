import { Outlet } from 'react-router-dom';
import { useState } from 'react';

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className='flex h-screen bg-slate-900'>
      {/* 사이드바 */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 border-r border-slate-700 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out md:relative md:flex`}
      >
        <div className='flex flex-col h-full'>
          {/* 로고 */}
          <div className='flex items-center p-4 border-b border-slate-700'>
            <div className='h-8 w-8 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 mr-2'></div>
            <span className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500'>
              동아리 관리
            </span>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className='flex-1 overflow-y-auto py-4'>
            <ul className='space-y-1 px-2'>
              <li>
                <a
                  href='#'
                  className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 rounded-md transition-colors'
                >
                  대시보드
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 rounded-md transition-colors'
                >
                  내 동아리
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 rounded-md transition-colors'
                >
                  일정 관리
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 rounded-md transition-colors'
                >
                  공지사항
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 rounded-md transition-colors'
                >
                  회원 관리
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 rounded-md transition-colors'
                >
                  설정
                </a>
              </li>
            </ul>
          </nav>

          {/* 프로필 */}
          <div className='p-4 border-t border-slate-700'>
            <div className='flex items-center'>
              <div className='h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold'>
                JD
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-white'>홍길동</p>
                <p className='text-xs text-slate-400'>관리자</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* 헤더 */}
        <header className='bg-slate-800 border-b border-slate-700 shadow-sm'>
          <div className='flex items-center justify-between p-4'>
            <button
              className='md:hidden text-slate-300 hover:text-white'
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                {isSidebarOpen ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </button>
            <div className='text-lg font-semibold text-white'>
              동아리 관리 시스템
            </div>
            <div className='h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold md:hidden'>
              JD
            </div>
          </div>
        </header>

        {/* 페이지 콘텐츠 */}
        <main className='flex-1 overflow-y-auto p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
