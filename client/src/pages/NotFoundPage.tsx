import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="container mx-auto py-20 text-center">
      <div className="space-y-8">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          찾으시는 페이지가 존재하지 않거나, 이동되었거나, 삭제되었을 수
          있습니다.
        </p>
        <Button
          size="lg"
          asChild
        >
          <Link to="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}
