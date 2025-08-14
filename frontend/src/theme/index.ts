import { createTheme } from '@mui/material/styles';

export function createAppTheme(mode: 'light' | 'dark') {
  return createTheme({
    palette: {
      mode,
      primary: {
        // 라이트: 숲의 녹색, 다크: 밤의 숲 청록색
        main: mode === 'dark' ? '#26a69a' : '#2e7d32',
        light: mode === 'dark' ? '#4db6ac' : '#4caf50',
        dark: mode === 'dark' ? '#00695c' : '#1b5e20',
      },
      secondary: {
        // 라이트: 가을 단풍 오렌지, 다크: 달빛 보라
        main: mode === 'dark' ? '#ab47bc' : '#ff6f00',
        light: mode === 'dark' ? '#ce93d8' : '#ff8f00',
        dark: mode === 'dark' ? '#7b1fa2' : '#e65100',
      },
      background: {
        // 더 자연스러운 배경색
        default: mode === 'dark' ? '#0d1b16' : '#f1f8e9',
        paper: mode === 'dark' ? '#1a2f26' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#e8f5e8' : '#2e2e2e',
        secondary: mode === 'dark' ? '#a5d6a7' : '#616161',
      },
      // 추가 컬러 정의
      success: {
        main: mode === 'dark' ? '#66bb6a' : '#388e3c',
      },
      info: {
        main: mode === 'dark' ? '#4fc3f7' : '#0288d1',
      },
      warning: {
        main: mode === 'dark' ? '#ffb74d' : '#f57c00',
      },
      error: {
        main: mode === 'dark' ? '#ef5350' : '#d32f2f',
      },
    },
    typography: {
      fontFamily: '"Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '3.5rem',
        letterSpacing: '-0.02em',
      },
      h4: {
        fontWeight: 400,
        fontSize: '1.5rem',
        letterSpacing: '0.01em',
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: mode === 'dark' ? '#0d1b16' : '#f1f8e9',
            color: mode === 'dark' ? '#e8f5e8' : '#2e2e2e',
            boxShadow: 'none',
            elevation: 0,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          // 스크롤바 스타일링 - 다크/라이트 테마에 맞게 조화
          '*': {
            // 웹킷 기반 스크롤바 (Chrome, Safari, Edge, Electron)
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: mode === 'dark' ? '#0d1b16' : '#f1f8e9',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: mode === 'dark' ? '#2d5a4f' : '#81c784',
              borderRadius: '4px',
              border: `1px solid ${mode === 'dark' ? '#1a2f26' : '#e8f5e8'}`,
              '&:hover': {
                background: mode === 'dark' ? '#26a69a' : '#66bb6a',
              },
              '&:active': {
                background: mode === 'dark' ? '#00695c' : '#4caf50',
              },
            },
            '&::-webkit-scrollbar-corner': {
              background: mode === 'dark' ? '#0d1b16' : '#f1f8e9',
            },
          },
          // Firefox용 스크롤바 스타일링
          html: {
            scrollbarWidth: 'thin',
            scrollbarColor:
              mode === 'dark'
                ? '#2d5a4f #0d1b16' // thumb background
                : '#81c784 #f1f8e9', // thumb background
          },
          // 전역 body 스타일
          body: {
            // Electron에서 더 부드러운 스크롤링
            scrollBehavior: 'smooth',
            // 선택 영역 색상도 테마에 맞게
            '& ::selection': {
              backgroundColor: mode === 'dark' ? '#26a69a40' : '#2e7d3240',
              color: mode === 'dark' ? '#e8f5e8' : '#2e2e2e',
            },
          },
        },
      },
    },
  });
}

export const theme = createAppTheme('dark');
