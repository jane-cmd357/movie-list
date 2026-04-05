import { lazy, Suspense, useEffect, useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { MovieCard } from './components/MovieCard'
import { AddMovieForm } from './components/AddMovieForm'
import { SearchBar } from './components/SearchBar'
import { SkeletonCard } from './components/SkeletonCard'
import { DataTools } from './components/DataTools'
import { categoryConfig } from './config/categories'
import type { CategoryKey } from './config/categories'
import axios from 'axios'
import './index.css'

// 懒加载 Statistics 组件
const Statistics = lazy(() => import('./components/Statistics'))

// 定义项目的类型
export interface Movie {
  id: string
  title: string
  status: 'want' | 'watched' | 'hold'
  category: CategoryKey
  rating?: number
  poster?: string
  year?: string
  dateAdded: string
}

// 根据类型获取默认海报
function getDefaultPoster(category: CategoryKey): string {
  const defaultPosters: Record<CategoryKey, string> = {
    movie: '/defaults/movie-default.svg',
    tv: '/defaults/tv-default.svg',
    short: '/defaults/short-default.svg',
    novel: '/defaults/novel-default.svg',
    other: '/defaults/other-default.svg'
  }
  return defaultPosters[category] || '/defaults/movie-default.svg'
}

// 根据标题和类型搜索海报
async function fetchPoster(title: string, category: string): Promise<string | null> {
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const TMDB_BASE_URL = 'https://api.tmdb.org/3'
  try {
    let searchType = 'movie'
    if (category === 'tv') {
      searchType = 'tv'
    } else if (category === 'movie') {
      searchType = 'movie'
    } else {
      return null // 小说等其他类型不搜索
    }
    
    const response = await axios.get(`${TMDB_BASE_URL}/search/${searchType}`, {
      params: {
        api_key: TMDB_API_KEY,
        query: title,
        language: 'zh-CN',
        page: 1
      },
      timeout: 10000
    })
    
    const results = response.data.results
    if (results && results.length > 0) {
      const posterPath = results[0].poster_path
      if (posterPath) {
        return `https://image.tmdb.org/t/p/w185${posterPath}`
      }
    }
    return null
  } catch (error) {
    console.error(`获取海报失败 [${title}]:`, error)
    return null
  }
}

function App() {
  const [movies, setMovies] = useLocalStorage<Movie[]>('movie-list', [])
  const [filter, setFilter] = useState<'all' | 'want' | 'watched' | 'hold'>('all')
  const [categoryFilter, setCategoryFilter] = useState<CategoryKey | 'all'>('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingPosters, setIsFetchingPosters] = useState(false)
  const [posterProgress, setPosterProgress] = useState({ current: 0, total: 0 })

  // 数据迁移：处理旧数据（没有 category 字段）
  useEffect(() => {
    let needMigrate = false
    let newMovies = [...movies]

    // 1. 迁移 category（旧数据没有 category 字段）
    const hasOldCategory = movies.some(movie => !('category' in movie))
    if (hasOldCategory) {
      newMovies = newMovies.map(movie => ({
        ...movie,
        category: ('category' in movie ? movie.category : 'movie') as CategoryKey
      }))
      needMigrate = true
    }

    // 2. 迁移 status（旧数据使用 'abandoned'，改为 'hold'）
    const hasOldStatus = movies.some(movie => (movie as { status: string }).status === 'abandoned')
    if (hasOldStatus) {
      newMovies = newMovies.map(movie => ({
        ...movie,
        status: (movie as { status: string }).status === 'abandoned' ? 'hold' : movie.status
      })) as Movie[]
      needMigrate = true
    }

    // 3. 为没有海报的旧数据添加默认海报
    const hasNoPoster = newMovies.some(movie => !movie.poster)
    if (hasNoPoster) {
      newMovies = newMovies.map(movie => ({
        ...movie,
        poster: movie.poster || getDefaultPoster(movie.category)
      }))
      needMigrate = true
    }

    if (needMigrate) {
      setMovies(newMovies)
      console.log('数据迁移完成，旧数据已添加 category 字段')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 模拟初始加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // 自动补全没有海报的旧数据（通过 TMDB API）
  const autoFetchMissingPosters = async () => {
    // 找出没有海报或海报是默认图标的电影/电视剧
    const missingPosterMovies = movies.filter(
      m => (!m.poster || m.poster.includes('/defaults/')) && (m.category === 'movie' || m.category === 'tv')
    )
    
    if (missingPosterMovies.length === 0) {
      alert('所有影视作品已有海报！')
      return
    }
    
    setIsFetchingPosters(true)
    setPosterProgress({ current: 0, total: missingPosterMovies.length })
    
    const updatedMovies = [...movies]
    
    for (let i = 0; i < missingPosterMovies.length; i++) {
      const movie = missingPosterMovies[i]
      const poster = await fetchPoster(movie.title, movie.category)
      
      if (poster) {
        const index = updatedMovies.findIndex(m => m.id === movie.id)
        if (index !== -1) {
          updatedMovies[index] = { ...updatedMovies[index], poster }
        }
      }
      
      setPosterProgress({ current: i + 1, total: missingPosterMovies.length })
      // 添加延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 300))
    }
    
    setMovies(updatedMovies)
    setIsFetchingPosters(false)
    alert(`已完成！共为 ${missingPosterMovies.length} 部作品尝试添加海报`)
  }

  // 添加电影（支持类型、海报、年份）
  const addMovie = (title: string, category: CategoryKey, poster?: string, year?: string) => {
    const newMovie: Movie = {
      id: Date.now().toString(),
      title,
      category,
      status: 'want',
      poster: poster || undefined,
      year: year || undefined,
      dateAdded: new Date().toISOString()
    }
    setMovies([newMovie, ...movies])
  }

  // 更新作品状态
  const updateStatus = (id: string, status: Movie['status']) => {
    setMovies(movies.map(movie => 
      movie.id === id ? { ...movie, status } : movie
    ))
  }

  // 编辑类型
  const editCategory = (id: string, newCategory: CategoryKey) => {
    setMovies(movies.map(movie => 
      movie.id === id ? { ...movie, category: newCategory } : movie
    ))
  }

  // 删除作品
  const deleteMovie = (id: string) => {
    if (confirm('确定要删除吗？')) {
      setMovies(movies.filter(movie => movie.id !== id))
    }
  }

  // 筛选作品（状态筛选 + 搜索筛选）
  const filteredMovies = movies
    .filter(movie => filter === 'all' ? true : movie.status === filter)
    .filter(movie => categoryFilter === 'all' ? true : movie.category === categoryFilter)
    .filter(movie => 
      searchKeyword === '' || 
      movie.title.toLowerCase().includes(searchKeyword.toLowerCase())
    )

  // 统计信息
  const stats = {
    total: movies.length,
    want: movies.filter(m => m.status === 'want').length,
    watched: movies.filter(m => m.status === 'watched').length,
    hold: movies.filter(m => m.status === 'hold').length
  }

  return (
    <div className="app">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h1 style={{ margin: 0 }}> 个人追更助手</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {/* 补全海报按钮 */}
          <button
            onClick={autoFetchMissingPosters}
            disabled={isFetchingPosters}
            style={{
              padding: '0.5rem 1rem',
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isFetchingPosters ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem',
              fontWeight: '500',
              opacity: isFetchingPosters ? 0.6 : 1,
              transition: 'all 0.2s',
              minWidth: '100px',
              height: '36px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            {isFetchingPosters ? `获取海报中 ${posterProgress.current}/${posterProgress.total}` : '🎬 补全海报'}
          </button>
          <DataTools movies={movies} setMovies={setMovies} />
        </div>
      </div>

      {/* 进度提示 */}
      {isFetchingPosters && (
        <div style={{
          background: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          color: '#666'
        }}>
          正在获取海报... {posterProgress.current}/{posterProgress.total}
          <div style={{
            width: '100%',
            height: '4px',
            background: '#e5e7eb',
            borderRadius: '2px',
            marginTop: '6px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(posterProgress.current / posterProgress.total) * 100}%`,
              height: '100%',
              background: '#8b5cf6',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
      )}

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
          { key: 'hold', label: '📦 搁置', color: '#ef4444' }
        ].map(btn => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key as 'all' | 'want' | 'watched' | 'hold')}
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

      {/* 类型筛选按钮 */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setCategoryFilter('all')}
          style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            border: `2px solid #6b7280`,
            background: categoryFilter === 'all' ? '#6b7280' : 'white',
            color: categoryFilter === 'all' ? 'white' : '#6b7280',
            cursor: 'pointer',
            fontSize: '0.85rem',
            transition: 'all 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          全部类型
        </button>
        
        {Object.entries(categoryConfig).map(([key, { text, color, icon }]) => (
          <button
            key={key}
            onClick={() => setCategoryFilter(key as CategoryKey)}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '20px',
              border: `2px solid ${color}`,
              background: categoryFilter === key ? color : 'white',
              color: categoryFilter === key ? 'white' : color,
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <img 
              src={icon} 
              alt={text}
              style={{
                width: '14px',
                height: '14px',
                filter: categoryFilter === key ? 'brightness(0) invert(1)' : 'none'
              }}
            />
            {text}
          </button>
        ))}
      </div>

      {/* 搜索框 */}
      <SearchBar onSearch={setSearchKeyword} />

      {/* 添加表单 */}
      <AddMovieForm onAdd={addMovie} />

      {/* 作品列表 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem',
        marginTop: '1.5rem'
      }}>
        {isLoading ? (
          Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          filteredMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onStatusChange={updateStatus}
              onEditCategory={editCategory}
              onDelete={deleteMovie}
            />
          ))
        )}
      </div>

      {/* 空状态提示 */}
      {!isLoading && filteredMovies.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'white',
          fontSize: '1.1rem'
        }}>
          {movies.length === 0 
            ? '🎬 点击上方按钮，添加你第一部想追的作品吧！' 
            : '📭 没有符合条件的作品噢~'}
        </div>
      )}
    </div>
  )
}

export default App