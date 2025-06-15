import { Snackbar, Alert } from '@mui/material'

interface NotificationSnackbarProps {
  open: boolean
  message: string
  severity: 'success' | 'error' | 'info'
  onClose: () => void
  anchorOrigin?: {
    vertical: 'top' | 'bottom'
    horizontal: 'left' | 'center' | 'right'
  }
}

export default function NotificationSnackbar({ 
  open, 
  message, 
  severity, 
  onClose,
  anchorOrigin = { vertical: 'bottom', horizontal: 'right' }
}: NotificationSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          backgroundColor: severity === 'success' 
            ? '#1b2d1e' // success background
            : severity === 'error'
            ? '#2d1b1e' // error background
            : '#1e2a2d', // info background
          color: severity === 'success' 
            ? '#a1c9fd' // primary color for success
            : severity === 'error'
            ? '#ffb4ab' // error color
            : '#a1c9fd', // info color
          border: severity === 'success'
            ? '1px solid #2c4a2c'
            : severity === 'error'
            ? '1px solid #4a2c2c'
            : '1px solid #2c4a4a',
          '& .MuiAlert-icon': {
            color: 'inherit',
          },
          '& .MuiAlert-action': {
            color: 'inherit',
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
