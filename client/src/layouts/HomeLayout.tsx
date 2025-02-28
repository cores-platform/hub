import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';

const HomeLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-white'>
      {/* 홈 전용 헤더 */}
      <header className='sticky top-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700'>
        <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
          <div className='flex items-center space-x-2'>
            <div className='h-8 w-8 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600'></div>
            <span className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500'>
              동아리 허브
            </span>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className='hidden md:flex items-center space-x-8'>
            <Link
              to='/'
              className='text-slate-300 hover:text-white transition-colors'
            >
              동아리 찾기
            </Link>
            <Link
              to='/popular'
              className='text-slate-300 hover:text-white transition-colors'
            >
              인기 동아리
            </Link>
            <Link
              to='/events'
              className='text-slate-300 hover:text-white transition-colors'
            >
              행사 일정
            </Link>
            <Link
              to='/community'
              className='text-slate-300 hover:text-white transition-colors'
            >
              커뮤니티
            </Link>
            <Link
              to='/login'
              className='px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors'
            >
              로그인
            </Link>
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button
            className='md:hidden text-slate-300 hover:text-white'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              {isMenuOpen ? (
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
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className='md:hidden bg-slate-800 border-b border-slate-700'>
            <div className='container mx-auto px-4 py-4 flex flex-col space-y-4'>
              <Link
                to='/'
                className='text-slate-300 hover:text-white transition-colors py-2'
              >
                동아리 찾기
              </Link>
              <Link
                to='/popular'
                className='text-slate-300 hover:text-white transition-colors py-2'
              >
                인기 동아리
              </Link>
              <Link
                to='/events'
                className='text-slate-300 hover:text-white transition-colors py-2'
              >
                행사 일정
              </Link>
              <Link
                to='/community'
                className='text-slate-300 hover:text-white transition-colors py-2'
              >
                커뮤니티
              </Link>
              <Link
                to='/login'
                className='px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors'
              >
                로그인
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 메인 콘텐츠 */}
      <main className='flex-grow'>
        <Outlet />
      </main>

      {/* 홈 전용 푸터 */}
      <footer className='bg-slate-900 border-t border-slate-800'>
        <div className='container mx-auto px-4 py-12'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div>
              <h3 className='text-lg font-semibold mb-4 text-indigo-400'>
                동아리 허브
              </h3>
              <p className='text-slate-400 text-sm'>
                다양한 동아리를 찾고, 가입하고, 관리할 수 있는 종합
                플랫폼입니다.
              </p>
            </div>
            <div>
              <h4 className='text-md font-medium mb-4 text-slate-300'>
                서비스
              </h4>
              <ul className='space-y-2 text-sm text-slate-400'>
                <li>
                  <Link
                    to='/register'
                    className='hover:text-white transition-colors'
                  >
                    동아리 등록
                  </Link>
                </li>
                <li>
                  <Link
                    to='/search'
                    className='hover:text-white transition-colors'
                  >
                    동아리 검색
                  </Link>
                </li>
                <li>
                  <Link
                    to='/events'
                    className='hover:text-white transition-colors'
                  >
                    행사 관리
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='text-md font-medium mb-4 text-slate-300'>
                리소스
              </h4>
              <ul className='space-y-2 text-sm text-slate-400'>
                <li>
                  <Link
                    to='/guide'
                    className='hover:text-white transition-colors'
                  >
                    가이드
                  </Link>
                </li>
                <li>
                  <Link
                    to='/faq'
                    className='hover:text-white transition-colors'
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to='/notice'
                    className='hover:text-white transition-colors'
                  >
                    공지사항
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='text-md font-medium mb-4 text-slate-300'>정보</h4>
              <ul className='space-y-2 text-sm text-slate-400'>
                <li>
                  <Link
                    to='/about'
                    className='hover:text-white transition-colors'
                  >
                    소개
                  </Link>
                </li>
                <li>
                  <Link
                    to='/terms'
                    className='hover:text-white transition-colors'
                  >
                    이용약관
                  </Link>
                </li>
                <li>
                  <Link
                    to='/privacy'
                    className='hover:text-white transition-colors'
                  >
                    개인정보처리방침
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500'>
            &copy; 2023 동아리 허브. 모든 권리 보유.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;
