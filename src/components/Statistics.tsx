interface StatisticsProps {
  stats: {
    total: number
    want: number
    watched: number
    abandoned: number
  }
}

export default function Statistics({ stats }: StatisticsProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '1rem',
      marginBottom: '2rem'
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
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>{stats.abandoned}</div>
        <div style={{ color: '#666' }}>弃剧</div>
      </div>
    </div>
  )
}