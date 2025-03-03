import React from 'react';
import { Construction } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const ClubCreatePage: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded-md flex items-start">
        <Construction className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
        <div>
          <h3 className="font-bold text-yellow-700">개발 중인 페이지</h3>
          <p className="text-yellow-600">
            이 페이지는 현재 개발 중입니다. 일부 기능이 작동하지 않을 수
            있습니다.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            동아리 생성 신청
          </CardTitle>
          <CardDescription>
            새로운 동아리를 만들기 위한 정보를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-10">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
              <p className="text-lg font-medium">페이지 개발 중...</p>
              <p className="text-sm text-muted-foreground">
                곧 서비스가 제공될 예정입니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubCreatePage;
