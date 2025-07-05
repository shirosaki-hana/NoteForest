import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // localStorage에서 저장된 테마 불러오기
    const savedTheme = localStorage.getItem('noteforest_theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }
    // 기본값: 시스템 설정에 따라 결정
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light')
  }

  // 테마 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('noteforest_theme', mode)
  }, [mode])

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 