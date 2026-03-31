import { useState } from 'react'

interface AddMovieFormProps {
  onAdd: (title: string) => void
}

export function AddMovieForm({ onAdd }: AddMovieFormProps) {
  const [title, setTitle] = useState<string>('')
  const [isAdding, setIsAdding] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(title.trim())
      setTitle('')
      setIsAdding(false)
    }
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
        + 添加电影/剧集
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
        placeholder="输入电影或剧集名称..."
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