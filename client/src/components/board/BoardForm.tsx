import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Board } from '@/lib/api-board';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// 게시판 폼 검증 스키마
const boardFormSchema = z.object({
  name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다.')
    .max(50, '이름은 최대 50자까지 가능합니다.'),
  description: z
    .string()
    .min(5, '설명은 최소 5자 이상이어야 합니다.')
    .max(200, '설명은 최대 200자까지 가능합니다.'),
  isActive: z.boolean().default(true),
});

type BoardFormValues = z.infer<typeof boardFormSchema>;

interface BoardFormProps {
  board?: Board;
  onSubmit: (data: BoardFormValues) => void;
  isSubmitting: boolean;
}

export function BoardForm({
  board,
  onSubmit,
  isSubmitting,
}: BoardFormProps) {
  const form = useForm<BoardFormValues>({
    resolver: zodResolver(boardFormSchema),
    defaultValues: {
      name: board?.name || '',
      description: board?.description || '',
      isActive: board?.isActive !== undefined ? board.isActive : true,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{board ? '게시판 수정' : '새 게시판 생성'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>게시판 이름</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="게시판 이름을 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    게시판의 이름을 입력하세요. 이름은 2~50자 사이여야
                    합니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>게시판 설명</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="게시판 설명을 입력하세요"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    게시판의 용도나 규칙 등을 설명해주세요. 설명은 5~200자
                    사이여야 합니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {board && (
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        게시판 활성화
                      </FormLabel>
                      <FormDescription>
                        게시판을 활성화하면 사용자들이 게시판을 볼 수
                        있습니다.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? '처리 중...'
                : board
                ? '게시판 수정'
                : '게시판 생성'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
