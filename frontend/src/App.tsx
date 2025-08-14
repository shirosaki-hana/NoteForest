import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useThemeStore } from './stores/themeStore';
import { createAppTheme } from './theme';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './routes/ProtectedRoute';
import NotesPage from './routes/NotesPage';
import NewNoteRedirect from './routes/NewNoteRedirect';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/notes/new' replace />} />
        <Route path='/auth/login' element={<LoginPage />} />
        <Route path='/auth/setup' element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/notes/new' element={<NewNoteRedirect />} />
          <Route path='/notes/:id' element={<NotesPage />} />
        </Route>
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function ThemedApp() {
  const { mode } = useThemeStore();
  const theme = createAppTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

function App() {
  return <ThemedApp />;
}

export default App;
