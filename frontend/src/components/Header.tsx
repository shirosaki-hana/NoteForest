import { AppBar, Toolbar, Typography, IconButton, Box, CircularProgress } from '@mui/material';
import {
  Menu as MenuIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useState } from 'react';
import NewNoteConfirmDialog from './NewNoteConfirmDialog';
import { useUiStore } from '../stores/uiStore';
import { useSnackbarStore } from '../stores/snackbarStore';
import { useNotesStore } from '../stores/notesStore';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {}

export default function Header({}: HeaderProps) {
  const logout = useAuthStore(state => state.logout);
  const { mode, toggleMode } = useThemeStore();
  const [showNewNoteDialog, setShowNewNoteDialog] = useState(false);
  const navigate = useNavigate();
  const { isEditMode, toggleSidebar, toggleEditMode } = useUiStore();
  const { show } = useSnackbarStore();
  const { saving, newNote, save } = useNotesStore(state => ({
    saving: state.saving,
    newNote: state.newNote,
    save: state.save,
  }));

  const handleNewNoteClick = () => {
    setShowNewNoteDialog(true);
  };

  const handleNewNoteConfirm = () => {
    setShowNewNoteDialog(false);
    const id = newNote(show);
    navigate(`/notes/${id}`);
  };

  const handleNewNoteCancel = () => {
    setShowNewNoteDialog(false);
  };

  return (
    <AppBar
      position='fixed'
      sx={{
        zIndex: theme => theme.zIndex.drawer + 1,
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important' }}>
        <IconButton
          color='inherit'
          aria-label='toggle sidebar'
          edge='start'
          onClick={toggleSidebar}
          sx={{
            mr: 2,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography
            variant='h6'
            noWrap
            component='div'
            sx={{
              fontFamily: 'Rubik, Cambria, "Times New Roman", Times, serif',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            NoteForest
          </Typography>
        </Box>

        <IconButton
          color='inherit'
          aria-label={isEditMode ? 'switch to preview mode' : 'switch to edit mode'}
          onClick={toggleEditMode}
          sx={{
            mr: 1,
          }}
        >
          {isEditMode ? <VisibilityIcon /> : <EditIcon />}
        </IconButton>

        <IconButton
          color='inherit'
          aria-label={mode === 'dark' ? 'switch to light mode' : 'switch to dark mode'}
          onClick={toggleMode}
          sx={{
            mr: 1,
          }}
        >
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

        <IconButton
          color='inherit'
          aria-label='save note'
          onClick={() => save(show)}
          disabled={saving || !isEditMode} // 읽기 모드에서는 저장 비활성화
          sx={{
            mr: 1,
          }}
        >
          {saving ? <CircularProgress size={20} /> : <SaveIcon />}
        </IconButton>

        <IconButton
          color='inherit'
          aria-label='new note'
          onClick={handleNewNoteClick}
          sx={{
            mr: 1,
          }}
        >
          <AddIcon />
        </IconButton>

        <IconButton color='inherit' aria-label='logout' onClick={logout}>
          <LogoutIcon />
        </IconButton>
      </Toolbar>

      <NewNoteConfirmDialog
        open={showNewNoteDialog}
        onConfirm={handleNewNoteConfirm}
        onCancel={handleNewNoteCancel}
      />
    </AppBar>
  );
}
