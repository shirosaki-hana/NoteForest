import { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { 
  CssBaseline, 
  Box, 
  Typography,
  Paper,
  Container,
} from '@mui/material'
import Header from './components/Header'
import Sidebar from './components/Sidebar'

// 다크 테마 설정 (백엔드 로그인 페이지 스타일에서 영감)
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#64b5f6',
    },
    secondary: {
      main: '#81c784',
    },
    background: {
      default: '#0f0f23',
      paper: '#1e1e2e',
    },
    text: {
      primary: '#f0f0f0',
      secondary: '#a0a0b2',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2d2d4f 100%)',
          minHeight: '100vh',
          backgroundAttachment: 'fixed',
        },
      },
    },
  },
})

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedNoteId, setSelectedNoteId] = useState<string>()

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId)
    // 모바일에서는 메모 선택 시 사이드바 닫기
    if (window.innerWidth < 900) {
      setSidebarOpen(false)
    }
  }

  const handleNewNote = () => {
    // TODO: 새 메모 작성 기능 구현
    console.log('새 메모 작성')
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>        <Header 
          onMenuToggle={handleMenuToggle}
          onNewNote={handleNewNote}
        />
        
        <Sidebar 
          isOpen={sidebarOpen}
          onToggle={handleMenuToggle}
          selectedNoteId={selectedNoteId}
          onNoteSelect={handleNoteSelect}
        />        {/* 메인 콘텐츠 영역 */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 8, // AppBar 높이만큼 패딩
            transition: (theme) => theme.transitions.create(['padding-left'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Container maxWidth="lg" sx={{ py: 4 }}>
            {selectedNoteId ? (
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  minHeight: '60vh',
                  background: 'linear-gradient(145deg, #1e1e2e, #262640)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ color: '#f0f0f0' }}>
                  메모 에디터
                </Typography>
                <Typography variant="body2" sx={{ color: '#a0a0b2' }}>
                  선택된 메모 ID: {selectedNoteId}
                </Typography>
                <Typography variant="body2" sx={{ color: '#a0a0b2', mt: 2 }}>
                  에디터 구현 예정...
                </Typography>
              </Paper>
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  minHeight: '60vh',
                  textAlign: 'center'
                }}
              >
                <Typography 
                  variant="h4" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #64b5f6 0%, #81c784 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mb: 2
                  }}
                >
                  🌲 NoteForest
                </Typography>
              </Box>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
