import { useRef } from 'react'
import type { Movie } from '../App'
import { exportData, importData } from '../utils/backup'

interface DataToolsProps {
  movies: Movie[]
  setMovies: (movies: Movie[]) => void
}

export function DataTools({ movies, setMovies }: DataToolsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    if (movies.length === 0) {
      alert('暂无数据可导出')
      return
    }
    exportData(movies)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    importData(file)
      .then((importedMovies) => {
        if (confirm(`确定要导入 ${importedMovies.length} 条数据吗？当前数据将被替换。`)) {
          setMovies(importedMovies)
          alert('导入成功！')
        }
      })
      .catch((err: Error) => {
        alert(`导入失败：${err.message}`)
      })
      .finally(() => {
        if (fileInputRef.current) fileInputRef.current.value = ''
      })
  }

  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'flex-end',
      marginBottom: '1rem'
    }}>
      <button
        onClick={handleExport}
        style={{
          padding: '0.5rem 1rem',
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}
      >
        📤 导出数据
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        style={{ display: 'none' }}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        style={{
          padding: '0.5rem 1rem',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}
      >
        📥 导入数据
      </button>
    </div>
  )
}