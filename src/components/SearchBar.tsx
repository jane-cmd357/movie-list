import { useState, useEffect } from 'react'

interface SearchBarProps {
  onSearch: (keyword: string) => void
}

// 防抖 Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [keyword, setKeyword] = useState('')
  const debouncedKeyword = useDebounce(keyword, 300) // 300ms 防抖

  // 当防抖后的关键词变化时，触发搜索
  useEffect(() => {
    onSearch(debouncedKeyword)
  }, [debouncedKeyword, onSearch])

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="🔍 搜索电影或剧集..."
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '50px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            outline: 'none',
            backgroundColor: 'white'
          }}
        />
        {keyword && (
          <button
            onClick={() => setKeyword('')}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#999',
              fontSize: '1rem'
            }}
          >
            ✕
          </button>
        )}
      </div>
      {keyword && (
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem', paddingLeft: '0.5rem' }}>
          搜索: "{keyword}"
        </div>
      )}
    </div>
  )
}