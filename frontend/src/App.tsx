import { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { 
  CssBaseline, 
  Box,
} from '@mui/material'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { MilkdownEditor } from './components/MilkdownEditor'
import { MilkdownProvider } from '@milkdown/react'

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
    },
    MuiAlert: {
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
})

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedNoteId, setSelectedNoteId] = useState<string>('')

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleNewNote = () => {
    // TODO: 새 메모 작성 기능 구현
    console.log('새 메모 작성')
  }

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId)
    // TODO: 선택된 메모를 에디터에 로드
    console.log('메모 선택:', noteId)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>        
        <Header 
          onMenuToggle={handleMenuToggle}
          onNewNote={handleNewNote}
        />        <Sidebar 
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
        >
          <MilkdownProvider>
            <MilkdownEditor/>
          </MilkdownProvider>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
