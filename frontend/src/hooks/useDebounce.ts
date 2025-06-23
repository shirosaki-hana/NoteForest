import { useCallback, useRef } from 'react'

export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<number | null>(null)

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = window.setTimeout(() => {
        callback(...args)
        timeoutRef.current = null
      }, delay)
    },
    [callback, delay]
  ) as T

  return debouncedCallback
} 