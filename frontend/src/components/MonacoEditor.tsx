import Editor, { type Monaco, loader } from '@monaco-editor/react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import tomorrowTheme from 'monaco-themes/themes/Tomorrow.json';
import tomorrowThemeDark from 'monaco-themes/themes/Tomorrow-Night.json';

// Monaco Editor를 로컬 번들에서 로드하도록 설정
loader.config({
  paths: {
    vs: '/monaco/vs', // public/monaco/vs 경로 사용
  },
});

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MonacoEditor({ value, onChange }: MonacoEditorProps) {
  const theme = useTheme();

  const handleEditorWillMount = (monacoInstance: Monaco) => {
    // Monaco 테마 타입을 정확히 지정
    monacoInstance.editor.defineTheme('tomorrow', {
      ...tomorrowTheme,
      base: tomorrowTheme.base as 'vs' | 'vs-dark' | 'hc-black' | 'hc-light',
    });
    monacoInstance.editor.defineTheme('github-dark', {
      ...tomorrowThemeDark,
      base: tomorrowThemeDark.base as 'vs' | 'vs-dark' | 'hc-black' | 'hc-light',
    });
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <Editor
        height='100%'
        defaultLanguage='markdown'
        value={value}
        onChange={val => onChange(val || '')}
        theme={theme.palette.mode === 'dark' ? 'github-dark' : 'tomorrow'}
        beforeMount={handleEditorWillMount}
        options={{
          fontSize: 16,
          lineHeight: 24,
          fontFamily: '"Inter", "Arial", "Helvetica", sans-serif',
          padding: { top: 16, bottom: 16 },
          minimap: { enabled: false },
          lineNumbers: 'off',
          renderLineHighlight: 'none',
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          scrollbar: { vertical: 'auto', horizontal: 'auto' },
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          accessibilitySupport: 'on',
        }}
        loading={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'text.secondary',
            }}
          >
            에디터 로딩중...
          </Box>
        }
      />
    </Box>
  );
}
