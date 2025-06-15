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

  interface Theme {
    milkdownStyles: {
      [key: string]: any;
    };
  }

  interface ThemeOptions {
    milkdownStyles?: {
      [key: string]: any;
    };
  }
}

export const theme = createTheme({
  // Milkdown 커스텀 스타일 정의
  milkdownStyles: {
    '.milkdown': {
      '& .ProseMirror': {
        padding: '2px 15px',
        // 자동 개행을 위한 스타일 추가
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        maxWidth: '100%',
        overflow: 'hidden',
        '& *::selection': {
          background: 'var(--crepe-color-selected)',
        },
        '& .ProseMirror-selectednode': {
          background: 'color-mix(in srgb, var(--crepe-color-selected), transparent 60%)',
          outline: 'none',
          '&::selection, & ::selection': {
            background: 'transparent',
          },
        },
        '&[data-dragging="true"]': {
          '& .ProseMirror-selectednode, &::selection, & *::selection': {
            background: 'transparent',
          },
          '& input::selection': {
            background: 'var(--crepe-color-selected)',
          },
        },
        '& img': {
          verticalAlign: 'bottom',
          maxWidth: '100%',
          '&.ProseMirror-selectednode': {
            background: 'none',
            outline: '2px solid var(--crepe-color-primary)',
          },
        },
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          fontFamily: 'var(--crepe-font-title)',
          fontWeight: 400,
          padding: '2px 0',
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        },
        '& h1': {
          fontSize: '42px',
          lineHeight: '50px',
          marginTop: '32px',
        },
        '& h2': {
          fontSize: '36px',
          lineHeight: '44px',
          marginTop: '28px',
        },
        '& h3': {
          fontSize: '32px',
          lineHeight: '40px',
          marginTop: '24px',
        },
        '& h4': {
          fontSize: '28px',
          lineHeight: '36px',
          marginTop: '20px',
        },
        '& h5': {
          fontSize: '24px',
          lineHeight: '32px',
          marginTop: '16px',
        },
        '& h6': {
          fontSize: '18px',
          fontWeight: 700,
          lineHeight: '28px',
          marginTop: '16px',
        },
        '& p': {
          fontSize: '16px',
          lineHeight: '24px',
          padding: '4px 0',
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        },
        '& code': {
          color: 'var(--crepe-color-inline-code)',
          background: 'color-mix(in srgb, var(--crepe-color-inline-area), transparent 40%)',
          fontFamily: 'var(--crepe-font-code)',
          padding: '0 2px',
          borderRadius: '4px',
          fontSize: '87.5%',
          display: 'inline-block',
          lineHeight: 1.4286,
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        },
        '& a': {
          color: 'var(--crepe-color-primary)',
          textDecoration: 'underline',
        },
        '& pre': {
          background: 'color-mix(in srgb, var(--crepe-color-inline-area), transparent 40%)',
          padding: '10px',
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        },
        '& blockquote': {
          position: 'relative',
          paddingLeft: '40px',
          paddingTop: 0,
          paddingBottom: 0,
          boxSizing: 'content-box',
          margin: '4px 0',
          '&::before': {
            content: '""',
            width: '4px',
            left: 0,
            top: '4px',
            bottom: '4px',
            position: 'absolute',
            background: 'var(--crepe-color-selected)',
            borderRadius: '100px',
          },
          '& hr': {
            marginBottom: '16px',
          },
        },
        '& hr': {
          border: 'none',
          backgroundColor: 'color-mix(in srgb, var(--crepe-color-outline), transparent 80%)',
          backgroundClip: 'content-box',
          padding: '6px 0',
          height: '13px',
          position: 'relative',
          '&.ProseMirror-selectednode': {
            outline: 'none',
            backgroundColor: 'color-mix(in srgb, var(--crepe-color-outline), transparent 20%)',
            backgroundClip: 'content-box',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              right: 0,
              backgroundColor: 'color-mix(in srgb, var(--crepe-color-outline), transparent 80%)',
              pointerEvents: 'none',
            },
          },
        },
        '& ul, & ol': {
          padding: 0,
        },
      },
    },
  },
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
