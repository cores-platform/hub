import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ClubIcon } from '@/components/icons';
import { useClubStore } from '@/store/clubStore';

export default function HomePage() {
  // 개별 상태로 분리하여 가져오기
  const clubs = useClubStore((state) => state.clubs);
  const isLoading = useClubStore((state) => state.isLoading);
  const error = useClubStore((state) => state.error);
  const fetchClubs = useClubStore((state) => state.fetchClubs);

  useEffect(() => {
    // 인기 동아리 6개만 로드
    fetchClubs();
  }, [fetchClubs]);

  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            클럽허브에 오신 것을 환영합니다
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            다양한 동아리를 발견하고, 새로운 친구를 만나고, 잊지 못할 경험을
            만들어보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
            >
              <Link to="/clubs">동아리 찾기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 인기 동아리 섹션 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            인기 동아리
          </h2>

          {isLoading ? (
            <div className="text-center py-8">로딩 중...</div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club) => (
                <Link
                  key={club._id}
                  to={`/clubs/${club._id}`}
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {club.imageUrl ? (
                          <img
                            src={club.imageUrl}
                            alt={club.name}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <ClubIcon className="w-6 h-6" />
                        )}
                        {club.name}
                      </CardTitle>
                      <CardDescription>{club.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3">{club.description}</p>
                    </CardContent>
                    <CardFooter>
                      <div className="text-sm text-muted-foreground">
                        회원 {club.memberCount}명
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              asChild
            >
              <Link to="/clubs">더 많은 동아리 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 소개 섹션 */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">클럽허브 소개</h2>
              <p className="mb-4">
                클럽허브는 다양한 동아리와 커뮤니티를 연결하는 플랫폼입니다.
                우리는 사람들이 공통의 관심사를 중심으로 모이고, 활동하고,
                성장할 수 있는 공간을 만들고자 합니다.
              </p>
              <p className="mb-4">
                동아리를 찾고 계신가요? 또는 이미 동아리를 운영하고
                계신가요? 클럽허브에서 모든 것을 시작해보세요.
              </p>
              <Button
                asChild
                className="mt-4"
              >
                <Link to="/about">자세히 알아보기</Link>
              </Button>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1528605248644-14dd04022da1"
                alt="동아리 활동"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
