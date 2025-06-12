import { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  Chip,
  IconButton,
  Divider,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Note as NoteIcon,
  Schedule as ScheduleIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { Note } from '../types/api';
import { getNoteList, deleteNote } from '../utils/api';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedNoteId?: string;
  onNoteSelect?: (noteId: string) => void;
}

const SIDEBAR_WIDTH = 320;

export default function Sidebar({ isOpen, onToggle, selectedNoteId, onNoteSelect }: SidebarProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 삭제 관련 상태
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // 메모 목록 로드
  const loadNotes = async () => {
    try {
      setLoading(true);
      const response = await getNoteList();
      if (response.success) {
        setNotes(response.data);
        setError(null);
      } else {
        setError(response.error || '메모를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isOpen) {
      loadNotes();
    }
  }, [isOpen]);

  // 삭제 다이얼로그 열기
  const handleDeleteClick = (note: Note, event: React.MouseEvent) => {
    event.stopPropagation(); // 메모 선택 이벤트 방지
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };
  // 삭제 확인
  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;

    try {
      setDeleting(true);
      const response = await deleteNote(noteToDelete.uuid);
      
      if (response.success) {
        // 삭제된 메모가 현재 선택된 메모라면 선택 해제
        if (selectedNoteId === noteToDelete.uuid) {
          onNoteSelect?.('');
        }
        
        // 백엔드와 동기화를 위해 메모 목록 다시 로드
        await loadNotes();
        
        setSnackbarMessage('메모가 성공적으로 삭제되었습니다.');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage(response.error || '메모 삭제에 실패했습니다.');
        setSnackbarSeverity('error');
      }
    } catch (err) {
      setSnackbarMessage('네트워크 오류가 발생했습니다.');
      setSnackbarSeverity('error');
      console.error('Failed to delete note:', err);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
      setSnackbarOpen(true);
    }
  };

  // 삭제 취소
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  // 스낵바 닫기
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return '어제';
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    }
  };

  const drawerContent = (
    <Box sx={{ 
      width: SIDEBAR_WIDTH, 
      height: '100%',
      background: 'linear-gradient(145deg, #1e1e2e, #262640)',
      color: '#f0f0f0'
    }}>
      {/* 헤더 */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NoteIcon sx={{ color: '#64b5f6' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            메모 목록
          </Typography>
        </Box>
        <IconButton 
          onClick={onToggle}
          sx={{ 
            color: '#a0a0b2',
            '&:hover': { 
              backgroundColor: alpha('#fff', 0.05),
              color: '#f0f0f0'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* 메모 개수 */}
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant="body2" sx={{ color: '#a0a0b2' }}>
          총 {notes.length}개의 메모
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      {/* 메모 목록 */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography sx={{ color: '#a0a0b2' }}>로딩 중...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography sx={{ color: '#ef5350' }}>{error}</Typography>
          </Box>
        ) : notes.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography sx={{ color: '#a0a0b2' }}>메모가 없습니다.</Typography>
          </Box>
        ) : (          <List sx={{ p: 0 }}>
            {notes.map((note) => (
              <ListItem key={note.uuid} disablePadding>
                <ListItemButton
                  selected={selectedNoteId === note.uuid}
                  onClick={() => onNoteSelect?.(note.uuid)}
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, rgba(100, 181, 246, 0.15), rgba(129, 199, 132, 0.15))',
                      borderLeft: '3px solid #64b5f6',
                    },
                    '&:hover': {
                      backgroundColor: alpha('#fff', 0.05),
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          color: '#f0f0f0', 
                          fontWeight: 500,
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {note.title || '제목 없음'}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        {/* 태그들 */}
                        {note.tags.length > 0 && (
                          <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {note.tags.slice(0, 3).map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.75rem',
                                  backgroundColor: alpha('#64b5f6', 0.2),
                                  color: '#90caf9',
                                  '& .MuiChip-label': { px: 1 }
                                }}
                              />
                            ))}
                            {note.tags.length > 3 && (
                              <Chip
                                label={`+${note.tags.length - 3}`}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.75rem',
                                  backgroundColor: alpha('#a0a0b2', 0.2),
                                  color: '#a0a0b2',
                                  '& .MuiChip-label': { px: 1 }
                                }}
                              />
                            )}
                          </Box>
                        )}
                        
                        {/* 날짜 정보 */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ScheduleIcon sx={{ fontSize: '0.75rem', color: '#7a7a8a' }} />
                          <Typography 
                            variant="caption" 
                            sx={{ color: '#7a7a8a' }}
                          >
                            {formatDate(note.updatedAt)}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  
                  {/* 삭제 버튼 */}
                  <IconButton
                    size="small"
                    onClick={(e) => handleDeleteClick(note, e)}
                    sx={{
                      ml: 1,
                      color: '#7a7a8a',
                      opacity: 0.7,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        color: '#ef5350',
                        backgroundColor: alpha('#ef5350', 0.1),
                        opacity: 1,
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );

  return (
    <>      {/* 모든 화면 크기에서 임시 드로어 (오버레이 방식) */}
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true, // 성능 향상을 위해
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: SIDEBAR_WIDTH,
            border: 'none',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, #1e1e2e, #262640)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ color: '#f0f0f0', pb: 1 }}>
          메모 삭제
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#a0a0b2', mb: 2 }}>
            <strong style={{ color: '#f0f0f0' }}>"{noteToDelete?.title || '제목 없음'}"</strong> 메모를 정말 삭제하시겠습니까?
          </DialogContentText>
          <DialogContentText sx={{ color: '#ef5350', fontSize: '0.875rem' }}>
            이 작업은 되돌릴 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handleDeleteCancel}
            sx={{ 
              color: '#a0a0b2',
              '&:hover': {
                backgroundColor: alpha('#fff', 0.05),
              }
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            disabled={deleting}
            sx={{
              color: '#ef5350',
              '&:hover': {
                backgroundColor: alpha('#ef5350', 0.1),
              },
              '&:disabled': {
                color: '#7a7a8a',
              }
            }}
          >
            {deleting ? '삭제 중...' : '삭제'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 스낵바 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            background: snackbarSeverity === 'success' 
              ? 'linear-gradient(135deg, #4caf50, #388e3c)'
              : 'linear-gradient(135deg, #ef5350, #d32f2f)',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff',
            },
            '& .MuiAlert-action': {
              color: '#fff',
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
