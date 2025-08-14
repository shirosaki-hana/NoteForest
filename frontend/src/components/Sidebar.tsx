import { Drawer, Box } from '@mui/material';
import { useNoteList } from '../hooks/useNoteList';
import { useNoteDelete } from '../hooks/useNoteDelete';
import { useSnackbarStore } from '../stores/snackbarStore';
import { useUiStore } from '../stores/uiStore';
import { useNotesStore } from '../stores/notesStore';
import SidebarHeader from './SidebarHeader';
import NoteListContent from './NoteListContent';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import NotificationSnackbar from './NotificationSnackbar';

interface SidebarProps {}

const SIDEBAR_WIDTH = 340;

export default function Sidebar({}: SidebarProps) {
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const { selectedNoteId } = useNotesStore(state => ({ selectedNoteId: state.selectedNoteId }));
  // 메모 목록 관리
  const { notes, loading, error, refetchNotes } = useNoteList(sidebarOpen);

  // 스낵바 관리
  const { open, message, severity, show, hide } = useSnackbarStore();

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
    onNoteSelect: useNotesStore.getState().selectNote.bind(null) as any,
    onDeleteSuccess: refetchNotes,
    showMessage: show,
  });

  const drawerContent = (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
      }}
    >
      <SidebarHeader notesCount={notes.length} onClose={toggleSidebar} />

      {/* 메모 목록 */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <NoteListContent
          loading={loading}
          error={error}
          notes={notes}
          selectedNoteId={selectedNoteId}
          onNoteSelect={noteId => useNotesStore.getState().selectNote(noteId, show)}
          onNoteDelete={handleDeleteClick}
        />
      </Box>
    </Box>
  );

  return (
    <>
      {/* 모든 화면 크기에서 임시 드로어 (오버레이 방식) */}
      <Drawer
        variant='temporary'
        open={sidebarOpen}
        onClose={toggleSidebar}
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
      />{' '}
      {/* 스낵바 */}
      <NotificationSnackbar
        open={open}
        message={message}
        severity={severity}
        onClose={hide}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />
    </>
  );
}
