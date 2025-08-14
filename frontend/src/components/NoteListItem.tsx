import {
  Box,
  Typography,
  Chip,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { Schedule as ScheduleIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { Note } from '../types/api';
import { formatDate } from '../utils/dateFormat';

interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (noteId: string) => void;
  onDelete: (note: Note, event: React.MouseEvent) => void;
}

export default function NoteListItem({ note, isSelected, onSelect, onDelete }: NoteListItemProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={isSelected}
        onClick={() => onSelect(note.uuid)}
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <ListItemText
          primary={
            <Typography
              variant='subtitle2'
              sx={{
                fontWeight: 500,
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {note.title || '제목 없음'}
            </Typography>
          }
          secondary={
            <Box>
              {/* 태그들 */}
              {note.tags.length > 0 && (
                <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {note.tags.slice(0, 3).map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size='small'
                      sx={{
                        height: 20,
                        fontSize: '0.75rem',
                        '& .MuiChip-label': { px: 1 },
                      }}
                    />
                  ))}
                  {note.tags.length > 3 && (
                    <Chip
                      label={`+${note.tags.length - 3}`}
                      size='small'
                      sx={{
                        height: 20,
                        fontSize: '0.75rem',
                        '& .MuiChip-label': { px: 1 },
                      }}
                    />
                  )}
                </Box>
              )}

              {/* 날짜 정보 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ScheduleIcon sx={{ fontSize: '0.75rem' }} />
                <Typography variant='caption'>{formatDate(note.updatedAt)}</Typography>
              </Box>
            </Box>
          }
        />

        {/* 삭제 버튼 */}
        <IconButton
          size='small'
          onClick={e => onDelete(note, e)}
          sx={{
            ml: 1,
            opacity: 0.7,
            transition: 'all 0.2s ease',
            '&:hover': {
              color: 'error.main',
              backgroundColor: theme => theme.palette.error.main + '1A',
              opacity: 1,
              transform: 'scale(1.1)',
            },
          }}
        >
          <DeleteIcon fontSize='small' />
        </IconButton>
      </ListItemButton>
    </ListItem>
  );
}
