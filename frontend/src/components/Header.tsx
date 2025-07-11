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
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useState } from 'react';
import NewNoteConfirmDialog from './NewNoteConfirmDialog';

interface HeaderProps {
  onMenuToggle: () => void;
  onNewNote?: () => void;
  onSaveNote?: () => void;
  saving?: boolean;
  isEditMode?: boolean;
  onToggleEditMode?: () => void;
}

export default function Header({ 
  onMenuToggle, 
  onNewNote, 
  onSaveNote, 
  saving = false, 
  isEditMode = true, 
  onToggleEditMode 
}: HeaderProps) {
  const { logout } = useAuth();
  const { mode, toggleMode } = useTheme();
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
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            NoteForest
          </Typography>
        </Box>        
        
        <IconButton
          color="inherit"
          aria-label={isEditMode ? "switch to preview mode" : "switch to edit mode"}
          onClick={onToggleEditMode}
          sx={{ 
            mr: 1,
          }}
        >
          {isEditMode ? <VisibilityIcon /> : <EditIcon />}
        </IconButton>

        <IconButton
          color="inherit"
          aria-label={mode === 'dark' ? "switch to light mode" : "switch to dark mode"}
          onClick={toggleMode}
          sx={{ 
            mr: 1,
          }}
        >
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

        <IconButton
          color="inherit"
          aria-label="save note"
          onClick={onSaveNote}
          disabled={saving || !isEditMode} // 읽기 모드에서는 저장 비활성화
          sx={{ 
            mr: 1,
          }}
        >
          {saving ? (
            <CircularProgress 
              size={20} 
            />
          ) : (
            <SaveIcon />
          )}
        </IconButton>        
        
        <IconButton
          color="inherit"
          aria-label="new note"
          onClick={handleNewNoteClick}
          sx={{ 
            mr: 1,
          }}
        >
          <AddIcon />
        </IconButton>

        <IconButton
          color="inherit"
          aria-label="logout"
          onClick={logout}
        >
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
