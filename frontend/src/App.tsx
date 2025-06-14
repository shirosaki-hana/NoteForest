import { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { 
  CssBaseline, 
  Box,
  TextField,
  Chip,
  Stack,
  Autocomplete,
} from '@mui/material'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { MilkdownEditor } from './components/MilkdownEditor'
import { MilkdownProvider } from '@milkdown/react'

// MUI 테마 타입 확장
declare module '@mui/material/styles' {
  interface Palette {
    milkdown: {
      background: string;
      onBackground: string;
      surface: string;
      surfaceLow: string;
      onSurface: string;
      onSurfaceVariant: string;
      outline: string;
      primary: string;
      secondary: string;
      onSecondary: string;
      inverse: string;
      onInverse: string;
      inlineCode: string;
      error: string;
      hover: string;
      selected: string;
      inlineArea: string;
    };
  }

  interface PaletteOptions {
    milkdown?: {
      background?: string;
      onBackground?: string;
      surface?: string;
      surfaceLow?: string;
      onSurface?: string;
      onSurfaceVariant?: string;
      outline?: string;
      primary?: string;
      secondary?: string;
      onSecondary?: string;
      inverse?: string;
      onInverse?: string;
      inlineCode?: string;
      error?: string;
      hover?: string;
      selected?: string;
      inlineArea?: string;
    };
  }
}

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#1b1c1d',
          color: '#f8f9ff',
          minHeight: '100vh',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#32353a',
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: '#191c20',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#111418',
          backgroundImage: 'none',
          borderBottom: '1px solid #32353a',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#111418',
          borderRight: '1px solid #32353a',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#1d2024', // --crepe-color-hover
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#1d2024',
          },
          '&.Mui-selected': {
            backgroundColor: '#32353a',
            '&:hover': {
              backgroundColor: '#383b41',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#32353a',
          color: '#c3c6cf',
          '& .MuiChip-deleteIcon': {
            color: '#8d9199',
            '&:hover': {
              color: '#c3c6cf',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#111418',
          border: '1px solid #32353a',
        },
      },
    },    MuiAlert: {
      styleOverrides: {
        standardError: {
          backgroundColor: '#2d1b1e',
          color: '#ffb4ab',
          border: '1px solid #4a2c2c',
        },
        standardSuccess: {
          backgroundColor: '#1b2d1e',
          color: '#a1c9fd',
          border: '1px solid #2c4a2c',
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#a1c9fd',
    },
    secondary: {
      main: '#3c4858',
    },
    background: {
      default: '#111418',
      paper: '#191c20',
    },
    text: {
      primary: '#f8f9ff',
      secondary: '#e1e2e8',
    },
    error: {
      main: '#ffb4ab',
    },
    // Milkdown용 커스텀 색상들
    milkdown: {
      background: '#111418',
      onBackground: '#f8f9ff',
      surface: '#111418',
      surfaceLow: '#191c20',
      onSurface: '#e1e2e8',
      onSurfaceVariant: '#c3c6cf',
      outline: '#8d9199',
      primary: '#a1c9fd',
      secondary: '#3c4858',
      onSecondary: '#d7e3f8',
      inverse: '#e1e2e8',
      onInverse: '#2e3135',
      inlineCode: '#ffb4ab',
      error: '#ffb4ab',
      hover: '#1d2024',
      selected: '#32353a',
      inlineArea: '#111418',
    },
  },
})

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedNoteId, setSelectedNoteId] = useState<string>('')
  const [noteTitle, setNoteTitle] = useState<string>('')
  const [noteTags, setNoteTags] = useState<string[]>([])

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }
  const handleNewNote = () => {
    // TODO: 새 메모 작성 기능 구현
    console.log('새 메모 작성')
  }

  const handleSaveNote = () => {
    // TODO: 메모 저장 기능 구현
    console.log('메모 저장')
  }

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId)
    // TODO: 선택된 메모를 에디터에 로드
    console.log('메모 선택:', noteId)
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNoteTitle(event.target.value)
  }

  const handleTagsChange = (_event: any, newValue: string[]) => {
    setNoteTags(newValue)
  }

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
          </Box>

          {/* 에디터 영역 */}
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <MilkdownProvider>
              <MilkdownEditor/>
            </MilkdownProvider>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
