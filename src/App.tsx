import { lazy, Suspense, useEffect, useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { MovieCard } from './components/MovieCard'
import { AddMovieForm } from './components/AddMovieForm'
import { SearchBar } from './components/SearchBar'
import { SkeletonCard } from './components/SkeletonCard'
import { DataTools } from './components/DataTools'
import './index.css'

  // 懒加载 Statistics 组件
  const Statistics = lazy(() => import('./components/Statistics'))

  // 定义影视项目的类型
  export interface Movie {
    id: string
    title: string
    status: 'want' | 'watched' | 'abandoned'
    rating?: number
    poster?: string
    dateAdded: string
  }

function App() {
  const [movies, setMovies] = useLocalStorage<Movie[]>('movie-list', [])
  const [filter, setFilter] = useState<'all' | 'want' | 'watched' | 'abandoned'>('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // 模拟初始加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // 添加电影
  const addMovie = (title: string) => {
    const newMovie: Movie = {
      id: Date.now().toString(),
      title,
      status: 'want', // 默认状态：想看
      dateAdded: new Date().toISOString()
    }
    setMovies([newMovie, ...movies])
  }

  // 更新电影状态
  const updateStatus = (id: string, status: Movie['status']) => {
    setMovies(movies.map(movie => 
      movie.id === id ? { ...movie, status } : movie
    ))
  }

  // 删除电影
  const deleteMovie = (id: string) => {
    if (confirm('确定要删除吗？')) {
      setMovies(movies.filter(movie => movie.id !== id))
    }
  }

  // 筛选电影（状态筛选 + 搜索筛选）
  const filteredMovies = movies
  .filter(movie => filter === 'all' ? true : movie.status === filter)
  .filter(movie => 
    searchKeyword === '' || 
    movie.title.toLowerCase().includes(searchKeyword.toLowerCase())
  )

  // 统计信息
  const stats = {
    total: movies.length,
    want: movies.filter(m => m.status === 'want').length,
    watched: movies.filter(m => m.status === 'watched').length,
    abandoned: movies.filter(m => m.status === 'abandoned').length
  }

  return (
  <div className="app">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <h1 style={{ margin: 0 }}>🎬 个人影视清单助手</h1>
      <DataTools movies={movies} setMovies={setMovies} />
    </div>

      {/* 统计卡片 - 懒加载 */}
      <Suspense fallback={<div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '12px', 
        textAlign: 'center',
        marginBottom: '2rem'
      }}>加载统计中...</div>}>
        <Statistics stats={stats} />
      </Suspense>      

      {/* 筛选按钮 */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        justifyContent: 'center'
      }}>
        {[
          { key: 'all', label: '全部', color: '#667eea' },
          { key: 'want', label: '👀 想看', color: '#fbbf24' },
          { key: 'watched', label: '✅ 已看', color: '#10b981' },
          { key: 'abandoned', label: '💔 弃剧', color: '#ef4444' }
        ].map(btn => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key as 'all' | 'want' | 'watched' | 'abandoned')}
            style={{
              padding: '0.5rem 1rem',
              background: filter === btn.key ? btn.color : 'white',
              color: filter === btn.key ? 'white' : btn.color,
              border: `2px solid ${btn.color}`,
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* 搜索框 */}
      <SearchBar onSearch={setSearchKeyword} />

      {/* 添加表单 */}
      <AddMovieForm onAdd={addMovie} />

      {/* 电影列表 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem',
        marginTop: '1.5rem'
      }}>
        {isLoading ? (
          // 显示骨架屏
          Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          filteredMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onStatusChange={updateStatus}
              onDelete={deleteMovie}
            />
          ))
        )}
      </div>

      {/* 空状态提示 */}
      {filteredMovies.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'white',
          fontSize: '1.1rem'
        }}>
          {movies.length === 0 
            ? '🎬 点击上方按钮，添加你的第一部电影吧！' 
            : '📭 没有符合条件的影片'}
        </div>
      )}
    </div>
  )
}

export default App