import Editor from '@monaco-editor/react'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import tomorrowTheme from 'monaco-themes/themes/Tomorrow.json'
import tomorrowThemeDark from 'monaco-themes/themes/Tomorrow-Night.json'

interface MonacoEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function MonacoEditor({ 
  value, 
  onChange, 
}: MonacoEditorProps) {
  const theme = useTheme()

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('tomorrow', tomorrowTheme);
    monaco.editor.defineTheme('github-dark', tomorrowThemeDark);
  }

  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <Editor
        height="100%"
        defaultLanguage="markdown"
        value={value}
        onChange={(val) => onChange(val || '')}
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
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            color: 'text.secondary'
          }}>
            에디터 로딩중...
          </Box>
        }
      />
    </Box>
  )
}