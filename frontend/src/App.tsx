import { useState, useRef, useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Box, TextField, Chip, Stack, Autocomplete } from '@mui/material'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { MilkdownEditor, type MilkdownEditorRef } from './components/MilkdownEditor'
import { MilkdownProvider } from '@milkdown/react'
import { theme } from './theme'
import { v4 } from 'uuid'
import { writeNote, getNote } from './utils/api'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedNoteId, setSelectedNoteId] = useState<string>('')
  const [noteTitle, setNoteTitle] = useState<string>('')
  const [noteTags, setNoteTags] = useState<string[]>([])
  const [noteContent, setNoteContent] = useState<string>('')
  const [editorKey, setEditorKey] = useState<number>(0)
  const editorRef = useRef<MilkdownEditorRef>(null)

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }
  
  const handleNewNote = () => {
    setSelectedNoteId(v4())
    setNoteTitle('')
    setNoteTags([])
    setNoteContent('')
    setEditorKey(prev => prev + 1)

    console.log('새 메모 작성')
  }

  const handleSaveNote = () => {
    const markdown = editorRef.current?.getMarkdown() || ''
    writeNote({
      uuid: selectedNoteId,
      title: noteTitle,
      tags: noteTags,
      body: markdown
    })
  }

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId)

    getNote(noteId).then(note => {
      if (note.data) {
        setNoteTitle(note.data.title || '')
        setNoteTags(note.data.tags || [])
        setNoteContent(note.data.body || '') 
      }
      setEditorKey(prev => prev + 1)
      console.log('메모 선택:', noteId)
    })
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNoteTitle(event.target.value)
  }
  const handleTagsChange = (_event: any, newValue: string[]) => {
    setNoteTags(newValue)
  }
  // 키보드 단축키 처리 (Ctrl+S로 저장)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault()
        handleSaveNote()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [noteTitle, noteTags, selectedNoteId])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>          <Header 
          onMenuToggle={handleMenuToggle}
          onNewNote={handleNewNote}
          onSaveNote={handleSaveNote}
        /><Sidebar 
          isOpen={sidebarOpen}
          onToggle={handleMenuToggle}
          selectedNoteId={selectedNoteId}
          onNoteSelect={handleNoteSelect}
        />        {/* 메인 콘텐츠 영역 - 에디터 */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 8, // AppBar 높이만큼 패딩
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#111418', // surface color (에디터 배경과 동일)
          }}
        >          {/* 제목과 태그 입력 영역 */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              backgroundColor: '#111418',
            }}
          >
            <Stack spacing={1}>
              {/* 제목 입력 */}
              <TextField
                fullWidth
                variant="standard"
                placeholder="제목 없음"
                value={noteTitle}
                onChange={handleTitleChange}
                InputProps={{
                  disableUnderline: true,
                }}
                sx={{
                  '& .MuiInput-root': {
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: '#f8f9ff',
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'transparent',
                    },
                  },
                  '& input': {
                    padding: '8px 0',
                    '&::placeholder': {
                      color: '#8d9199',
                      opacity: 1,
                      fontWeight: 400,
                    },
                  },
                }}
              />
              
              {/* 태그 입력 */}
              <Autocomplete
                multiple
                freeSolo
                size="small"
                options={[]} // TODO: 기존 태그 목록 추가
                value={noteTags}
                onChange={handleTagsChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="filled"
                      label={option}
                      {...getTagProps({ index })}
                      key={index}
                      size="small"
                      sx={{
                        height: '20px',
                        fontSize: '0.75rem',
                        backgroundColor: '#32353a',
                        color: '#c3c6cf',
                        border: 'none',
                        '& .MuiChip-deleteIcon': {
                          color: '#8d9199',
                          fontSize: '14px',
                          '&:hover': {
                            color: '#c3c6cf',
                          },
                        },
                      }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    placeholder="태그 추가..."
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                    }}
                    sx={{
                      '& .MuiInput-root': {
                        fontSize: '0.875rem',
                        color: '#c3c6cf',
                        backgroundColor: 'transparent',
                        minHeight: 'auto',
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'transparent',
                        },
                      },
                      '& input': {
                        padding: '4px 0',
                        '&::placeholder': {
                          color: '#8d9199',
                          opacity: 1,
                        },
                      },
                    }}
                  />
                )}
              />
            </Stack>
          </Box>          {/* 에디터 영역 */}
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>            <MilkdownProvider>
              <MilkdownEditor
                key={editorKey}
                ref={editorRef}
                value={noteContent}
                placeholder="여기에 노트를 작성하세요..."
              />
            </MilkdownProvider>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
