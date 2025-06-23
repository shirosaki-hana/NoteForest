import { useState, useEffect } from 'react'
import { v4 } from 'uuid'
import { writeNote, getNote } from '../utils/api'
import { useLocalStorage } from './useLocalStorage'
import { useDebounce } from './useDebounce'

export interface UseNoteManagementReturn {
  // 상태
  selectedNoteId: string
  noteTitle: string
  noteTags: string[]
  noteContent: string
  editorKey: number
  saving: boolean
  loading: boolean
  
  // Draft 관련
  showDraftDialog: boolean
  draftData: { title: string; tags: string[]; content: string; lastModified: number } | null
  
  // 액션들
  handleNewNote: () => void
  handleSaveNote: () => Promise<void>
  handleNoteSelect: (noteId: string) => Promise<void>
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleTagsChange: (event: any, newValue: string[]) => void
  handleContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  
  // Draft 관련 액션들
  handleRestoreDraft: () => void
  handleDiscardDraft: () => void
  handleCancelDraftDialog: () => void
  
  // 상태 설정 함수들 (필요한 경우)
  setNoteTitle: React.Dispatch<React.SetStateAction<string>>
  setNoteTags: React.Dispatch<React.SetStateAction<string[]>>
  setNoteContent: React.Dispatch<React.SetStateAction<string>>
}

