import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import NewNoteConfirmDialog from './NewNoteConfirmDialog';

interface HeaderProps {
  onMenuToggle: () => void;
  onNewNote?: () => void;
  onSaveNote?: () => void;
  saving?: boolean;
}

export default function Header({ onMenuToggle, onNewNote, onSaveNote, saving = false }: HeaderProps) {
  const { logout } = useAuth();
  const [showNewNoteDialog, setShowNewNoteDialog] = useState(false);

  const handleNewNoteClick = () => {
    setShowNewNoteDialog(true);
  };

  const handleNewNoteConfirm = () => {
    setShowNewNoteDialog(false);
    onNewNote?.();
  };

  const handleNewNoteCancel = () => {
    setShowNewNoteDialog(false);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#111418', // surface color
        borderBottom: '1px solid #32353a', // divider
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important' }}>
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          edge="start"
          onClick={onMenuToggle}
          sx={{ 
            mr: 2,
            color: '#e1e2e8', // on-surface color
            '&:hover': {
              backgroundColor: '#1d2024', // hover color
            }
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{ 
              fontFamily: 'Rubik, Cambria, "Times New Roman", Times, serif',
              fontWeight: 600,
              color: '#a1c9fd', // primary color
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            🌲 NoteForest
          </Typography>
        </Box>        <IconButton
          color="inherit"
          aria-label="save note"
          onClick={onSaveNote}
          disabled={saving}
          sx={{ 
            mr: 1,
            color: saving ? '#8d9199' : '#e1e2e8', // on-surface color, muted when saving
            '&:hover': {
              backgroundColor: saving ? 'transparent' : '#1d2024', // hover color
              color: saving ? '#8d9199' : '#9ccc65', // success color
            },
            '&:disabled': {
              color: '#8d9199',
            }
          }}
        >
          {saving ? (
            <CircularProgress 
              size={20} 
              sx={{ 
                color: '#8d9199' 
              }} 
            />
          ) : (
            <SaveIcon />
          )}
        </IconButton>        <IconButton
          color="inherit"
          aria-label="new note"
          onClick={handleNewNoteClick}
          sx={{ 
            mr: 1,
            color: '#e1e2e8', // on-surface color
            '&:hover': {
              backgroundColor: '#1d2024', // hover color
              color: '#a1c9fd', // primary color
            }
          }}
        >
          <AddIcon />
        </IconButton>

        <IconButton
          color="inherit"
          aria-label="logout"
          onClick={logout}
          sx={{ 
            color: '#e1e2e8', // on-surface color
            '&:hover': {
              backgroundColor: '#1d2024', // hover color
              color: '#f48fb1', // secondary color
            }
          }}
        >
          <LogoutIcon />        </IconButton>
      </Toolbar>
      
      <NewNoteConfirmDialog
        open={showNewNoteDialog}
        onConfirm={handleNewNoteConfirm}
        onCancel={handleNewNoteCancel}
      />
    </AppBar>
  );
}
