import { Club } from '@/lib/api-club';
import { ClubCard } from './ClubCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface ClubListProps {
  clubs: Club[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  onPageChange: (page: number) => void;
  onJoinClub?: (clubId: string) => void;
}

export function ClubList({
  clubs,
  loading,
  error,
  pagination,
  onPageChange,
  onJoinClub,
}: ClubListProps) {
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-destructive">{error}</p>
        <Button
          onClick={() => onPageChange(pagination.page)}
          className="mt-4"
        >
          다시 시도
        </Button>
      </div>
    );
  }

  if (clubs.length === 0) {
    return (
      <div className="w-full text-center py-12 bg-muted/40 rounded-lg">
        <p className="text-muted-foreground">검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {clubs.map((club) => (
          <ClubCard
            key={club._id}
            club={club}
            onJoin={onJoinClub}
          />
        ))}
      </div>

      {pagination.pages > 1 && (
        <>
          <Separator className="my-4" />
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from(
              { length: Math.min(5, pagination.pages) },
              (_, i) => {
                // 표시할 페이지 번호 계산 로직
                let pageToShow = i + 1;
                if (pagination.pages > 5) {
                  if (pagination.page > 3) {
                    pageToShow = pagination.page - 3 + i;
                  }
                  if (pagination.page > pagination.pages - 2) {
                    pageToShow = pagination.pages - 5 + i + 1;
                  }
                }

                if (pageToShow <= pagination.pages) {
                  return (
                    <Button
                      key={pageToShow}
                      variant={
                        pagination.page === pageToShow
                          ? 'default'
                          : 'outline'
                      }
                      size="icon"
                      onClick={() => onPageChange(pageToShow)}
                    >
                      {pageToShow}
                    </Button>
                  );
                }
                return null;
              }
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                onPageChange(
                  Math.min(pagination.pages, pagination.page + 1)
                )
              }
              disabled={pagination.page === pagination.pages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
