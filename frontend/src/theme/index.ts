import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a1c9fd',
    },
    secondary: {
      main: '#c3c6cf',
    },
    background: {
      default: '#0d1117',
      paper: '#111418',
    },
    text: {
      primary: '#f8f9ff',
      secondary: '#c3c6cf',
    },
  },
  typography: {
    fontFamily: '"Inter", "Arial", "Helvetica", sans-serif',
    h1: {
      fontFamily: '"Rubik", "Cambria", "Times New Roman", "Times", serif',
    },
    h2: {
      fontFamily: '"Rubik", "Cambria", "Times New Roman", "Times", serif',
    },
    h3: {
      fontFamily: '"Rubik", "Cambria", "Times New Roman", "Times", serif',
    },
    h4: {
      fontFamily: '"Rubik", "Cambria", "Times New Roman", "Times", serif',
    },
    h5: {
      fontFamily: '"Rubik", "Cambria", "Times New Roman", "Times", serif',
    },
    h6: {
      fontFamily: '"Rubik", "Cambria", "Times New Roman", "Times", serif',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Inter", "Arial", "Helvetica", sans-serif',
        },
      },
    },
  },
})
