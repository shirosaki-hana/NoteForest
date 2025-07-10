import { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Box, CircularProgress } from '@mui/material'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ThemeProvider as AppThemeProvider, useTheme } from './hooks/useTheme'
import LoginPage from './components/LoginPage'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import NoteEditor from './components/NoteEditor'
import NotificationSnackbar from './components/NotificationSnackbar'
import DraftRestoreDialog from './components/DraftRestoreDialog'
import { createAppTheme } from './theme'
import { useNoteManagement } from './hooks/useNoteManagement'
import { useSnackbar } from './hooks/useSnackbar'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(true)
  
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
    showDraftDialog,
    draftData,
    handleNewNote,
    handleSaveNote,
    handleNoteSelect,
    handleTitleChange,
    handleTagsChange,
    handleContentChange,
    handleRestoreDraft,
    handleDiscardDraft,
    handleCancelDraftDialog,
  } = useNoteManagement(showSnackbar)
  
  // 키보드 단축키
  useKeyboardShortcuts({
    onSave: handleSaveNote,
    saving,
  })

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        bgcolor="background.default"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Header 
          onMenuToggle={handleMenuToggle}
          onNewNote={handleNewNote}
          onSaveNote={handleSaveNote}
          saving={saving}
          isEditMode={isEditMode}
          onToggleEditMode={handleToggleEditMode}
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
          isEditMode={isEditMode}
          onTitleChange={handleTitleChange}
          onTagsChange={handleTagsChange}
          onContentChange={handleContentChange}
        />        
        <NotificationSnackbar
          open={snackbarOpen}
          message={snackbarMessage}
          severity={snackbarSeverity}
          onClose={handleSnackbarClose}
        />
        
        <DraftRestoreDialog
          open={showDraftDialog}
          draftData={draftData}
          onRestore={handleRestoreDraft}
          onDiscard={handleDiscardDraft}
          onCancel={handleCancelDraftDialog}
        />
      </Box>
    </>
  )
}

function ThemedApp() {
  const { mode } = useTheme();
  const theme = createAppTheme(mode);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

function App() {
  return (
    <AppThemeProvider>
      <ThemedApp />
    </AppThemeProvider>
  )
}

export default App
