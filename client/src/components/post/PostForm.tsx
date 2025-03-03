import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import EditorJSComponent from '@/components/editor/EditorJS';

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

// 포스트 데이터 파싱 함수
const parsePostContent = (content: string | undefined) => {
  if (!content) return { blocks: [] };

  try {
    // JSON 문자열인 경우 파싱
    if (
      typeof content === 'string' &&
      content.startsWith('{') &&
      content.endsWith('}')
    ) {
      const parsedData = JSON.parse(content);

      // 유효한 Editor.js 데이터 구조인지 확인
      if (parsedData && Array.isArray(parsedData.blocks)) {
        // 각 블록의 데이터 구조 검증
        const validBlocks = parsedData.blocks.map((block: any) => {
          if (!block.data) block.data = {};

          // paragraph 블록에 text 필드가 없는 경우 추가
          if (block.type === 'paragraph' && block.data.text === undefined) {
            block.data.text = '';
          }

          return block;
        });

        return {
          ...parsedData,
          blocks: validBlocks,
        };
      }
    }

    // 일반 텍스트인 경우 paragraph 블록으로 변환
    // 각 줄을 별도의 paragraph로 처리
    const paragraphs = content.split('\n\n').filter(Boolean);
    const blocks =
      paragraphs.length > 0
        ? paragraphs.map((text) => ({
            type: 'paragraph',
            data: { text },
          }))
        : [{ type: 'paragraph', data: { text: content } }];

    return { blocks };
  } catch (error) {
    console.error('Content parsing error:', error);
    // 파싱 실패 시 단일 paragraph 블록으로 저장
    return {
      blocks: [{ type: 'paragraph', data: { text: content } }],
    };
  }
};

export function PostForm({ post, onSubmit, isSubmitting }: PostFormProps) {
  // 인스턴스 ID를 사용하여 에디터 고유 식별
  const editorInstanceId = useMemo(
    () => `editor-${post?._id || 'new'}-${Date.now()}`,
    [post?._id]
  );

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
    },
  });

  // 에디터 데이터 관리
  const [editorData, setEditorData] = useState<any>(() =>
    parsePostContent(post?.content)
  );

  // 포스트 변경 시 에디터 데이터 업데이트 (편집 모드로 전환 시)
  useEffect(() => {
    if (post?.content) {
      setEditorData(parsePostContent(post.content));
    }
  }, [post?._id, post?.content]); // post ID로 의존성 추가하여 다른 포스트 편집 시에만 갱신

  // 에디터 변경 시 폼 데이터도 함께 업데이트
  const handleEditorChange = (data: any) => {
    setEditorData(data);

    // 저장 전 데이터 유효성 확인
    if (!data || !data.blocks || data.blocks.length === 0) {
      form.setValue('content', '', { shouldValidate: true });
      return;
    }

    // 에디터의 전체 내용을 JSON 문자열로 변환하여 저장
    const contentJson = JSON.stringify(data);

    // 검증을 위한 텍스트만 추출 (공백 보존)
    const contentText = data.blocks
      .map((block: any) => {
        if (block.type === 'paragraph') {
          return block.data?.text || '';
        } else if (block.type === 'header') {
          return block.data?.text || '';
        } else if (block.type === 'list') {
          return Array.isArray(block.data?.items)
            ? block.data.items.join('\n')
            : '';
        }
        return '';
      })
      .filter(Boolean)
      .join('\n\n'); // 각 블록 사이에 빈 줄 추가하여 구분

    // 검증 값이 최소 길이를 만족하는지 확인
    if (contentText.trim().length >= 10) {
      form.setValue('content', contentJson, { shouldValidate: true });
    } else {
      form.setValue('content', contentText, { shouldValidate: true });
    }
  };

  // 폼 제출 시 처리
  const handleFormSubmit = (data: PostFormValues) => {
    onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post ? '게시글 수정' : '새 게시글 작성'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
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
                    <div className="editor-container">
                      <EditorJSComponent
                        key={editorInstanceId}
                        data={editorData}
                        onChange={handleEditorChange}
                        placeholder="내용을 입력하세요..."
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    다양한 블록을 추가하여 내용을 작성할 수 있습니다.
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
