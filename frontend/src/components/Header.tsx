import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  alpha,
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
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2d2d4f 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          edge="start"
          onClick={onMenuToggle}
          sx={{ 
            mr: 2,
            color: '#f0f0f0',
            '&:hover': {
              backgroundColor: alpha('#fff', 0.1),
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
              fontWeight: 600,
              background: 'linear-gradient(135deg, #64b5f6 0%, #81c784 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
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
            color: '#f0f0f0',
            '&:hover': {
              backgroundColor: alpha('#64b5f6', 0.2),
              color: '#64b5f6',
            }
          }}
        >
          <AddIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
