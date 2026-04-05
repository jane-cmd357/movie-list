import { useEffect, useState } from 'react'
import { categoryConfig } from '../config/categories'
import type { CategoryKey } from '../config/categories'
import { searchMedia } from '../services/tmdb'
import type { MovieResult } from '../services/tmdb'

interface AddMovieFormProps {
  onAdd: (title: string, category: CategoryKey, poster?: string, year?: string) => void
}

// 防抖 Hook
function useDebounce<T>(value: T, delay: number): T{
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

export function AddMovieForm({ onAdd }: AddMovieFormProps) {
  const [title, setTitle] = useState<string>('')
  const [category, setCategory] = useState<CategoryKey>('movie')
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [searchResults, setSearchResults] = useState<MovieResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<string>('')

  const debouncedTitle = useDebounce(title, 500)

  // 搜索
  useEffect(() => {
    if (!isAdding) return
    
    const doSearch = async () => {
    if (debouncedTitle.length < 2) {
      setSearchResults([])
      return
    }
    
    setIsSearching(true)
    const results = await searchMedia(debouncedTitle)
    setSearchResults(results)
    setIsSearching(false)
  }

    doSearch()
  }, [debouncedTitle, isAdding])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(title.trim(), category, selectedPoster || undefined, selectedYear || undefined)
      setTitle('')
      setCategory('movie')
      setSelectedPoster(null)
      setSelectedYear('')
      setSearchResults([])
      setIsAdding(false)
    }
  }

  const selectResult = (result: MovieResult) => {
    setTitle(result.title)
    setSelectedPoster(result.poster)
    setSelectedYear(result.year)
    // 根据类型自动选择 category
    if (result.type === 'movie') {
      setCategory('movie')
    } else if (result.type === 'tv') {
      setCategory('tv')
    }
    setSearchResults([])
  }

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        style={{
          width: '100%',
          padding: '1rem',
          background: 'white',
          border: '2px dashed #ccc',
          borderRadius: '12px',
          fontSize: '1rem',
          cursor: 'pointer',
          color: '#666',
          transition: 'all 0.2s'
        }}
      >
        + 添加电影/剧集/小说
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="输入名称（电影、电视剧、小说等）..."
        autoFocus
        style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '1rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          marginBottom: '0.75rem',
          outline: 'none'
        }}
      />

      {/* 搜索结果 */}
      {isSearching && (
        <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
          搜索中...
        </div>
      )}
      
      {searchResults.length > 0 && (
        <div style={{
          marginBottom: '0.75rem',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {searchResults.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              onClick={() => selectResult(result)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.5rem',
                cursor: 'pointer',
                borderBottom: '1px solid #e5e7eb',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              {result.poster ? (
                <img src={result.poster} alt={result.title} style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
              ) : (
                <div style={{ width: '40px', height: '60px', background: '#e5e7eb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  🎬
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{result.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>
                  {result.year} · {result.type === 'movie' ? '电影' : '电视剧'}
                </div>
                {result.overview && (
                  <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {result.overview.slice(0, 50)}...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 海报预览 */}
      {selectedPoster && (
        <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={selectedPoster} alt="海报" style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
          <span style={{ fontSize: '0.75rem', color: '#666' }}>已自动获取海报</span>
        </div>
      )}
      
      {/* 类型选择器 */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
          选择类型：
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(Object.entries(categoryConfig) as [CategoryKey, typeof categoryConfig[CategoryKey]][]).map(([key, { text, color, icon }]) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                border: `2px solid ${color}`,
                background: category === key ? color : 'white',
                color: category === key ? 'white' : color,
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <img 
                src={icon} 
                alt={text}
                style={{
                  width: '16px',
                  height: '16px',
                  filter: category === key ? 'brightness(0) invert(1)' : 'none'
                }}
              />
              {text}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          type="submit"
          style={{
            flex: 1,
            padding: '0.5rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          添加
        </button>
        <button
          type="button"
          onClick={() => setIsAdding(false)}
          style={{
            flex: 1,
            padding: '0.5rem',
            background: '#f3f4f6',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          取消
        </button>
      </div>
    </form>
  )
}