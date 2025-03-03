import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="container mx-auto py-20 text-center">
      <div className="space-y-8">
        <h1 className="text-9xl font-bold text-primary">🚧</h1>
        <h2 className="text-3xl font-semibold">페이지 제작 중입니다</h2>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          현재 이 페이지는 개발 중입니다. 곧 완성된 페이지로 찾아뵙겠습니다.
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
