import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { categoryConfig } from '../config/categories'
import type { Movie } from '../App'

// 颜色配置
const COLORS = {
  movie: '#3b82f6',
  tv: '#8b5cf6',
  short: '#ec489a',
  novel: '#10b981',
  other: '#6b7280',
  want: '#fbbf24',
  watched: '#10b981',
  hold: '#ef4444'
}

export function StatisticsDetail() {
  const navigate = useNavigate()
  
   // 直接在 useState 初始化时读取 localStorage
  const [movies] = useState<Movie[]>(() => {
    const stored = localStorage.getItem('movie-list')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        console.error('读取数据失败', e)
        return []
      }
    }
    return []
  })

  // 1. 按类型统计
  const typeStats = Object.entries(categoryConfig).map(([key, { text, color }]) => ({
    name: text,
    value: movies.filter(m => m.category === key).length,
    color: color,
    key: key
  }))

  // 2. 按状态统计
  const statusStats = [
    { name: '想看', value: movies.filter(m => m.status === 'want').length, color: COLORS.want },
    { name: '已看', value: movies.filter(m => m.status === 'watched').length, color: COLORS.watched },
    { name: '搁置', value: movies.filter(m => m.status === 'hold').length, color: COLORS.hold }
  ]

  // 3. 按日期统计（最近7天）
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().slice(0, 10)
  }).reverse()

  const dailyStats = last7Days.map(date => {
    const dayMovies = movies.filter(m => m.dateAdded?.slice(0, 10) === date)
    return {
      date: date.slice(5),
      电影: dayMovies.filter(m => m.category === 'movie').length,
      电视剧: dayMovies.filter(m => m.category === 'tv').length,
      短剧: dayMovies.filter(m => m.category === 'short').length,
      小说: dayMovies.filter(m => m.category === 'novel').length,
      其它: dayMovies.filter(m => m.category === 'other').length
    }
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      {/* 返回按钮 */}
      <div style={{ marginBottom: '1.5rem' }}>
      <button
        onClick={() => navigate('/')}
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
          fontSize: '0.85rem',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
        }}
      >
        <img 
          src="/icons/arrow-left.svg" 
          alt="返回"
          style={{
          width: '14px',
          height: '14px',
          filter: 'brightness(0) invert(1)'
          }}
        />
        返回
      </button>
    </div>

      <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '2rem' }}> 统计详情</h1>

      {/* 总览卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>{movies.length}</div>
          <div style={{ color: '#666' }}>总作品数</div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{movies.filter(m => m.status === 'watched').length}</div>
          <div style={{ color: '#666' }}>已完成</div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24' }}>{movies.filter(m => m.status === 'want').length}</div>
          <div style={{ color: '#666' }}>待追更</div>
        </div>
      </div>

      {/* 图表区域 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* 类型分布饼图 */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem'}}>
            <img src="/icons/folder.svg" alt="类型分布" style={{ width: '20px', height: '20px'}} />
            <h3 style={{ margin: 0}}>类型分布</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeStats.filter(t => t.value > 0)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {typeStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 状态分布饼图 */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem'}}>
            <img src="/icons/check-circle.svg" alt="状态分布" style={{ width: '20px', height: '20px'}} />
            <h3 style={{ margin: 0}}>状态分布</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusStats.filter(s => s.value > 0)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {statusStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 类型数量柱状图 */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem'}}>
            <img src="/icons/chart-bar.svg" alt="类型数量统计" style={{ width: '20px', height: '20px'}} />
            <h3 style={{ margin: 0}}>类型数量统计</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {typeStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 每日添加趋势 */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem'}}>
            <img src="/icons/trending-up.svg" alt="近7天添加趋势" style={{ width: '20px', height: '20px'}} />
            <h3 style={{ margin: 0}}>近7天添加趋势</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="电影" stroke="#3b82f6" />
              <Line type="monotone" dataKey="电视剧" stroke="#8b5cf6" />
              <Line type="monotone" dataKey="短剧" stroke="#ec489a" />
              <Line type="monotone" dataKey="小说" stroke="#10b981" />
              <Line type="monotone" dataKey="其它" stroke="#6b7280" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}