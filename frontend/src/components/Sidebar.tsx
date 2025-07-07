import { Drawer, Box } from '@mui/material'
import { useNoteList } from '../hooks/useNoteList'
import { useNoteDelete } from '../hooks/useNoteDelete'
import { useSnackbar } from '../hooks/useSnackbar'
import SidebarHeader from './SidebarHeader'
import NoteListContent from './NoteListContent'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import NotificationSnackbar from './NotificationSnackbar'

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedNoteId?: string;
  onNoteSelect?: (noteId: string) => void;
}

const SIDEBAR_WIDTH = 340

export default function Sidebar({ isOpen, onToggle, selectedNoteId, onNoteSelect }: SidebarProps) {
  // 메모 목록 관리
  const { notes, loading, error, refetchNotes } = useNoteList(isOpen)
  
  // 스낵바 관리
  const { snackbarOpen, snackbarMessage, snackbarSeverity, showSnackbar, handleSnackbarClose } = useSnackbar()
  
  // 삭제 기능 관리
  const {
    deleteDialogOpen,
    noteToDelete,
    deleting,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
  } = useNoteDelete({
    selectedNoteId,
    onNoteSelect,
    onDeleteSuccess: refetchNotes,
    showMessage: showSnackbar,
  })

  const drawerContent = (
    <Box sx={{ 
      width: SIDEBAR_WIDTH, 
    }}>
      <SidebarHeader 
        notesCount={notes.length}
        onClose={onToggle}
      />

      {/* 메모 목록 */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <NoteListContent
          loading={loading}
          error={error}
          notes={notes}
          selectedNoteId={selectedNoteId}
          onNoteSelect={onNoteSelect}
          onNoteDelete={handleDeleteClick}
        />
      </Box>
    </Box>
  )

  return (
    <>
      {/* 모든 화면 크기에서 임시 드로어 (오버레이 방식) */}
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true, // 성능 향상을 위해
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: SIDEBAR_WIDTH,
            overflow: 'auto',
            border: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* 삭제 확인 다이얼로그 */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        note={noteToDelete}
        deleting={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />      {/* 스낵바 */}
      <NotificationSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />
    </>
  )
}
