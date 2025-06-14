import { useState } from 'react'

export interface UseSnackbarReturn {
  snackbarOpen: boolean
  snackbarMessage: string
  snackbarSeverity: 'success' | 'error' | 'info'
  showSnackbar: (message: string, severity?: 'success' | 'error' | 'info') => void
  handleSnackbarClose: () => void
}

export function useSnackbar(): UseSnackbarReturn {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success')

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    handleSnackbarClose,
  }
}
