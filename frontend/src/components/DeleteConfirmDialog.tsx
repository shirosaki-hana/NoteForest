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
    >
      <DialogTitle> {/* on-background */}
        메모 삭제
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}> {/* on-surface-variant */}
          "{note?.title || '제목 없음'}" 메모를 정말 삭제하시겠습니까?
        </DialogContentText>
        <DialogContentText> {/* error color */}
          이 작업은 되돌릴 수 없습니다.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button 
          onClick={onCancel}
        >
          취소
        </Button>
        <Button
          onClick={onConfirm}
          disabled={deleting}
        >
          {deleting ? '삭제 중...' : '삭제'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
