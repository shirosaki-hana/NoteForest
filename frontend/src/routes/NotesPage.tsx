import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import NoteEditor from '../components/NoteEditor';
// Draft 기능 제거됨
import NotificationSnackbar from '../components/NotificationSnackbar';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
// import { useUiStore } from '../stores/uiStore';
import { useSnackbarStore } from '../stores/snackbarStore';
import { useNotesStore } from '../stores/notesStore';

export default function NotesPage() {
  const { id } = useParams();

  const { open, message, severity, show, hide } = useSnackbarStore();
  const { selectedNoteId, save, selectNote } = useNotesStore();

  useKeyboardShortcuts({ onSave: () => save(show), saving: false });

  useEffect(() => {
    if (id && id !== selectedNoteId) {
      selectNote(id, show);
    }
  }, [id]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header />

      <Sidebar />

      <NoteEditor />

      <NotificationSnackbar open={open} message={message} severity={severity} onClose={hide} />

      {/* DraftRestoreDialog 제거됨 */}
    </Box>
  );
}