export function useNoteManagement(
  showSnackbar: (message: string, severity?: 'success' | 'error' | 'info') => void
): UseNoteManagementReturn {
  const [selectedNoteId, setSelectedNoteId] = useState<string>('')
  const [noteTitle, setNoteTitle] = useState<string>('')
  const [noteTags, setNoteTags] = useState<string[]>([])
  const [noteContent, setNoteContent] = useState<string>('')
  const [editorKey, setEditorKey] = useState<number>(0)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)

  // Draft 관련 상태
  const [showDraftDialog, setShowDraftDialog] = useState(false)
  const [draftData, setDraftData] = useState<{ title: string; tags: string[]; content: string; lastModified: number } | null>(null)

  // localStorage 훅
  const { saveDraft, loadDraft, clearDraft, cleanOldDrafts, getAllDraftKeys } = useLocalStorage()

  // Debounced 자동 저장 (1초 후)
  const debouncedSaveDraft = useDebounce((noteId: string, title: string, tags: string[], content: string) => {
    if (noteId && (title.trim() || tags.length > 0 || content.trim())) {
      saveDraft(noteId, title, tags, content)
    }
  }, 500)

  // 최초 로드 시 로컬 저장소 확인 후 메모 복원 또는 신규 생성
  useEffect(() => {
    if (!selectedNoteId) {
      // 7일 이상 된 오래된 draft들 먼저 정리
      cleanOldDrafts()
      
      // 로컬 저장소에서 모든 draft 키 가져오기
      const draftKeys = getAllDraftKeys()
      
      if (draftKeys.length > 0) {
        // draft가 있으면 가장 최근 것 찾기
        let latestDraft: { noteId: string; title: string; tags: string[]; content: string; lastModified: number } | undefined
        
        for (const key of draftKeys) {
          try {
            const noteId = key.replace('noteforest_draft_', '')
            const draft = loadDraft(noteId)
            
            if (draft) {
              if (!latestDraft || draft.lastModified > latestDraft.lastModified) {
                latestDraft = {
                  noteId,
                  title: draft.title,
                  tags: draft.tags,
                  content: draft.content,
                  lastModified: draft.lastModified,
                }
              }
            }
          } catch (error) {
            console.warn('Draft 파싱 실패:', error)
          }
        }
        
        if (latestDraft) {
          // 가장 최근 draft로 상태 설정
          setSelectedNoteId(latestDraft.noteId)
          setNoteTitle(latestDraft.title)
          setNoteTags(latestDraft.tags)
          setNoteContent(latestDraft.content)
          setEditorKey(prev => prev + 1)
          
          console.log('로컬 저장소에서 draft 복원:', latestDraft.noteId)
          showSnackbar('이전 편집 내용을 복원했습니다.', 'info')
          return
        }
      }
      
      // draft가 없으면 새 메모 생성
      const newNoteId = v4()
      setSelectedNoteId(newNoteId)
      console.log('최초 접속 시 새 메모 생성:', newNoteId)
    }
  }, [selectedNoteId])

  const handleNewNote = () => {
    try {
      const newNoteId = v4()
      setSelectedNoteId(newNoteId)
      setNoteTitle('')
      setNoteTags([])
      setNoteContent('')
      setEditorKey(prev => prev + 1)
      
      showSnackbar('새 메모가 생성되었습니다.', 'info')
      console.log('새 메모 작성:', newNoteId)
    } catch (error) {
      console.error('새 메모 생성 중 오류:', error)
      showSnackbar('새 메모 생성에 실패했습니다.', 'error')
    }
  }

  const handleSaveNote = async () => {
    if (!selectedNoteId) {
      showSnackbar('메모를 선택해주세요.', 'error')
      return
    }
    
    if (!noteTitle.trim() && !noteContent.trim()) {
      showSnackbar('제목이나 내용을 입력해주세요.', 'error')
      return
    }
    
    try {
      setSaving(true)
      
      const response = await writeNote({
        uuid: selectedNoteId,
        title: noteTitle.trim() || '제목 없음',
        tags: noteTags,
        body: noteContent
      })
      
      if (response.success) {
        showSnackbar('메모가 성공적으로 저장되었습니다.', 'success')
        console.log('메모 저장 완료:', selectedNoteId)
        
        // 저장 성공 시 해당 노트의 draft 삭제
        clearDraft(selectedNoteId)
      } else {
        throw new Error(response.error || '메모 저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('메모 저장 중 오류:', error)
      const errorMessage = error instanceof Error ? error.message : '메모 저장 중 오류가 발생했습니다.'
      showSnackbar(errorMessage, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleNoteSelect = async (noteId: string) => {
    if (!noteId) {
      // 빈 문자열이나 null인 경우 새 메모 상태로 초기화
      setSelectedNoteId('')
      setNoteTitle('')
      setNoteTags([])
      setNoteContent('')
      setEditorKey(prev => prev + 1)
      return
    }
    
    try {
      setLoading(true)
      setSelectedNoteId(noteId)
      
      const response = await getNote(noteId)
      
      if (response.success && response.data) {
        const loadedTitle = response.data.title || ''
        const loadedTags = response.data.tags || []
        const loadedContent = response.data.body || ''
        
        // Draft가 있는지 확인
        const draft = loadDraft(noteId)
        if (draft) {
          // Draft와 서버 데이터 비교
          const isDifferent = (
            draft.title !== loadedTitle ||
            JSON.stringify(draft.tags) !== JSON.stringify(loadedTags) ||
            draft.content !== loadedContent
          )
          
          if (isDifferent) {
            // Draft와 서버 데이터가 다르면 복원 다이얼로그 표시
            setDraftData({
              title: draft.title,
              tags: draft.tags,
              content: draft.content,
              lastModified: draft.lastModified,
            })
            setShowDraftDialog(true)
          } else {
            // 동일하면 draft 삭제
            clearDraft(noteId)
          }
        }
        
        // 서버 데이터로 상태 설정
        setNoteTitle(loadedTitle)
        setNoteTags(loadedTags)
        setNoteContent(loadedContent)
        setEditorKey(prev => prev + 1)
        
        console.log('메모 로드 완료:', noteId)
      } else {
        throw new Error(response.error || '메모를 불러올 수 없습니다.')
      }
    } catch (error) {
      console.error('메모 로드 중 오류:', error)
      const errorMessage = error instanceof Error ? error.message : '메모를 불러오는 중 오류가 발생했습니다.'
      showSnackbar(errorMessage, 'error')
      
      // 오류 발생 시 빈 상태로 초기화
      setSelectedNoteId('')
      setNoteTitle('')
      setNoteTags([])
      setNoteContent('')
    } finally {
      setLoading(false)
    }
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value
    setNoteTitle(newTitle)
    // 실시간으로 draft 저장
    debouncedSaveDraft(selectedNoteId, newTitle, noteTags, noteContent)
  }

  const handleTagsChange = (_event: any, newValue: string[]) => {
    setNoteTags(newValue)
    // 실시간으로 draft 저장
    debouncedSaveDraft(selectedNoteId, noteTitle, newValue, noteContent)
  }

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.target.value
    setNoteContent(newContent)
    // 실시간으로 draft 저장
    debouncedSaveDraft(selectedNoteId, noteTitle, noteTags, newContent)
  }

  // Draft 복원 관련 핸들러들
  const handleRestoreDraft = () => {
    if (draftData) {
      setNoteTitle(draftData.title)
      setNoteTags(draftData.tags)
      setNoteContent(draftData.content)
      setEditorKey(prev => prev + 1)
      setShowDraftDialog(false)
      setDraftData(null)
      showSnackbar('편집 중인 내용을 복원했습니다.', 'success')
    }
  }

  const handleDiscardDraft = () => {
    if (selectedNoteId) {
      clearDraft(selectedNoteId)
    }
    setShowDraftDialog(false)
    setDraftData(null)
    showSnackbar('편집 중인 내용을 삭제했습니다.', 'info')
  }

  const handleCancelDraftDialog = () => {
    setShowDraftDialog(false)
    setDraftData(null)
  }

  return {
    // 상태
    selectedNoteId,
    noteTitle,
    noteTags,
    noteContent,
    editorKey,
    saving,
    loading,
    
    // Draft 관련
    showDraftDialog,
    draftData,
    
    // 액션들
    handleNewNote,
    handleSaveNote,
    handleNoteSelect,
    handleTitleChange,
    handleTagsChange,
    handleContentChange,
    
    // Draft 관련 액션들
    handleRestoreDraft,
    handleDiscardDraft,
    handleCancelDraftDialog,
    
    // 상태 설정 함수들
    setNoteTitle,
    setNoteTags,
    setNoteContent,
  }
}
