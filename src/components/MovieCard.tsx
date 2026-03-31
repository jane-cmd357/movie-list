import type { Movie } from '../App'
import deleteIcon from '../assets/delete.svg'

interface MovieCardProps {
  movie: Movie
  onStatusChange: (id: string, status: Movie['status']) => void
  onDelete: (id: string) => void
}

// 状态对应的emoji和中文
const statusConfig: Record<Movie['status'], { emoji: string; text: string; color: string }> = {
  want: { emoji: '👀', text: '想看', color: '#fbbf24' },
  watched: { emoji: '✅', text: '已看', color: '#10b981' },
  abandoned: { emoji: '💔', text: '弃剧', color: '#ef4444' }
}

export function MovieCard({ movie, onStatusChange, onDelete }: MovieCardProps) {
  const config = statusConfig[movie.status]

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#333' }}>{movie.title}</h3>
        <button
          onClick={() => onDelete(movie.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fee2e2'
            const img = e.currentTarget.querySelector('img')
            if (img) img.style.filter = 'invert(27%) sepia(91%) saturate(7490%) hue-rotate(0deg) brightness(95%) contrast(107%)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            const img = e.currentTarget.querySelector('img')
            if (img) img.style.filter = 'none'
          }}
        >
          <img 
            src={deleteIcon} 
            alt="删除" 
            style={{
              width: '18px',
              height: '18px',
              display: 'block',
              transition: 'all 0.2s'
            }}
          />
        </button>
      </div>
      
      <div style={{ marginTop: '0.5rem' }}>
        <span style={{
          display: 'inline-block',
          background: config.color,
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.85rem',
          marginRight: '0.5rem'
        }}>
          {config.emoji} {config.text}
        </span>
        <span style={{ fontSize: '0.8rem', color: '#999' }}>
          📅 {new Date(movie.dateAdded).toLocaleDateString()}
        </span>
      </div>

      {/* 状态切换按钮 */}
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
        {(Object.entries(statusConfig) as [Movie['status'], typeof statusConfig[Movie['status']]][]).map(([status, { emoji, text }]) => (
          <button
            key={status}
            onClick={() => onStatusChange(movie.id, status)}
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              borderRadius: '6px',
              border: '1px solid #ddd',
              background: movie.status === status ? '#667eea' : 'white',
              color: movie.status === status ? 'white' : '#666',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {emoji} {text}
          </button>
        ))}
      </div>
    </div>
  )
}