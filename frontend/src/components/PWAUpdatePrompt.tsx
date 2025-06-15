import { useEffect, useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';

export default function PWAUpdatePrompt() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    // Service Worker 등록 확인
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      // 오프라인 상태 확인
      const checkOfflineReady = () => {
        if (!navigator.onLine) {
          setOfflineReady(true);
        }
      };

      window.addEventListener('offline', checkOfflineReady);
      window.addEventListener('online', () => setOfflineReady(false));

      return () => {
        window.removeEventListener('offline', checkOfflineReady);
        window.removeEventListener('online', () => setOfflineReady(false));
      };
    }
  }, []);

  return (
    <>
      <Snackbar
        open={offlineReady}
        autoHideDuration={6000}
        onClose={() => setOfflineReady(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setOfflineReady(false)}>
          오프라인 모드에서 실행 중입니다.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showUpdatePrompt}
        onClose={() => setShowUpdatePrompt(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ width: '100%', maxWidth: '400px' }}
      >
        <Alert
          severity="info"
          onClose={() => setShowUpdatePrompt(false)}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => window.location.reload()}
              sx={{ fontWeight: 'bold' }}
            >
              업데이트
            </Button>
          }
        >
          새로운 버전이 사용 가능합니다.
        </Alert>
      </Snackbar>
    </>
  );
}
