import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Club } from '@/lib/api-club';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Users } from 'lucide-react';

interface ClubCardProps {
  club: Club;
  onJoin?: (clubId: string) => void;
}

export function ClubCard({ club, onJoin }: ClubCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  const getCategoryColor = (category: string) => {
    const categories: Record<string, string> = {
      학술: 'bg-blue-500',
      취미: 'bg-green-500',
      운동: 'bg-red-500',
      문화: 'bg-purple-500',
      봉사: 'bg-yellow-500',
      종교: 'bg-orange-500',
      기타: 'bg-gray-500',
    };

    return categories[category] || 'bg-gray-500';
  };

  const getDefaultImage = () => {
    return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop';
  };

  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-lg dark:bg-gray-800/60 dark:border-gray-700"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={club.imageUrl || getDefaultImage()}
            alt={club.name}
            className={`object-cover w-full h-full transition-transform duration-500 ${
              isHovering ? 'scale-110' : 'scale-100'
            }`}
          />
        </AspectRatio>
        <Badge
          className={`absolute top-2 right-2 ${getCategoryColor(
            club.category
          )}`}
        >
          {club.category}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold truncate">
            {club.name}
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Users size={16} />
                  <span>{club.memberCount}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>회원 수</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription className="line-clamp-2 min-h-[40px]">
          {club.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {club.owner && (
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={club.owner.profileImage}
                alt={club.owner.username}
              />
              <AvatarFallback>
                {club.owner.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {club.owner.username}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between gap-2 pt-0">
        <Button
          variant="outline"
          className="w-full"
          asChild
        >
          <Link to={`/clubs/${club._id}`}>상세 정보</Link>
        </Button>
        {club.userMembershipStatus ? (
          <Badge
            variant={
              club.userMembershipStatus === 'pending'
                ? 'outline'
                : 'default'
            }
          >
            {club.userMembershipStatus === 'pending'
              ? '가입 대기 중'
              : club.userMembershipStatus === 'member'
              ? '회원'
              : '관리자'}
          </Badge>
        ) : (
          onJoin && (
            <Button
              onClick={() => onJoin(club._id)}
              variant="default"
              className="w-full"
            >
              가입하기
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
}
