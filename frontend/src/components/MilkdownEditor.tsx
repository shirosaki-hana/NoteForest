import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import {
  Editor,
  rootCtx,
  defaultValueCtx,
} from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';
import { commonmark } from '@milkdown/preset-commonmark';
import { history } from '@milkdown/plugin-history';
import { gfm } from '@milkdown/preset-gfm';
import { ReactEditor, useEditor } from '@milkdown/react';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { clipboard } from '@milkdown/plugin-clipboard';

interface MilkdownEditorProps {
  initialContent?: string;
  onContentChange?: (markdown: string) => void;
}

export default function MilkdownEditor({ 
  initialContent = "# NoteForest 에디터\n\n여기에 마크다운을 작성해보세요!\n\n- **굵게** 쓰기\n- *기울임* 쓰기\n- `코드` 작성\n\n## 코드 블록\n\n```typescript\nfunction hello() {\n  console.log('Hello, NoteForest!');\n}\n```\n\n> 인용문도 사용할 수 있습니다.\n\n테이블도 지원합니다:\n\n| 기능 | 지원 여부 |\n|------|----------|\n| 마크다운 | ✅ |\n| WYSIWYG | ✅ |\n| 다크 테마 | ✅ |",
  onContentChange 
}: MilkdownEditorProps) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    onContentChange?.(content);
  }, [content, onContentChange]);
  const { editor } = useEditor(
    (root) =>
      Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, root);
          ctx.set(defaultValueCtx, content);
          ctx
            .get(listenerCtx)
            .beforeMount(() => {
              console.log('에디터 마운트 준비 중...');
            })
            .mounted(() => {
              console.log('에디터 마운트 완료!');
            })
            .updated(() => {
              console.log('문서 업데이트됨');
            })
            .markdownUpdated((_ctx, markdown) => {
              console.log('마크다운 업데이트:', markdown.slice(0, 50) + '...');
              setContent(markdown);
            })
            .blur(() => {
              console.log('에디터 포커스 잃음');
            })
            .focus(() => {
              console.log('에디터 포커스 받음');
            })            .destroy(() => {
              console.log('에디터 제거됨');
            });
        })
        .use(nord)
        .use(commonmark)
        .use(gfm)
        .use(history)
        .use(listener)
        .use(clipboard)
  );
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'scroll',
        '& .milkdown': {
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: '#f0f0f0',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
          minHeight: '100%',
          padding: '2rem',
          fontSize: '16px',
          lineHeight: '1.6',
        },
        '& .editor': {
          background: 'transparent',
          minHeight: '100%',
        },
        // Nord 테마 심플화 - NoteForest 색상에 맞춤
        '& .nord-editor': {
          backgroundColor: 'transparent !important',
          color: '#f0f0f0 !important',
        },
        '& .nord-editor p': {
          color: '#f0f0f0 !important',
          margin: '0.75em 0',
        },
        '& .nord-editor h1, & .nord-editor h2, & .nord-editor h3, & .nord-editor h4, & .nord-editor h5, & .nord-editor h6': {
          color: '#64b5f6 !important',
          borderColor: 'rgba(100, 181, 246, 0.3) !important',
          margin: '1.5em 0 0.75em 0',
          fontWeight: '600',
        },
        '& .nord-editor h1': {
          fontSize: '2rem',
          borderBottom: '2px solid rgba(100, 181, 246, 0.3)',
          paddingBottom: '0.5rem',
        },
        '& .nord-editor h2': {
          fontSize: '1.5rem',
          borderBottom: '1px solid rgba(100, 181, 246, 0.2)',
          paddingBottom: '0.25rem',
        },
        '& .nord-editor h3': {
          fontSize: '1.25rem',
        },
        '& .nord-editor strong': {
          color: '#81c784 !important',
          fontWeight: '600',
        },
        '& .nord-editor em': {
          color: '#90caf9 !important',
          fontStyle: 'italic',
        },
        '& .nord-editor code': {
          backgroundColor: 'rgba(100, 181, 246, 0.15) !important',
          color: '#90caf9 !important',
          border: '1px solid rgba(100, 181, 246, 0.2) !important',
          borderRadius: '4px',
          padding: '0.125rem 0.25rem',
          fontSize: '0.9em',
        },
        '& .nord-editor pre': {
          backgroundColor: 'rgba(30, 30, 46, 0.8) !important',
          border: '1px solid rgba(255, 255, 255, 0.1) !important',
          borderRadius: '8px',
          padding: '1rem',
          overflow: 'auto',
          margin: '1rem 0',
        },
        '& .nord-editor pre code': {
          backgroundColor: 'transparent !important',
          border: 'none !important',
          color: '#f0f0f0 !important',
          padding: '0',
        },
        '& .nord-editor blockquote': {
          borderLeftColor: '#64b5f6 !important',
          borderLeftWidth: '4px !important',
          borderLeftStyle: 'solid !important',
          backgroundColor: 'rgba(100, 181, 246, 0.05) !important',
          color: '#a0a0b2 !important',
          margin: '1rem 0',
          paddingLeft: '1rem',
          fontStyle: 'italic',
        },
        '& .nord-editor ul, & .nord-editor ol': {
          margin: '1rem 0',
          paddingLeft: '2rem',
        },
        '& .nord-editor li': {
          margin: '0.25rem 0',
          color: '#f0f0f0 !important',
        },
        '& .nord-editor table': {
          borderColor: 'rgba(255, 255, 255, 0.1) !important',
          borderCollapse: 'collapse',
          width: '100%',
          margin: '1rem 0',
        },
        '& .nord-editor th, & .nord-editor td': {
          borderColor: 'rgba(255, 255, 255, 0.1) !important',
          color: '#f0f0f0 !important',
          padding: '0.75rem',
          textAlign: 'left',
        },
        '& .nord-editor th': {
          backgroundColor: 'rgba(100, 181, 246, 0.1) !important',
          fontWeight: '600',
        },
        '& .nord-editor hr': {
          borderColor: 'rgba(255, 255, 255, 0.1) !important',
          margin: '2rem 0',
        },
        // 체크박스 스타일링
        '& .nord-editor input[type="checkbox"]': {
          accentColor: '#64b5f6',
          marginRight: '0.5rem',
        },
        // 포커스 스타일 제거 (깔끔한 편집 경험)
        
        // 선택 영역 스타일링
        '& .ProseMirror ::selection': {
          backgroundColor: 'rgba(100, 181, 246, 0.3) !important',
        },
      }}
    >
      <ReactEditor editor={editor} />
    </Box>
  );
}
