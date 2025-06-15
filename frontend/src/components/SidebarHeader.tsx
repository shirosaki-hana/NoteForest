import { Box, Typography, IconButton } from '@mui/material'
import { Close as CloseIcon, Note as NoteIcon } from '@mui/icons-material'

interface SidebarHeaderProps {
  notesCount: number
  onClose: () => void
}

export default function SidebarHeader({ notesCount, onClose }: SidebarHeaderProps) {
  return (
    <>
      {/* 헤더 */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #32353a', // divider
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NoteIcon sx={{ color: '#a1c9fd' }} /> {/* primary color */}
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            color: '#f8f9ff',
            fontFamily: 'Rubik, Cambria, "Times New Roman", Times, serif'
          }}>
            메모 목록
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose}
          sx={{ 
            color: '#c3c6cf', // on-surface-variant
            '&:hover': { 
              backgroundColor: '#1d2024', // hover color
              color: '#e1e2e8' // on-surface
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* 메모 개수 */}
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant="body2" sx={{ color: '#c3c6cf' }}> {/* on-surface-variant */}
          총 {notesCount}개의 메모
        </Typography>
      </Box>
    </>
  )
}
