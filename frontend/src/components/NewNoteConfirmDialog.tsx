import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'

interface NewNoteConfirmDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function NewNoteConfirmDialog({
  open,
  onConfirm,
  onCancel,
}: NewNoteConfirmDialogProps) {
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
        새 메모 생성
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: '#c3c6cf', mb: 2 }}> {/* on-surface-variant */}
          새 메모를 생성하시겠습니까?
        </DialogContentText>
        <DialogContentText sx={{ color: '#ffb4ab', fontSize: '0.875rem' }}> {/* error color */}
          현재 작업 중인 내용이 저장되지 않은 경우 사라질 수 있습니다.
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
          sx={{
            color: '#a1c9fd', // primary color
            '&:hover': {
              backgroundColor: 'rgba(161, 201, 253, 0.1)', // primary with opacity
            }
          }}
        >
          새 메모 생성
        </Button>
      </DialogActions>
    </Dialog>
  )
}
