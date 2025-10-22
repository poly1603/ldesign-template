/**
 * 样式加载助手 - 自动加载组件样式
 */

/**
 * LRU 缓存实现用于样式管理
 */
class StyleLRUCache {
  private cache = new Map<string, { element: HTMLLinkElement; timestamp: number }>()
  private readonly maxSize: number

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize
  }

  set(key: string, element: HTMLLinkElement): void {
    // 如果已存在，先删除（以便重新插入到末尾）
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }

    // 如果超过最大容量，删除最久未使用的（第一个）
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        const entry = this.cache.get(firstKey)
        if (entry) {
          entry.element.remove()
        }
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, { element, timestamp: Date.now() })
  }

  get(key: string): HTMLLinkElement | undefined {
    const entry = this.cache.get(key)
    if (entry) {
      // 更新访问时间（刷新LRU）
      this.cache.delete(key)
      this.cache.set(key, { ...entry, timestamp: Date.now() })
      return entry.element
    }
    return undefined
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key)
    if (entry) {
      entry.element.remove()
      return this.cache.delete(key)
    }
    return false
  }

  clear(): void {
    this.cache.forEach(entry => entry.element.remove())
    this.cache.clear()
  }

  get size(): number {
    return this.cache.size
  }

  /**
   * 清理超过指定时间未使用的样式
   */
  cleanupOld(maxAge: number = 300000): void { // 默认5分钟
    const now = Date.now()
    const toDelete: string[] = []

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > maxAge) {
        toDelete.push(key)
      }
    })

    toDelete.forEach(key => this.delete(key))
  }
}

const styleLRU = new StyleLRUCache(100)
let cleanupTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 加载组件样式 - 使用 LRU 缓存
 */
export function loadComponentStyle(
  category: string,
  device: string,
  name: string,
  componentPath?: string
): void {
  // 只在浏览器环境中加载样式
  if (typeof document === 'undefined') {
    return
  }

  const styleId = `template-style-${category}-${device}-${name}`

  // 检查样式是否已经在 LRU 缓存中
  if (styleLRU.has(styleId)) {
    // 访问以更新 LRU
    styleLRU.get(styleId)
    return
  }

  // 检查 DOM 中是否已存在
  const existingElement = document.getElementById(styleId)
  if (existingElement) {
    // 添加到 LRU 缓存
    styleLRU.set(styleId, existingElement as HTMLLinkElement)
    return
  }

  // 如果提供了组件路径，尝试加载对应的样式
  if (componentPath && componentPath.endsWith('.vue.js')) {
    const stylePath = componentPath.replace('.vue.js', '.vue.css')

    try {
      // 创建 link 元素
      const link = document.createElement('link')
      link.id = styleId
      link.rel = 'stylesheet'

      // 构建样式文件的URL
      // 处理相对路径
      if (stylePath.startsWith('../')) {
        // 从 import.meta.url 构建完整URL
        const baseUrl = new URL(import.meta.url)
        const styleUrl = new URL(stylePath, baseUrl)
        link.href = styleUrl.href
      } else {
        link.href = stylePath
      }

      // 添加到文档
      document.head.appendChild(link)

      // 添加到 LRU 缓存（自动处理容量限制和淘汰）
      styleLRU.set(styleId, link)

      // 定期清理未使用样式
      scheduleCleanup()

    } catch (error) {
      console.warn(`[StyleLoader] 无法加载样式: ${stylePath}`, error)
    }
  }
}

/**
 * 批量加载样式 - 使用 LRU 缓存
 */
export function loadStyles(paths: string[]): void {
  if (typeof document === 'undefined') {
    return
  }

  paths.forEach(path => {
    const id = `style-${path.replace(/[^a-z0-9]/gi, '-')}`

    if (styleLRU.has(id)) {
      styleLRU.get(id)
      return
    }

    const existingElement = document.getElementById(id)
    if (existingElement) {
      styleLRU.set(id, existingElement as HTMLLinkElement)
      return
    }

    try {
      const link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      link.href = path
      document.head.appendChild(link)
      styleLRU.set(id, link)
    } catch (error) {
      console.warn(`[StyleLoader] 无法加载样式: ${path}`, error)
    }
  })
}

/**
 * 加载全局样式
 */
export function loadGlobalStyles(): void {
  // 尝试加载主样式文件
  loadStyles([
    '@ldesign/template/index.css',
    '@ldesign/template/es/index.css',
  ])
}

/**
 * 移除单个样式
 */
export function removeStyle(id: string): void {
  styleLRU.delete(id)
}

/**
 * 清除已加载的样式
 */
export function clearLoadedStyles(): void {
  if (cleanupTimer) {
    clearTimeout(cleanupTimer)
    cleanupTimer = null
  }

  styleLRU.clear()
}

/**
 * 定期清理调度器 - 清理超过5分钟未使用的样式
 */
function scheduleCleanup(): void {
  if (cleanupTimer) return

  cleanupTimer = setTimeout(() => {
    styleLRU.cleanupOld(300000) // 清理5分钟未使用的样式
    cleanupTimer = null
    // 递归调度下次清理
    scheduleCleanup()
  }, 60000) // 每分钟检查一次
}

/**
 * 清除未使用的样式 - 基于 DOM 检查
 */
export function cleanupUnusedStyles(): void {
  const usedStyles = new Set<string>()

  // 检查DOM中实际使用的模板
  document.querySelectorAll('[data-template-style]').forEach(el => {
    const styleId = el.getAttribute('data-template-style')
    if (styleId) usedStyles.add(styleId)
  })

  // LRU 缓存会自动处理淘汰，这里仅记录统计
  if (import.meta.env.DEV) {
    console.log(`[StyleLoader] Active styles: ${usedStyles.size}, Cached: ${styleLRU.size}`)
  }
}
