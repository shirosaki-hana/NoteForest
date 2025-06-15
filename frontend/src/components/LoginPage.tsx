import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Paper, 
  Alert,
  CircularProgress 
} from '@mui/material';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, setupPassword, isPasswordSet } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError('');

    const result = isPasswordSet 
      ? await login(password)
      : await setupPassword(password);
    
    if (!result.success) {
      setError(result.error || '오류가 발생했습니다.');
    }
    
    setLoading(false);
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      bgcolor="background.default"
      p={2}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            🌲 NoteForest
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {isPasswordSet ? '로그인' : '비밀번호 설정'}
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={isPasswordSet ? "비밀번호" : "새 비밀번호 (8자 이상)"}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            helperText={!isPasswordSet ? "처음 접속하시는 군요! 비밀번호를 설정해주세요." : ""}
          />
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading || !password.trim()}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              isPasswordSet ? '로그인' : '비밀번호 설정'
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
