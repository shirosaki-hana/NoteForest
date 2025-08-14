import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuthStore } from '../stores/authStore';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading, isPasswordSet, init } = useAuthStore();

  // 초기 인증 상태 확인
  if (isLoading && typeof window !== 'undefined') {
    init();
  }
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
        bgcolor='background.default'
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={isPasswordSet ? '/auth/login' : '/auth/setup'}
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
