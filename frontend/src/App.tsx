import { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { 
  CssBaseline, 
  Box, 
  Paper,
} from '@mui/material'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { MilkdownEditor } from './components/MilkdownEditor'
import { MilkdownProvider } from '@milkdown/react' // MilkdownProvider 임포트 추가

// 다크 테마 설정
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

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleNewNote = () => {
    // TODO: 새 메모 작성 기능 구현
    console.log('새 메모 작성')
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>        
        <Header 
          onMenuToggle={handleMenuToggle}
          onNewNote={handleNewNote}
        />
        <Sidebar 
          isOpen={sidebarOpen}
          onToggle={handleMenuToggle}
        />

        {/* 메인 콘텐츠 영역 - 에디터 */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 8, // AppBar 높이만큼 패딩
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              flex: 1,
              m: 2,
              background: 'linear-gradient(145deg, #1e1e2e, #262640)',
              borderRadius: 0,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <MilkdownProvider>
              <MilkdownEditor/>
            </MilkdownProvider>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
