import { useState, useEffect } from 'react'
import { v4 } from 'uuid'
import { writeNote, getNote } from '../utils/api'

export interface UseNoteManagementReturn {
  // 상태
  selectedNoteId: string
  noteTitle: string
  noteTags: string[]
  noteContent: string
  editorKey: number
  saving: boolean
  loading: boolean
  
  // 액션들
  handleNewNote: () => void
  handleSaveNote: () => Promise<void>
  handleNoteSelect: (noteId: string) => Promise<void>
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleTagsChange: (event: any, newValue: string[]) => void
  handleContentChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  
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

  // 최초 로드 시 새 메모 자동 생성
  useEffect(() => {
    if (!selectedNoteId) {
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
        setNoteTitle(response.data.title || '')
        setNoteTags(response.data.tags || [])
        setNoteContent(response.data.body || '')
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
    setNoteTitle(event.target.value)
  }

  const handleTagsChange = (_event: any, newValue: string[]) => {
    setNoteTags(newValue)
  }

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteContent(event.target.value)
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
    
    // 액션들
    handleNewNote,
    handleSaveNote,
    handleNoteSelect,
    handleTitleChange,
    handleTagsChange,
    handleContentChange,
    
    // 상태 설정 함수들
    setNoteTitle,
    setNoteTags,
    setNoteContent,
  }
}
