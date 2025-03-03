import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import MDEditor from '@uiw/react-md-editor';
import { Post } from '@/lib/api-post';
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// 게시글 폼 검증 스키마
const postFormSchema = z.object({
  title: z
    .string()
    .min(2, '제목은 최소 2자 이상이어야 합니다.')
    .max(100, '제목은 최대 100자까지 가능합니다.'),
  content: z
    .string()
    .min(10, '내용은 최소 10자 이상이어야 합니다.')
    .max(50000, '내용이 너무 깁니다.'),
});

type PostFormValues = z.infer<typeof postFormSchema>;

interface PostFormProps {
  post?: Post;
  onSubmit: (data: PostFormValues) => void;
  isSubmitting: boolean;
}

export function PostForm({ post, onSubmit, isSubmitting }: PostFormProps) {
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
    },
  });

  // 마크다운 에디터 값 관리
  const [markdown, setMarkdown] = useState<string>(post?.content || '');

  // 마크다운 에디터 변경 시 폼 데이터도 함께 업데이트
  const handleMarkdownChange = (value?: string) => {
    if (value !== undefined) {
      setMarkdown(value);
      form.setValue('content', value, { shouldValidate: true });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post ? '게시글 수정' : '새 게시글 작성'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="게시글 제목을 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={() => (
                <FormItem>
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <div
                      data-color-mode="dark"
                      className="w-full"
                    >
                      <MDEditor
                        value={markdown}
                        onChange={handleMarkdownChange}
                        height={400}
                        preview="edit"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    마크다운 문법을 사용하여 내용을 작성할 수 있습니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? '처리 중...'
                : post
                ? '게시글 수정'
                : '게시글 등록'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
