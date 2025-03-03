import { useEffect, useRef, useState, useCallback } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import CheckList from '@editorjs/checklist';
import Quote from '@editorjs/quote';
import CodeTool from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import LinkTool from '@editorjs/link';
import Marker from '@editorjs/marker';
import Table from '@editorjs/table';
import './editor.css';

interface EditorProps {
  data?: any;
  onChange: (data: any) => void;
  placeholder?: string;
  readOnly?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const EDITOR_JS_TOOLS = {
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      placeholder: '제목을 입력하세요',
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: 'unordered',
    },
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    config: {
      placeholder: '내용을 입력하세요...',
      preserveBlank: true,
    },
  },
  checklist: {
    class: CheckList,
    inlineToolbar: true,
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: '인용구를 입력하세요',
      captionPlaceholder: '출처를 입력하세요',
    },
  },
  code: {
    class: CodeTool,
    config: {
      placeholder: '코드를 입력하세요',
    },
  },
  delimiter: Delimiter,
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: '/api/link',
    },
  },
  marker: Marker,
  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 2,
    },
  },
};

// i18n 설정을 컴포넌트 외부로 이동하여 리렌더링 방지
const i18nConfig = {
  messages: {
    ui: {
      blockTunes: {
        toggler: {
          'Click to tune': '설정하려면 클릭하세요',
          'or drag to move': '또는 드래그하여 이동',
        },
      },
      inlineToolbar: {
        converter: {
          'Convert to': '변환',
        },
      },
      toolbar: {
        toolbox: {
          Add: '추가',
        },
      },
    },
    toolNames: {
      Text: '텍스트',
      Heading: '제목',
      List: '목록',
      Warning: '경고',
      Checklist: '체크리스트',
      Quote: '인용구',
      Code: '코드',
      Delimiter: '구분선',
      'Raw HTML': 'HTML',
      Table: '표',
      Link: '링크',
      Marker: '마커',
      Bold: '굵게',
      Italic: '기울임',
      InlineCode: '인라인 코드',
    },
    tools: {
      warning: {
        Title: '제목',
        Message: '메시지',
      },
      link: {
        'Add a link': '링크 추가',
      },
      stub: {
        'The block can not be displayed correctly':
          '블록을 올바르게 표시할 수 없습니다.',
      },
    },
    blockTunes: {
      delete: {
        Delete: '삭제',
      },
      moveUp: {
        'Move up': '위로 이동',
      },
      moveDown: {
        'Move down': '아래로 이동',
      },
    },
  },
};

const EditorJSComponent = ({
  data,
  onChange,
  placeholder,
  readOnly = false,
}: EditorProps) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef(data);
  const [isReady, setIsReady] = useState(false);

  // 데이터 변경 추적
  if (JSON.stringify(dataRef.current) !== JSON.stringify(data)) {
    dataRef.current = data;
  }

  // 에디터 정리 함수
  const destroyEditor = useCallback(() => {
    if (editorRef.current) {
      try {
        editorRef.current.destroy();
        editorRef.current = null;
      } catch (error) {
        console.error('Error destroying editor:', error);
      }
    }
  }, []);

  // 에디터 초기화 함수
  const initializeEditor = useCallback(() => {
    if (!holderRef.current || editorRef.current) return;

    try {
      const editorConfig = {
        holder: holderRef.current,
        tools: EDITOR_JS_TOOLS,
        data: dataRef.current || { blocks: [] },
        placeholder: placeholder || '내용을 입력하세요...',
        readOnly,
        autofocus: false,
        // onChange: async () => {
        //   if (!readOnly) {
        //     try {
        //       // const savedData = await editorRef.current?.save();
        //       if (savedData) {
        //         // 저장 전 데이터 유효성 검증
        //         // const validatedData = validateBlockData(savedData);
        //         onChange(savedData);
        //       }
        //     } catch (error) {
        //       console.error('Error saving editor data:', error);
        //     }
        //   }
        // },
        i18n: i18nConfig,
        onReady: () => {
          setIsReady(true);
        },
        // 특수 문자와 공백 보존 설정
        sanitizer: {
          p: true, // paragraph 내 공백 보존
        },
        // 빈 블록 처리 설정
        minHeight: 0,
        logLevel: 'ERROR',
      };

      const editor = new EditorJS(editorConfig);
      editorRef.current = editor;
    } catch (error) {
      console.error('Error initializing editor:', error);
    }
  }, [onChange, placeholder, readOnly]);

  // 컴포넌트 마운트/언마운트 시
  useEffect(() => {
    initializeEditor();

    return () => {
      destroyEditor();
    };
  }, []);

  // readOnly 변경 시 에디터 재설정
  useEffect(() => {
    if (editorRef.current && isReady) {
      destroyEditor();
      initializeEditor();
    }
  }, [readOnly]);

  // 데이터 변경 시 업데이트
  useEffect(() => {
    if (editorRef.current && isReady && data) {
      try {
        // 데이터 유효성 검증 후 렌더링
        editorRef.current.render(data);
      } catch (error) {
        console.error('Error rendering editor data:', error);
      }
    }
  }, [data]);

  return (
    <div className="editor-js-wrapper">
      <div
        ref={holderRef}
        className="prose max-w-none dark:prose-invert editor-js-container"
        data-initialized={isReady ? 'true' : 'false'}
      />
    </div>
  );
};

export default EditorJSComponent;
