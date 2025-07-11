import { Box, TextField, Chip, Stack, CircularProgress, Typography } from '@mui/material'
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
        pt: 8, 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      {/* 제목과 태그 입력 영역 */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
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
              slotProps={{
                input: {
                  disableUnderline: true,
                }
              }}
              sx={{
                '& .MuiInput-root': {
                  fontSize: '1.5rem',
                  fontWeight: 600,
                },
                '& input': {
                  padding: '8px 0',
                '&::placeholder': {
                    opacity: 0.5,
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

                padding: '8px 0',
              }}
            >
              {noteTitle || '제목 없음'}
            </Typography>
          )}
          
          {/* 태그 입력/표시 */}
          {isEditMode ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* 기존 태그들 표시 */}
              {noteTags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {noteTags.map((tag, index) => (
                    <Chip
                      key={index}
                      variant="filled"
                      label={tag}
                      size="small"
                      onDelete={() => {
                        const newTags = noteTags.filter((_, i) => i !== index);
                        onTagsChange(null, newTags);
                      }}
                      sx={{
                        height: '20px',
                        fontSize: '0.75rem',
                        border: 'none',
                        '& .MuiChip-deleteIcon': {
                          fontSize: '14px',
                        },
                      }}
                    />
                  ))}
                </Box>
              )}
              
              {/* 태그 입력 필드 */}
              <TextField
                variant="standard"
                placeholder="쉼표나 Tab키로 태그 추가"
                value={inputValue}
                onChange={(e) => {
                  const value = e.target.value;
                  
                  // 쉼표가 입력되면 즉시 태그 추가
                  if (value.includes(',')) {
                    const tagText = value.replace(',', '').trim();
                    if (tagText && !noteTags.includes(tagText)) {
                      const newTags = [...noteTags, tagText];
                      onTagsChange(null, newTags);
                    }
                    setInputValue('');
                  } else {
                    setInputValue(value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Tab' && inputValue.trim()) {
                    e.preventDefault();
                    const trimmedValue = inputValue.trim();
                    if (!noteTags.includes(trimmedValue)) {
                      const newTags = [...noteTags, trimmedValue];
                      onTagsChange(null, newTags);
                    }
                    setInputValue('');
                  } else if (e.key === 'Backspace' && !inputValue && noteTags.length > 0) {
                    // 입력값이 없을 때 백스페이스로 마지막 태그 삭제
                    const newTags = noteTags.slice(0, -1);
                    onTagsChange(null, newTags);
                  }
                }}
                slotProps={{
                  input: {
                    disableUnderline: true,
                  }
                }}
                sx={{
                  '& .MuiInput-root': {
                    fontSize: '0.875rem',
                    minHeight: 'auto',
                  },
                  '& input': {
                    padding: '4px 0',
                  },
                  '&::placeholder': {
                    opacity: 0.5,
                    fontWeight: 400,
                  },
                }}
              />
            </Box>
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
                      border: 'none',
                    }}
                  />
                ))
              ) : (
                <Typography variant="caption" sx={{ padding: '2px 0' }}>
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
              gap: 2
            }}
          >
            <CircularProgress 
              size={40} 
            />
            <Typography variant="body2">
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
                slotProps={{
                  input: {
                    disableUnderline: true,
                  }
                }}
                sx={{
                  flexGrow: 1,
                  height: '98%',
                  display: 'flex',
                  flexDirection: 'column',
                  '& .MuiInput-root': {
                    fontSize: '16px',
                    lineHeight: '24px',
                    alignItems: 'stretch',
                    height: '98%',
                    display: 'flex',
                    flexDirection: 'column',
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
                      opacity: 0.5,
                      fontWeight: 400,
                    },
                  },
                }}
              />
            ) : (
              /* Markdown 렌더러 */
              <MarkdownRenderer content={noteContent} />
            )}
          </Box>
        )}
      </Box>
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
  )
}
