import { createTheme } from '@mui/material/styles'

// MUI 테마 타입 확장
declare module '@mui/material/styles' {
  interface Palette {
    milkdown: {
      background: string;
      onBackground: string;
      surface: string;
      surfaceLow: string;
      onSurface: string;
      onSurfaceVariant: string;
      outline: string;
      primary: string;
      secondary: string;
      onSecondary: string;
      inverse: string;
      onInverse: string;
      inlineCode: string;
      error: string;
      hover: string;
      selected: string;
      inlineArea: string;
    };
  }

  interface PaletteOptions {
    milkdown?: {
      background?: string;
      onBackground?: string;
      surface?: string;
      surfaceLow?: string;
      onSurface?: string;
      onSurfaceVariant?: string;
      outline?: string;
      primary?: string;
      secondary?: string;
      onSecondary?: string;
      inverse?: string;
      onInverse?: string;
      inlineCode?: string;
      error?: string;
      hover?: string;
      selected?: string;
      inlineArea?: string;
    };
  }
}

export const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#1b1c1d',
          color: '#f8f9ff',
          minHeight: '100vh',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#32353a',
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: '#191c20',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#111418',
          backgroundImage: 'none',
          borderBottom: '1px solid #32353a',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#111418',
          borderRight: '1px solid #32353a',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#1d2024', // --crepe-color-hover
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#1d2024',
          },
          '&.Mui-selected': {
            backgroundColor: '#32353a',
            '&:hover': {
              backgroundColor: '#383b41',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#32353a',
          color: '#c3c6cf',
          '& .MuiChip-deleteIcon': {
            color: '#8d9199',
            '&:hover': {
              color: '#c3c6cf',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#111418',
          border: '1px solid #32353a',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardError: {
          backgroundColor: '#2d1b1e',
          color: '#ffb4ab',
          border: '1px solid #4a2c2c',
        },
        standardSuccess: {
          backgroundColor: '#1b2d1e',
          color: '#a1c9fd',
          border: '1px solid #2c4a2c',
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#a1c9fd',
    },
    secondary: {
      main: '#3c4858',
    },
    background: {
      default: '#111418',
      paper: '#191c20',
    },
    text: {
      primary: '#f8f9ff',
      secondary: '#e1e2e8',
    },
    error: {
      main: '#ffb4ab',
    },
    // Milkdown용 커스텀 색상들
    milkdown: {
      background: '#111418',
      onBackground: '#f8f9ff',
      surface: '#111418',
      surfaceLow: '#191c20',
      onSurface: '#e1e2e8',
      onSurfaceVariant: '#c3c6cf',
      outline: '#8d9199',
      primary: '#a1c9fd',
      secondary: '#3c4858',
      onSecondary: '#d7e3f8',
      inverse: '#e1e2e8',
      onInverse: '#2e3135',
      inlineCode: '#ffb4ab',
      error: '#ffb4ab',
      hover: '#1d2024',
      selected: '#32353a',
      inlineArea: '#111418',
    },
  },
})
