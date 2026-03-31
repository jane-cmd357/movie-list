export function SkeletonCard() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start'
      }}>
        <div style={{
          width: '70%',
          height: '24px',
          background: '#e5e7eb',
          borderRadius: '4px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
        <div style={{
          width: '24px',
          height: '24px',
          background: '#e5e7eb',
          borderRadius: '4px'
        }} />
      </div>
      
      <div style={{ marginTop: '0.75rem' }}>
        <div style={{
          width: '80px',
          height: '28px',
          background: '#e5e7eb',
          borderRadius: '20px'
        }} />
      </div>
      
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
        <div style={{ width: '60px', height: '28px', background: '#e5e7eb', borderRadius: '6px' }} />
        <div style={{ width: '60px', height: '28px', background: '#e5e7eb', borderRadius: '6px' }} />
        <div style={{ width: '60px', height: '28px', background: '#e5e7eb', borderRadius: '6px' }} />
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}