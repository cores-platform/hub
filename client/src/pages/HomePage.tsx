const HomePage = () => {
  return (
    <div className='animate-fade-in'>
      {/* 히어로 섹션 */}
      <section className='py-20 md:py-32 px-4'>
        <div className='container mx-auto text-center'>
          <h1 className='text-4xl md:text-6xl font-bold mb-6 gradient-text'>
            당신의 열정에 맞는 동아리를 찾아보세요
          </h1>
          <p className='text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto'>
            다양한 분야의 동아리를 탐색하고, 새로운 친구들과 함께 취미와
            관심사를 공유하세요.
          </p>
          <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <button className='btn-primary'>동아리 찾기</button>
            <button className='btn-outline'>동아리 등록하기</button>
          </div>

          {/* 검색 바 */}
          <div className='mt-16 max-w-3xl mx-auto'>
            <div className='card p-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20'>
              <div className='bg-slate-900 rounded-md p-4'>
                <div className='flex flex-col sm:flex-row gap-4'>
                  <input
                    type='text'
                    placeholder='관심 있는 동아리를 검색해보세요'
                    className='flex-grow px-4 py-3 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white'
                  />
                  <button className='btn-primary whitespace-nowrap'>
                    검색
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section className='py-20 bg-slate-800/50 px-4'>
        <div className='container mx-auto'>
          <h2 className='text-3xl font-bold mb-16 text-center'>
            <span className='gradient-text'>다양한 분야</span>의 동아리를
            만나보세요
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* 카테고리 1 */}
            <div className='card card-hover p-6'>
              <div className='h-12 w-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-indigo-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-2'>문화 예술</h3>
              <p className='text-slate-400'>
                음악, 미술, 연극, 사진 등 다양한 예술 분야의 동아리를
                만나보세요.
              </p>
            </div>

            {/* 카테고리 2 */}
            <div className='card card-hover p-6'>
              <div className='h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-purple-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-2'>학술 연구</h3>
              <p className='text-slate-400'>
                프로그래밍, 과학, 독서, 토론 등 지식을 넓히는 동아리를
                찾아보세요.
              </p>
            </div>

            {/* 카테고리 3 */}
            <div className='card card-hover p-6'>
              <div className='h-12 w-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-indigo-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-2'>스포츠 레저</h3>
              <p className='text-slate-400'>
                축구, 농구, 등산, 요가 등 활동적인 동아리에서 건강을 챙기세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 인기 동아리 섹션 */}
      <section className='py-20 px-4'>
        <div className='container mx-auto'>
          <h2 className='text-3xl font-bold mb-12 text-center'>인기 동아리</h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {/* 동아리 카드 1 */}
            <div className='card card-hover'>
              <div className='h-48 bg-gradient-to-r from-blue-500 to-indigo-600'></div>
              <div className='p-5'>
                <h3 className='text-lg font-semibold mb-2'>코딩 클럽</h3>
                <p className='text-sm text-slate-400 mb-3'>
                  함께 성장하는 개발자 커뮤니티
                </p>
                <div className='flex justify-between items-center'>
                  <span className='text-xs text-slate-500'>회원 128명</span>
                  <button className='text-sm px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors'>
                    자세히
                  </button>
                </div>
              </div>
            </div>

            {/* 동아리 카드 2 */}
            <div className='card card-hover'>
              <div className='h-48 bg-gradient-to-r from-purple-500 to-pink-600'></div>
              <div className='p-5'>
                <h3 className='text-lg font-semibold mb-2'>사진 동아리</h3>
                <p className='text-sm text-slate-400 mb-3'>
                  순간을 포착하는 사진작가들
                </p>
                <div className='flex justify-between items-center'>
                  <span className='text-xs text-slate-500'>회원 95명</span>
                  <button className='text-sm px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors'>
                    자세히
                  </button>
                </div>
              </div>
            </div>

            {/* 동아리 카드 3 */}
            <div className='card card-hover'>
              <div className='h-48 bg-gradient-to-r from-green-500 to-teal-600'></div>
              <div className='p-5'>
                <h3 className='text-lg font-semibold mb-2'>등산 모임</h3>
                <p className='text-sm text-slate-400 mb-3'>
                  자연과 함께하는 건강한 취미
                </p>
                <div className='flex justify-between items-center'>
                  <span className='text-xs text-slate-500'>회원 76명</span>
                  <button className='text-sm px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors'>
                    자세히
                  </button>
                </div>
              </div>
            </div>

            {/* 동아리 카드 4 */}
            <div className='card card-hover'>
              <div className='h-48 bg-gradient-to-r from-yellow-500 to-orange-600'></div>
              <div className='p-5'>
                <h3 className='text-lg font-semibold mb-2'>독서 토론</h3>
                <p className='text-sm text-slate-400 mb-3'>
                  책을 통해 세상을 이야기하는 모임
                </p>
                <div className='flex justify-between items-center'>
                  <span className='text-xs text-slate-500'>회원 64명</span>
                  <button className='text-sm px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors'>
                    자세히
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-10 text-center'>
            <button className='btn-outline'>더 많은 동아리 보기</button>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className='py-20 px-4'>
        <div className='container mx-auto max-w-4xl'>
          <div className='card p-8 md:p-12 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'>
            <h2 className='text-2xl md:text-3xl font-bold mb-4 text-center'>
              나만의 동아리를 만들어보세요
            </h2>
            <p className='text-slate-300 text-center mb-8'>
              비슷한 관심사를 가진 사람들과 함께할 수 있는 커뮤니티를 직접
              만들고 운영해보세요.
            </p>
            <div className='flex flex-col sm:flex-row justify-center gap-4'>
              <button className='btn-primary'>동아리 등록하기</button>
              <button className='btn-outline'>등록 가이드</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
