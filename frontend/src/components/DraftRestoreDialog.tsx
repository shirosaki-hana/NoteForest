import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { RestorePageOutlined, DeleteOutline } from '@mui/icons-material';

interface DraftData {
  title: string;
  tags: string[];
  content: string;
  lastModified: number;
}

interface DraftRestoreDialogProps {
  open: boolean;
  draftData: DraftData | null;
  onRestore: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export default function DraftRestoreDialog({
  open,
  draftData,
  onRestore,
  onDiscard,
  onCancel,
}: DraftRestoreDialogProps) {
  if (!draftData) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getContentPreview = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    const preview = lines.slice(0, 3).join(' ').substring(0, 100);
    return preview + (preview.length >= 100 ? '...' : '');
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth='sm'
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <DialogTitle sx={{ color: 'text.primary', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RestorePageOutlined sx={{ color: 'primary.main' }} />
          편집 중인 내용 발견
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant='body2' sx={{ color: 'text.secondary', mb: 2 }}>
          이 노트에 저장되지 않은 편집 내용이 있습니다. 복원하시겠습니까?
        </Typography>

        <Box
          sx={{
            backgroundColor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px',
            padding: '12px',
            mb: 2,
          }}
        >
          {/* 제목 */}
          <Typography
            variant='subtitle2'
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              mb: 1,
              fontSize: '0.95rem',
            }}
          >
            {draftData.title || '제목 없음'}
          </Typography>

          {/* 태그 */}
          {draftData.tags.length > 0 && (
            <Box sx={{ mb: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {draftData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size='small'
                  sx={{
                    height: '18px',
                    fontSize: '0.7rem',
                    backgroundColor: 'action.hover',
                    color: 'text.secondary',
                  }}
                />
              ))}
            </Box>
          )}

          {/* 내용 미리보기 */}
          <Typography
            variant='body2'
            sx={{
              color: 'text.secondary',
              fontSize: '0.85rem',
              lineHeight: 1.4,
              fontStyle: draftData.content ? 'normal' : 'italic',
            }}
          >
            {draftData.content ? getContentPreview(draftData.content) : '내용 없음'}
          </Typography>

          {/* 수정 시간 */}
          <Typography
            variant='caption'
            sx={{
              color: 'text.disabled',
              display: 'block',
              mt: 1,
              fontSize: '0.75rem',
            }}
          >
            마지막 편집: {formatDate(draftData.lastModified)}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onCancel}
          sx={{
            color: 'text.disabled',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          취소
        </Button>
        <Button
          onClick={onDiscard}
          startIcon={<DeleteOutline />}
          sx={{
            color: 'error.main',
            '&:hover': {
              backgroundColor: theme => theme.palette.error.main + '1A',
            },
          }}
        >
          삭제
        </Button>
        <Button
          onClick={onRestore}
          startIcon={<RestorePageOutlined />}
          variant='contained'
          sx={{
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          복원
        </Button>
      </DialogActions>
    </Dialog>
  );
}
