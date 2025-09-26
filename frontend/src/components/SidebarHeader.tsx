import { Box, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon, Note as NoteIcon } from '@mui/icons-material';

interface SidebarHeaderProps {
  notesCount: number;
  onClose: () => void;
}

export default function SidebarHeader({ notesCount, onClose }: SidebarHeaderProps) {
  return (
    <>
      {/* 헤더 */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NoteIcon />
          <Typography
            variant='h6'
            sx={{
              fontWeight: 600,
              fontFamily: 'Rubik, Cambria, "Times New Roman", Times, serif',
            }}
          >
            노트 목록
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* 노트 개수 */}
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant='body2'>
          {' '}
          {/* on-surface-variant */}총 {notesCount}개의 노트
        </Typography>
      </Box>
    </>
  );
}
