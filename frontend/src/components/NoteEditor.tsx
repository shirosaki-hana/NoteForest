import { Box, TextField, Chip, Stack, Autocomplete, CircularProgress, Typography } from '@mui/material'
import { MilkdownEditor, type MilkdownEditorRef } from './MilkdownEditor'
import { MilkdownProvider } from '@milkdown/react'
import { useState } from 'react'

interface NoteEditorProps {
  // 상태
  noteTitle: string
  noteTags: string[]
  noteContent: string
  editorKey: number
  loading: boolean
  
  // 핸들러
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onTagsChange: (event: any, newValue: string[]) => void
  
  // Ref
  editorRef: React.RefObject<MilkdownEditorRef | null>
}

export default function NoteEditor({
  noteTitle,
  noteTags,
  noteContent,
  editorKey,
  loading,
  onTitleChange,
  onTagsChange,
  editorRef,
}: NoteEditorProps) {
  const [inputValue, setInputValue] = useState('')
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        pt: 8, // AppBar 높이만큼 패딩
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#111418', // surface color (에디터 배경과 동일)
      }}
    >
      {/* 제목과 태그 입력 영역 */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          backgroundColor: '#111418',
        }}
      >
        <Stack spacing={1}>
          {/* 제목 입력 */}
          <TextField
            fullWidth
            variant="standard"
            placeholder="제목 없음"
            value={noteTitle}
            onChange={onTitleChange}
            InputProps={{
              disableUnderline: true,
            }}
            sx={{
              '& .MuiInput-root': {
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#f8f9ff',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                '&.Mui-focused': {
                  backgroundColor: 'transparent',
                },
              },
              '& input': {
                padding: '8px 0',
                '&::placeholder': {
                  color: '#8d9199',
                  opacity: 1,
                  fontWeight: 400,
                },
              },
            }}
          />
            {/* 태그 입력 */}
          <Autocomplete
            multiple
            freeSolo
            size="small"
            options={[]}
            value={noteTags}
            inputValue={inputValue}            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue)
            }}            onChange={(event, newValue) => {
              onTagsChange(event, newValue)
              setInputValue('')
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="filled"
                  label={option}
                  {...getTagProps({ index })}
                  key={index}
                  size="small"
                  sx={{
                    height: '20px',
                    fontSize: '0.75rem',
                    backgroundColor: '#32353a',
                    color: '#c3c6cf',
                    border: 'none',
                    '& .MuiChip-deleteIcon': {
                      color: '#8d9199',
                      fontSize: '14px',
                      '&:hover': {
                        color: '#c3c6cf',
                      },
                    },
                  }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                placeholder="태그 추가..."
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                }}
                sx={{
                  '& .MuiInput-root': {
                    fontSize: '0.875rem',
                    color: '#c3c6cf',
                    backgroundColor: 'transparent',
                    minHeight: 'auto',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'transparent',
                    },
                  },
                  '& input': {
                    padding: '4px 0',
                    '&::placeholder': {
                      color: '#8d9199',
                      opacity: 1,
                    },
                  },
                }}
              />
            )}
          />
        </Stack>
      </Box>

      {/* 에디터 영역 */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <Box 
            sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
              color: '#c3c6cf'
            }}
          >
            <CircularProgress 
              size={40} 
              sx={{ 
                color: '#a1c9fd' 
              }} 
            />
            <Typography variant="body2" sx={{ color: '#c3c6cf' }}>
              메모를 불러오는 중...
            </Typography>
          </Box>        ) : (
          <Box sx={{ position: 'relative', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <MilkdownProvider>
              <MilkdownEditor
                key={editorKey}
                ref={editorRef}
                value={noteContent}
                placeholder="여기에 노트를 작성하세요..."
              />
            </MilkdownProvider>
            
            {/* 마스코트 이미지 - 우측 하단 고정 */}
            <Box
              component="img"
              src="/mascot.svg"
              alt="NoteForest Mascot"
              sx={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                width: 400,
                height: 400,
                opacity: 0.3,
                zIndex: 1,
                pointerEvents: 'none', // 클릭 방지
                transition: 'opacity 0.3s ease',
                '&:hover': {
                  opacity: 0.9,
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}
