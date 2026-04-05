// 类型配置
export const categoryConfig = {
  movie: { 
    text: '电影', 
    color: '#3b82f6',
    icon: '/icons/movie.svg'
  },
  tv: { 
    text: '电视剧', 
    color: '#8b5cf6',
    icon: '/icons/tv.svg'
  },
  short: { 
    text: '短剧', 
    color: '#ec489a',
    icon: '/icons/short.svg'
  },
  novel: { 
    text: '小说', 
    color: '#10b981',
    icon: '/icons/novel.svg'
  },
  other: { 
    text: '其它', 
    color: '#6b7280',
    icon: '/icons/other.svg'
  }
}

export type CategoryKey = keyof typeof categoryConfig