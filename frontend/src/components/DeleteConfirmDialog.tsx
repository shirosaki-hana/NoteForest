import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'
import type { Note } from '../types/api'

interface DeleteConfirmDialogProps {
  open: boolean
  note: Note | null
  deleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmDialog({
  open,
  note,
  deleting,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          backgroundColor: '#111418', // surface color
          border: '1px solid #32353a', // divider
          borderRadius: 3,
        }
      }}
    >
      <DialogTitle sx={{ color: '#f8f9ff', pb: 1 }}> {/* on-background */}
        메모 삭제
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: '#c3c6cf', mb: 2 }}> {/* on-surface-variant */}
          <strong style={{ color: '#f8f9ff' }}>"{note?.title || '제목 없음'}"</strong> 메모를 정말 삭제하시겠습니까?
        </DialogContentText>
        <DialogContentText sx={{ color: '#ffb4ab', fontSize: '0.875rem' }}> {/* error color */}
          이 작업은 되돌릴 수 없습니다.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button 
          onClick={onCancel}
          sx={{ 
            color: '#c3c6cf', // on-surface-variant
            '&:hover': {
              backgroundColor: '#1d2024', // hover color
            }
          }}
        >
          취소
        </Button>
        <Button
          onClick={onConfirm}
          disabled={deleting}
          sx={{
            color: '#ffb4ab', // error color
            '&:hover': {
              backgroundColor: 'rgba(255, 180, 171, 0.1)', // error with opacity
            },
            '&:disabled': {
              color: '#8d9199', // outline color
            }
          }}
        >
          {deleting ? '삭제 중...' : '삭제'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
