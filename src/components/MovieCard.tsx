import type { Movie } from '../App'
import { categoryConfig } from '../config/categories'
import type { CategoryKey } from '../config/categories'
import { useState } from 'react'

interface MovieCardProps {
  movie: Movie
  onStatusChange: (id: string, status: Movie['status']) => void
  onDelete: (id: string) => void
  onEditCategory: (id: string, newCategory: CategoryKey) => void
}

// 状态配置
const statusConfig: Record<Movie['status'], { emoji: string; text: string; color: string }> = {
  want: { emoji: '👀', text: '想看', color: '#fbbf24' },
  watched: { emoji: '✅', text: '已看', color: '#10b981' },
  hold: { emoji: '📦', text: '搁置', color: '#ef4444' }
}

// 生成观看链接
function getWatchLinks(title: string) {
  const encodedTitle = encodeURIComponent(title)
  return [
    { name: '哔哩哔哩', url: `https://search.bilibili.com?keyword=${encodedTitle}`, color: '#FF588E' },
    { name: '腾讯视频', url: `https://v.qq.com/x/search/?q=${encodedTitle}`, color: '#00B4B3' },
    { name: '爱奇艺', url: `https://www.iqiyi.com/search?key=${encodedTitle}`, color: '#00BE06' },
    { name: '优酷', url: `https://so.youku.com/search_video/q_${encodedTitle}`, color: '#FF6600' },
    { name: '豆瓣', url: `https://search.douban.com/movie/subject_search?search_text=${encodedTitle}`, color: '#007722' }
  ]
}

export function MovieCard({ movie, onStatusChange, onDelete, onEditCategory }: MovieCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showLinks, setShowLinks] = useState(false)
  const config = statusConfig[movie.status]
  const category = categoryConfig[movie.category] || categoryConfig.other
  const watchLinks = getWatchLinks(movie.title)

  return (
    <>
      {/* 卡片内容 */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{ display: 'flex' }}>
          {/* 左侧海报 */}
          {movie.poster ? (
            <img 
              src={movie.poster} 
              alt={movie.title}
              style={{
                width: '80px',
                height: '120px',
                objectFit: 'cover',
                flexShrink: 0
              }}
              onError={(e) => {
                // 图片加载失败时替换为默认图标
                e.currentTarget.style.display = 'none'
                const parent = e.currentTarget.parentElement
                if (parent) {
                  const fallback = document.createElement('div')
                  fallback.style.cssText = 'width:80px;height:120px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  fallback.innerHTML = `<img src="${category.icon}" style="width:40px;height:40px;filter:brightness(0) invert(1)" />`
                  parent.insertBefore(fallback, e.currentTarget)
                  e.currentTarget.remove()
                }
              }}
            />
          ) : (
            <div style={{
              width: '80px',
              height: '120px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img 
                src={category.icon}
                alt={category.text}
                style={{
                  width: '40px',
                  height: '40px',
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </div>
          )}
          
          {/* 右侧内容 */}
          <div style={{ flex: 1, padding: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>{movie.title}</h3>
                  {movie.year && (
                    <span style={{ fontSize: '0.7rem', color: '#999' }}>{movie.year}</span>
                  )}
                  {/* 类型标签 */}
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: category.color,
                    color: 'white',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '10px',
                    fontSize: '0.6rem'
                  }}>
                    <img 
                      src={category.icon} 
                      alt={category.text}
                      style={{
                        width: '10px',
                        height: '10px',
                        filter: 'brightness(0) invert(1)'
                      }}
                    />
                    {category.text}
                  </span>
                </div>
              </div>
              
              {/* 按钮组 */}
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                {/* 观看链接按钮 */}
                <button
                  onClick={() => setShowLinks(!showLinks)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e7ff'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <img 
                    src="/icons/play.svg" 
                    alt="观看"
                    style={{ width: '16px', height: '16px', display: 'block' }}
                  />
                </button>
                
                {/* 编辑按钮 */}
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e7ff'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <img 
                    src="/icons/edit.svg" 
                    alt="编辑"
                    style={{ width: '16px', height: '16px', display: 'block' }}
                  />
                </button>
                
                {/* 删除按钮 */}
                <button
                  onClick={() => onDelete(movie.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <img 
                    src="/icons/delete.svg" 
                    alt="删除"
                    style={{ width: '16px', height: '16px', display: 'block' }}
                  />
                </button>
              </div>
            </div>
            
            {/* 状态标签 */}
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{
                display: 'inline-block',
                background: config.color,
                color: 'white',
                padding: '0.2rem 0.6rem',
                borderRadius: '16px',
                fontSize: '0.7rem'
              }}>
                {config.emoji} {config.text}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#999', marginLeft: '8px' }}>
                📅 {new Date(movie.dateAdded).toLocaleDateString()}
              </span>
            </div>

            {/* 观看链接列表 */}
            {showLinks && (
              <div style={{
                marginTop: '0.75rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '6px' }}>🔗 观看链接：</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {watchLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.7rem',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: link.color,
                        color: 'white',
                        textDecoration: 'none',
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 状态切换按钮 */}
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(Object.entries(statusConfig) as [Movie['status'], typeof statusConfig[Movie['status']]][]).map(([status, { emoji, text }]) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(movie.id, status)}
                  style={{
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem',
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
        </div>
      </div>

      {/* 编辑类型弹窗 - 独立全屏弹窗，放在卡片外面 */}
      {isEditing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }} onClick={() => setIsEditing(false)}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '1.5rem',
            width: '320px',
            maxWidth: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>修改类型</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(Object.entries(categoryConfig) as [CategoryKey, typeof categoryConfig[CategoryKey]][]).map(([key, { text, color, icon }]) => (
                <button
                  key={key}
                  onClick={() => {
                    onEditCategory(movie.id, key)
                    setIsEditing(false)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: movie.category === key ? `2px solid ${color}` : '1px solid #e5e7eb',
                    background: movie.category === key ? `${color}15` : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  <img src={icon} alt={text} style={{ width: '24px', height: '24px' }} />
                  <span style={{ flex: 1, textAlign: 'left', fontWeight: movie.category === key ? 'bold' : 'normal' }}>{text}</span>
                  {movie.category === key && <span style={{ color: color, fontSize: '1.2rem' }}>✓</span>}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                marginTop: '1rem',
                width: '100%',
                padding: '0.6rem',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
            >
              取消
            </button>
          </div>
        </div>
      )}
    </>
  )
}