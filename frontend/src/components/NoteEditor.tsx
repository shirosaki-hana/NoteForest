import { Box, TextField, Chip, Stack, Autocomplete, CircularProgress, Typography } from '@mui/material'
import { useState } from 'react'
import MarkdownRenderer from './MarkdownRenderer'

interface NoteEditorProps {
  // 상태
  noteTitle: string
  noteTags: string[]
  noteContent: string
  editorKey: number
  loading: boolean
  isEditMode: boolean
  
  // 핸들러
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onTagsChange: (event: any, newValue: string[]) => void
  onContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export default function NoteEditor({
  noteTitle,
  noteTags,
  noteContent,
  editorKey,
  loading,
  isEditMode,
  onTitleChange,
  onTagsChange,
  onContentChange,
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
          {/* 제목 입력/표시 */}
          {isEditMode ? (
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
          ) : (
            <Typography
              variant="h4"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#f8f9ff',
                padding: '8px 0',
                fontFamily: '"Rubik", "Cambria", "Times New Roman", "Times", serif',
              }}
            >
              {noteTitle || '제목 없음'}
            </Typography>
          )}
          
          {/* 태그 입력/표시 */}
          {isEditMode ? (
            <Autocomplete
              multiple
              freeSolo
              size="small"
              options={[]}
              value={noteTags}
              inputValue={inputValue}
              onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue)
              }}
              onChange={(event, newValue) => {
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
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, padding: '4px 0' }}>
              {noteTags.length > 0 ? (
                noteTags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    variant="filled"
                    sx={{
                      height: '20px',
                      fontSize: '0.75rem',
                      backgroundColor: '#32353a',
                      color: '#c3c6cf',
                      border: 'none',
                    }}
                  />
                ))
              ) : (
                <Typography variant="caption" sx={{ color: '#8d9199', padding: '2px 0' }}>
                  태그 없음
                </Typography>
              )}
            </Box>
          )}
        </Stack>
      </Box>

      {/* 에디터 영역 */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', px: 2, pb: 2 }}>
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
          </Box>
        ) : (
          <Box sx={{ position: 'relative', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {isEditMode ? (
              /* 텍스트 에디터 */
              <TextField
                key={editorKey}
                multiline
                fullWidth
                variant="standard"
                placeholder="여기에 노트를 작성하세요..."
                value={noteContent}
                onChange={onContentChange}
                InputProps={{
                  disableUnderline: true,
                }}
                sx={{
                  flexGrow: 1,
                  height: '98%',
                  display: 'flex',
                  flexDirection: 'column',
                  '& .MuiInput-root': {
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: '#f8f9ff',
                    backgroundColor: 'transparent',
                    alignItems: 'stretch',
                    height: '98%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'transparent',
                    },
                  },
                  '& textarea': {
                    padding: '16px 0',
                    resize: 'none',
                    fontFamily: '"Inter", "Arial", "Helvetica", sans-serif',
                    flexGrow: 1,
                    height: '100% !important',
                    minHeight: '100% !important',
                    overflow: 'auto !important',
                    '&::placeholder': {
                      color: '#8d9199',
                      opacity: 1,
                    },
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#32353a',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#191c20',
                    },
                  },
                }}
              />
            ) : (
              /* Markdown 렌더러 */
              <MarkdownRenderer content={noteContent} />
            )}
            
            {/* 마스코트 이미지 - 우측 하단 고정 */}
            <Box
              component="img"
              src="/mascot.svg"
              alt="NoteForest Mascot"
              sx={{
                position: 'absolute',
                bottom: 5,
                right: 0,
                width: 400,
                height: 400,
                opacity: 0.4,
                zIndex: 1,
                pointerEvents: 'none',
                // 제발 마스코트 이미지 스타일 조정하지 마세요 
                // 이상해 보여도 이게 최적 설정입니다...
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}
