import { useNavigate } from 'react-router-dom'

interface StatisticsProps {
  stats: {
    total: number
    want: number
    watched: number
    hold: number
  }
}

export default function Statistics({ stats }: StatisticsProps) {
  const navigate = useNavigate()

  return (
    <div style={{
      marginBottom: '2rem'
    }}>
      {/* 查看统计详情 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
        <button
          onClick={() => navigate('/statistics')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '20px',
            padding: '0.4rem 1rem',
            cursor: 'pointer',
            color: 'white',
            fontSize: '18px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
          }}
        >
          查看统计详情
          <img 
              src="/icons/arrow-right.svg" 
              alt="查看统计"
              style={{
                width: '14px',
                height: '14px',
                filter: 'brightness(0) invert(1)'
              }}
            />
        </button>
      </div>
      
      {/* 统计卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem'
      }}>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</div>
          <div style={{ color: '#666' }}>总数</div>
        </div>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24' }}>{stats.want}</div>
          <div style={{ color: '#666' }}>想看</div>
        </div>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{stats.watched}</div>
          <div style={{ color: '#666' }}>已看</div>
        </div>
        <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>{stats.hold}</div>
          <div style={{ color: '#666' }}>搁置</div>
        </div>
      </div>
    </div>
  )
}