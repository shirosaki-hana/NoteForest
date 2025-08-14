import { Box, TextField, Chip, Stack, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import MonacoEditor from './MonacoEditor';
import { useUiStore } from '../stores/uiStore';
import { useNotesStore } from '../stores/notesStore';

// NoteEditor has no props; it reads state from stores directly

export default function NoteEditor() {
  const [inputValue, setInputValue] = useState('');
  const { isEditMode } = useUiStore();
  const { title, tags, content, editorKey, loading, setTitle, setTags, setContent } = useNotesStore(
    state => ({
      title: state.title,
      tags: state.tags,
      content: state.content,
      editorKey: state.editorKey,
      loading: state.loading,
      setTitle: state.setTitle,
      setTags: state.setTags,
      setContent: state.setContent,
    })
  );

  return (
    <Box
      component='main'
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
              variant='standard'
              placeholder='제목 없음'
              value={title}
              onChange={e => setTitle(e.target.value)}
              slotProps={{
                input: {
                  disableUnderline: true,
                },
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
              variant='h4'
              sx={{
                fontSize: '1.5rem',
                fontWeight: 600,

                padding: '8px 0',
              }}
            >
              {title || '제목 없음'}
            </Typography>
          )}

          {/* 태그 입력/표시 */}
          {isEditMode ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* 기존 태그들 표시 */}
              {tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      variant='filled'
                      label={tag}
                      size='small'
                      onDelete={() => {
                        const newTags = tags.filter((_, i) => i !== index);
                        setTags(newTags);
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
                variant='standard'
                placeholder='쉼표나 Tab키로 태그 추가'
                value={inputValue}
                onChange={e => {
                  const value = e.target.value;

                  // 쉼표가 입력되면 즉시 태그 추가
                  if (value.includes(',')) {
                    const tagText = value.replace(',', '').trim();
                    if (tagText && !tags.includes(tagText)) {
                      const newTags = [...tags, tagText];
                      setTags(newTags);
                    }
                    setInputValue('');
                  } else {
                    setInputValue(value);
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Tab' && inputValue.trim()) {
                    e.preventDefault();
                    const trimmedValue = inputValue.trim();
                    if (!tags.includes(trimmedValue)) {
                      const newTags = [...tags, trimmedValue];
                      setTags(newTags);
                    }
                    setInputValue('');
                  } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
                    const newTags = tags.slice(0, -1);
                    setTags(newTags);
                  }
                }}
                slotProps={{
                  input: {
                    disableUnderline: true,
                  },
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
              {tags.length > 0 ? (
                tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size='small'
                    variant='filled'
                    sx={{
                      height: '20px',
                      fontSize: '0.75rem',
                      border: 'none',
                    }}
                  />
                ))
              ) : (
                <Typography variant='caption' sx={{ padding: '2px 0' }}>
                  {' '}
                  태그 없음{' '}
                </Typography>
              )}
            </Box>
          )}
        </Stack>
      </Box>

      {/* 에디터 영역 */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          px: 2,
          pb: 2,
        }}
      >
        {loading ? (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <CircularProgress size={40} />
            <Typography variant='body2'> 메모를 불러오는 중... </Typography>
          </Box>
        ) : (
          <Box sx={{ position: 'relative', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {isEditMode ? (
              /* 텍스트 에디터 */
              <MonacoEditor key={editorKey} value={content} onChange={setContent} />
            ) : (
              /* Markdown 렌더러 */
              <MarkdownRenderer content={content} />
            )}
          </Box>
        )}
      </Box>

      {/* 마스코트 이미지*/}
      <Box
        component='img'
        src='/mascot.svg'
        alt='NoteForest Mascot'
        sx={{
          position: 'absolute',
          bottom: 5,
          right: 0,
          width: 400,
          height: 400,
          opacity: 0.2,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
}
