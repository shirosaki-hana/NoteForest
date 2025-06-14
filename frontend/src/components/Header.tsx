import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface HeaderProps {
  onMenuToggle: () => void;
  onNewNote?: () => void;
}

export default function Header({ onMenuToggle, onNewNote }: HeaderProps) {
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
        </Box>

        <IconButton
          color="inherit"
          aria-label="new note"
          onClick={onNewNote}
          sx={{ 
            color: '#e1e2e8', // on-surface color
            '&:hover': {
              backgroundColor: '#1d2024', // hover color
              color: '#a1c9fd', // primary color
            }
          }}
        >
          <AddIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
