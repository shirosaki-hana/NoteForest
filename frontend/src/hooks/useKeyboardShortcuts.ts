import { useEffect } from 'react'

interface UseKeyboardShortcutsProps {
  onSave: () => void
  saving: boolean
  enabled?: boolean
}

export function useKeyboardShortcuts({ onSave, saving, enabled = true }: UseKeyboardShortcutsProps) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault()
        if (!saving) {
          onSave()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onSave, saving, enabled])
}
