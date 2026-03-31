import type { Movie } from '../App'

// 导出数据为 JSON 文件
export function exportData(movies: Movie[]) {
  const dataStr = JSON.stringify(movies, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `movie-backup-${new Date().toISOString().slice(0, 19)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

// 导入数据
export function importData(file: File): Promise<Movie[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        // 验证数据格式
        if (Array.isArray(data) && data.every(item => item.id && item.title && item.status)) {
          resolve(data)
        } else {
          reject(new Error('文件格式不正确'))
        }
      } catch {
        // 解析失败，忽略错误对象
        reject(new Error('解析失败，请确保是有效的JSON文件'))
      }
    }
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsText(file)
  })
}