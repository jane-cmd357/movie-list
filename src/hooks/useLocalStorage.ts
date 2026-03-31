import { useState, useEffect } from 'react'

// 泛型T：可以存储任何类型的数据
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 初始化状态：从localStorage读取，如果没有则使用initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('读取localStorage失败:', error)
      return initialValue
    }
  })

  // 当storedValue变化时，自动保存到localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error('保存到localStorage失败:', error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue] as const
}