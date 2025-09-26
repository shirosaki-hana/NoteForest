import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface NewNoteConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function NewNoteConfirmDialog({
  open,
  onConfirm,
  onCancel,
}: NewNoteConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle sx={{ pb: 1 }}> {/* on-background */}새 노트 생성</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          {' '}
          {/* on-surface-variant */}새 노트를 생성하시겠습니까?
        </DialogContentText>
        <DialogContentText sx={{ fontSize: '0.875rem' }}>
          {' '}
          {/* error color */}
          현재 작업 중인 내용이 저장되지 않은 경우 사라질 수 있습니다.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onCancel}>취소</Button>
        <Button onClick={onConfirm}>새 노트 생성</Button>
      </DialogActions>
    </Dialog>
  );
}
