import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t dark:border-gray-800 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">클럽허브</h3>
            <p className="text-sm text-muted-foreground">
              클럽허브는 다양한 동아리 활동을 지원하고 커뮤니티를 형성할 수
              있도록 돕는 플랫폼입니다.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">링크</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  소개
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">문의</h3>
            <p className="text-sm text-muted-foreground">
              이메일: contact@clubhub.com
              <br />
              전화: 02-123-4567
            </p>
          </div>
        </div>
        <div className="border-t dark:border-gray-800 mt-8 pt-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} 클럽허브. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
