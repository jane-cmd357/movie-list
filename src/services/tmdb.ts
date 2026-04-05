import axios from 'axios'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.tmdb.org/3'

// 检查 API Key 是否存在
if (!TMDB_API_KEY) {
  console.error('请在 .env 文件中设置 VITE_TMDB_API_KEY')
}

// 定义 TMDB 返回的数据类型
interface TmdbMovieItem {
  id: number
  title: string
  release_date: string
  poster_path: string | null
  overview: string
}

interface TmdbTvItem {
  id: number
  name: string
  first_air_date: string
  poster_path: string | null
  overview: string
}

export interface MovieResult {
  id: number
  title: string
  year: string
  poster: string | null
  overview: string
  type: 'movie' | 'tv'
}

// 搜索电影/电视剧
export async function searchMedia(query: string): Promise<MovieResult[]> {
  if (!query.trim()) return []
  
  try {
    // 同时搜索电影和电视剧
    const [movieRes, tvRes] = await Promise.all([
      axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query: query,
          language: 'zh-CN',
          page: 1
        },
        timeout: 10000  // 添加超时限制
      }),
      axios.get(`${TMDB_BASE_URL}/search/tv`, {
        params: {
          api_key: TMDB_API_KEY,
          query: query,
          language: 'zh-CN',
          page: 1
        },
        timeout: 10000
      })
    ])

    const movies: MovieResult[] = movieRes.data.results.map((item: TmdbMovieItem) => ({
      id: item.id,
      title: item.title,
      year: item.release_date ? item.release_date.slice(0, 4) : '',
      poster: item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : null,
      overview: item.overview || '',
      type: 'movie'
    }))
    
    const tvs: MovieResult[] = tvRes.data.results.map((item: TmdbTvItem) => ({
      id: item.id,
      title: item.name,
      year: item.first_air_date ? item.first_air_date.slice(0, 4) : '',
      poster: item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : null,
      overview: item.overview || '',
      type: 'tv'
    }))
    
    return [...movies, ...tvs].slice(0, 8)
  } catch (error) {
    console.error('搜索失败:', error)
    return []
  }
}

// 根据ID获取详情（可选，用于获取更详细的信息）
export async function getMediaDetail(id: number, type: 'movie' | 'tv') {
  const endpoint = type === 'movie' ? `/movie/${id}` : `/tv/${id}`
  
  const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
    params: {
      api_key: TMDB_API_KEY,
      language: 'zh-CN'
    }
  })
  
  return response.data
}