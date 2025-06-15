import { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import NoteEditor from './components/NoteEditor'
import NotificationSnackbar from './components/NotificationSnackbar'
import PWAUpdatePrompt from './components/PWAUpdatePrompt'
import { theme } from './theme'
import { useNoteManagement } from './hooks/useNoteManagement'
import { useSnackbar } from './hooks/useSnackbar'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // 스낵바 관리
  const { snackbarOpen, snackbarMessage, snackbarSeverity, showSnackbar, handleSnackbarClose } = useSnackbar()
  
  // 노트 관리
  const {
    selectedNoteId,
    noteTitle,
    noteTags,
    noteContent,
    editorKey,
    saving,
    loading,
    editorRef,
    handleNewNote,
    handleSaveNote,
    handleNoteSelect,
    handleTitleChange,
    handleTagsChange,
  } = useNoteManagement(showSnackbar)
  
  // 키보드 단축키
  useKeyboardShortcuts({
    onSave: handleSaveNote,
    saving,
  })

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Header 
          onMenuToggle={handleMenuToggle}
          onNewNote={handleNewNote}
          onSaveNote={handleSaveNote}
          saving={saving}
        />
        
        <Sidebar 
          isOpen={sidebarOpen}
          onToggle={handleMenuToggle}
          selectedNoteId={selectedNoteId}
          onNoteSelect={handleNoteSelect}
        />

        <NoteEditor
          noteTitle={noteTitle}
          noteTags={noteTags}
          noteContent={noteContent}
          editorKey={editorKey}
          loading={loading}
          onTitleChange={handleTitleChange}
          onTagsChange={handleTagsChange}
          editorRef={editorRef}
        />
          <NotificationSnackbar
          open={snackbarOpen}
          message={snackbarMessage}
          severity={snackbarSeverity}
          onClose={handleSnackbarClose}
        />
        
        <PWAUpdatePrompt />
      </Box>
    </ThemeProvider>
  )
}

export default App
