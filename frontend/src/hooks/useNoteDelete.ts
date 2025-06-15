import { useState } from 'react'
import type { Note } from '../types/api'
import { deleteNote } from '../utils/api'

export interface UseNoteDeleteReturn {
  // 상태
  deleteDialogOpen: boolean
  noteToDelete: Note | null
  deleting: boolean
  
  // 액션들
  handleDeleteClick: (note: Note, event: React.MouseEvent) => void
  handleDeleteConfirm: () => Promise<void>
  handleDeleteCancel: () => void
}

interface UseNoteDeleteProps {
  selectedNoteId?: string
  onNoteSelect?: (noteId: string) => void
  onDeleteSuccess: () => Promise<void>
  showMessage: (message: string, severity: 'success' | 'error') => void
}

export function useNoteDelete({
  selectedNoteId,
  onNoteSelect,
  onDeleteSuccess,
  showMessage,
}: UseNoteDeleteProps): UseNoteDeleteReturn {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteClick = (note: Note, event: React.MouseEvent) => {
    event.stopPropagation() // 메모 선택 이벤트 방지
    setNoteToDelete(note)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return

    try {
      setDeleting(true)
      const response = await deleteNote(noteToDelete.uuid)
      
      if (response.success) {
        // 삭제된 메모가 현재 선택된 메모라면 선택 해제
        if (selectedNoteId === noteToDelete.uuid) {
          onNoteSelect?.('')
        }
        
        // 백엔드와 동기화를 위해 메모 목록 다시 로드
        await onDeleteSuccess()
        
        showMessage('메모가 성공적으로 삭제되었습니다.', 'success')
      } else {
        showMessage(response.error || '메모 삭제에 실패했습니다.', 'error')
      }
    } catch (err) {
      showMessage('네트워크 오류가 발생했습니다.', 'error')
      console.error('Failed to delete note:', err)
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setNoteToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setNoteToDelete(null)
  }

  return {
    deleteDialogOpen,
    noteToDelete,
    deleting,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
  }
}
