import { Box, Typography, List } from '@mui/material'
import type { Note } from '../types/api'
import NoteListItem from './NoteListItem'

interface NoteListContentProps {
  loading: boolean
  error: string | null
  notes: Note[]
  selectedNoteId?: string
  onNoteSelect?: (noteId: string) => void
  onNoteDelete: (note: Note, event: React.MouseEvent) => void
}

export default function NoteListContent({
  loading,
  error,
  notes,
  selectedNoteId,
  onNoteSelect,
  onNoteDelete,
}: NoteListContentProps) {
  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography sx={{ color: '#c3c6cf' }}>로딩 중...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography sx={{ color: '#ffb4ab' }}>{error}</Typography> {/* error color */}
      </Box>
    )
  }

  if (notes.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography sx={{ color: '#c3c6cf' }}>메모가 없습니다.</Typography>
      </Box>
    )
  }

  return (
    <List sx={{ p: 0 }}>
      {notes.map((note) => (
        <NoteListItem
          key={note.uuid}
          note={note}
          isSelected={selectedNoteId === note.uuid}
          onSelect={onNoteSelect || (() => {})}
          onDelete={onNoteDelete}
        />
      ))}
    </List>
  )
}
