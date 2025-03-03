import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

// 레이아웃
import HomeLayout from '@/layouts/HomeLayout';

// 페이지
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProfilePage from '@/pages/ProfilePage';
import ProfileEditPage from '@/pages/ProfileEditPage';
import MyClubsPage from '@/pages/MyClubsPage';
import ClubsPage from '@/pages/ClubsPage';
import ClubDetailPage from '@/pages/ClubDetailPage';
import ClubManagementPage from '@/pages/ClubManagementPage';
import ClubAppPage from '@/pages/ClubAppPage';
import BoardsOverviewPage from '@/pages/board/BoardsOverviewPage';
import CreateBoardPage from '@/pages/board/CreateBoardPage';
import EditBoardPage from '@/pages/board/EditBoardPage';
import BoardPostsPage from './pages/post/BoardPostsPage';
import PostDetailPage from './pages/post/PostDetailPage';
import CreatePostPage from './pages/post/CreatePostPage';
import EditPostPage from './pages/post/EditPostPage';
import ClubCreatePage from './pages/ClubCreatePage';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // 앱 초기화 시 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<HomeLayout />}
          >
            <Route
              index
              element={<HomePage />}
            />
            <Route
              path="login"
              element={<LoginPage />}
            />
            <Route
              path="register"
              element={<RegisterPage />}
            />

            {/* 동아리 관련 라우팅 */}
            <Route path="clubs">
              <Route
                index
                element={<ClubsPage />}
              />
              <Route
                path="create"
                element={<ClubCreatePage />}
              />
              <Route
                path=":clubId"
                element={<ClubDetailPage />}
              />
              <Route
                path=":clubId/manage"
                element={<ClubManagementPage />}
              />
              <Route
                path=":clubId/app"
                element={<ClubAppPage />}
              >
                <Route
                  index
                  element={<BoardsOverviewPage />}
                />
                <Route
                  path="boards/create"
                  element={<CreateBoardPage />}
                />
                <Route
                  path="boards/:boardId"
                  // element={<BoardDetailPage />}
                >
                  <Route
                    index
                    element={<BoardPostsPage />}
                  />
                  <Route
                    path="posts/create"
                    element={<CreatePostPage />}
                  />
                  <Route
                    path="posts/:postId"
                    element={<PostDetailPage />}
                  />
                  <Route
                    path="posts/:postId/edit"
                    element={<EditPostPage />}
                  />
                </Route>
                <Route
                  path="boards/:boardId/edit"
                  element={<EditBoardPage />}
                />
              </Route>
              {/* <Route
                path="create"
                element={<div>동아리 생성 페이지</div>}
              /> */}
              {/* <Route
                path=":clubId/edit"
                element={<div>동아리 수정 페이지</div>}
              /> */}
            </Route>

            {/* 프로필 관련 라우팅 */}
            <Route path="profile">
              <Route
                index
                element={<ProfilePage />}
              />
              <Route
                path="edit"
                element={<ProfileEditPage />}
              />
            </Route>

            {/* 내 동아리 페이지 */}
            <Route
              path="my-clubs"
              element={<MyClubsPage />}
            />

            {/* 소개 페이지 */}
            {/* <Route
              path="about"
              element={<div>소개 페이지</div>}
            /> */}

            {/* 기타 페이지 */}
            <Route
              path="*"
              element={<NotFoundPage />}
            />
          </Route>
        </Routes>
        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
