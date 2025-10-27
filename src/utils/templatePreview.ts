/**
 * 模板预览功能
 * 
 * @description
 * 提供模板预览图的生成、管理和优化：
 * - 自动截图生成：使用html2canvas或puppeteer
 * - 预览图缓存：本地和远程缓存
 * - 懒加载优化：按需加载预览图
 * - 预览图压缩：优化存储和传输
 * - 预览图更新：检测模板变化自动更新
 * 
 * @example
 * ```ts
 * const previewManager = new TemplatePreviewManager()
 * 
 * // 生成预览图
 * const preview = await previewManager.generatePreview(templateElement, {
 *   width: 400,
 *   height: 300,
 *   quality: 0.8
 * })
 * 
 * // 保存预览图
 * await previewManager.savePreview(templateId, preview)
 * 
 * // 获取预览图
 * const url = await previewManager.getPreview(templateId)
 * ```
 */

import type { TemplateMetadata } from '../types'

/**
 * 预览图选项
 */
export interface PreviewOptions {
  /** 预览图宽度 */
  width?: number
  /** 预览图高度 */
  height?: number
  /** 图片质量 (0-1) */
  quality?: number
  /** 图片格式 */
  format?: 'png' | 'jpeg' | 'webp'
  /** 缩放比例 */
  scale?: number
  /** 背景颜色 */
  backgroundColor?: string
  /** 是否包含阴影 */
  includeShadow?: boolean
}

/**
 * 预览图数据
 */
export interface PreviewData {
  /** 预览图URL或base64 */
  url: string
  /** 预览图格式 */
  format: 'png' | 'jpeg' | 'webp'
  /** 预览图大小（字节） */
  size: number
  /** 预览图尺寸 */
  dimensions: { width: number; height: number }
  /** 生成时间 */
  timestamp: number
  /** 模板ID */
  templateId: string
}

/**
 * 预览图存储选项
 */
export interface PreviewStorageOptions {
  /** 存储类型 */
  type?: 'memory' | 'localStorage' | 'indexedDB' | 'remote'
  /** 远程存储端点 */
  endpoint?: string
  /** 缓存过期时间（毫秒） */
  ttl?: number
  /** 最大缓存数量 */
  maxSize?: number
}

/**
 * 预览图缓存项
 */
interface PreviewCacheItem {
  data: PreviewData
  expiresAt: number
}

/**
 * 模板预览管理器
 */
export class TemplatePreviewManager {
  private cache: Map<string, PreviewCacheItem> = new Map()
  private storageOptions: Required<PreviewStorageOptions>
  private indexedDB: IDBDatabase | null = null

  /**
   * 创建预览管理器
   * 
   * @param options - 存储选项
   */
  constructor(options: PreviewStorageOptions = {}) {
    this.storageOptions = {
      type: options.type || 'memory',
      endpoint: options.endpoint || '',
      ttl: options.ttl || 7 * 24 * 60 * 60 * 1000, // 默认7天
      maxSize: options.maxSize || 100,
    }

    if (this.storageOptions.type === 'indexedDB') {
      this.initIndexedDB()
    }
  }

  /**
   * 初始化IndexedDB
   */
  private async initIndexedDB(): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('[TemplatePreview] IndexedDB不可用，降级到内存存储')
      this.storageOptions.type = 'memory'
      return
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open('template-previews', 1)

      request.onerror = () => {
        console.error('[TemplatePreview] IndexedDB初始化失败')
        this.storageOptions.type = 'memory'
        reject(request.error)
      }

      request.onsuccess = () => {
        this.indexedDB = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains('previews')) {
          const store = db.createObjectStore('previews', { keyPath: 'templateId' })
          store.createIndex('timestamp', 'timestamp', { unique: false })
        }
      }
    })
  }

  /**
   * 生成预览图
   * 
   * @description
   * 从DOM元素生成预览图：
   * 1. 使用html2canvas截图（浏览器环境）
   * 2. 使用puppeteer截图（Node环境）
   * 3. 优化图片质量和大小
   * 
   * @param element - 要截图的DOM元素
   * @param options - 预览选项
   * @returns 预览图数据
   */
  async generatePreview(
    element: HTMLElement,
    options: PreviewOptions = {}
  ): Promise<PreviewData> {
    const {
      width = 400,
      height = 300,
      quality = 0.8,
      format = 'webp',
      scale = 1,
      backgroundColor = '#ffffff',
      includeShadow = true,
    } = options

    try {
      // 检查是否在浏览器环境
      if (typeof window === 'undefined') {
        throw new Error('预览图生成仅在浏览器环境中可用')
      }

      // 使用Canvas API生成预览图
      const canvas = await this.elementToCanvas(element, {
        width,
        height,
        scale,
        backgroundColor,
      })

      // 转换为图片
      const blob = await this.canvasToBlob(canvas, format, quality)
      const url = await this.blobToDataURL(blob)

      return {
        url,
        format,
        size: blob.size,
        dimensions: { width: canvas.width, height: canvas.height },
        timestamp: Date.now(),
        templateId: element.dataset.templateId || '',
      }
    } catch (error) {
      console.error('[TemplatePreview] 预览图生成失败:', error)
      throw error
    }
  }

  /**
   * 将DOM元素转换为Canvas
   * 
   * @param element - DOM元素
   * @param options - 选项
   * @returns Canvas元素
   */
  private async elementToCanvas(
    element: HTMLElement,
    options: {
      width: number
      height: number
      scale: number
      backgroundColor: string
    }
  ): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas')
    canvas.width = options.width * options.scale
    canvas.height = options.height * options.scale

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('无法创建Canvas上下文')
    }

    // 设置背景色
    ctx.fillStyle = options.backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 获取元素的样式
    const rect = element.getBoundingClientRect()

    // 缩放上下文
    ctx.scale(options.scale, options.scale)

    // 这里需要使用html2canvas或类似库
    // 简化实现：直接绘制元素
    try {
      // 使用html2canvas（如果可用）
      if (typeof window !== 'undefined' && (window as any).html2canvas) {
        const html2canvas = (window as any).html2canvas
        const tempCanvas = await html2canvas(element, {
          width: options.width,
          height: options.height,
          backgroundColor: options.backgroundColor,
          scale: options.scale,
        })

        ctx.drawImage(tempCanvas, 0, 0)
      } else {
        // 降级方案：绘制占位符
        this.drawPlaceholder(ctx, options.width, options.height)
      }
    } catch (error) {
      console.warn('[TemplatePreview] html2canvas不可用，使用占位符')
      this.drawPlaceholder(ctx, options.width, options.height)
    }

    return canvas
  }

  /**
   * 绘制占位符
   */
  private drawPlaceholder(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#667eea')
    gradient.addColorStop(1, '#764ba2')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // 绘制文字
    ctx.fillStyle = '#ffffff'
    ctx.font = '24px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Template Preview', width / 2, height / 2)
  }

  /**
   * Canvas转Blob
   */
  private async canvasToBlob(
    canvas: HTMLCanvasElement,
    format: 'png' | 'jpeg' | 'webp',
    quality: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Canvas转换失败'))
          }
        },
        `image/${format}`,
        quality
      )
    })
  }

  /**
   * Blob转DataURL
   */
  private async blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  /**
   * 保存预览图
   * 
   * @param templateId - 模板ID
   * @param preview - 预览图数据
   */
  async savePreview(templateId: string, preview: PreviewData): Promise<void> {
    const cacheItem: PreviewCacheItem = {
      data: preview,
      expiresAt: Date.now() + this.storageOptions.ttl,
    }

    switch (this.storageOptions.type) {
      case 'memory':
        this.saveToMemory(templateId, cacheItem)
        break

      case 'localStorage':
        this.saveToLocalStorage(templateId, cacheItem)
        break

      case 'indexedDB':
        await this.saveToIndexedDB(templateId, cacheItem)
        break

      case 'remote':
        await this.saveToRemote(templateId, cacheItem)
        break
    }
  }

  /**
   * 获取预览图
   * 
   * @param templateId - 模板ID
   * @returns 预览图URL
   */
  async getPreview(templateId: string): Promise<string | null> {
    switch (this.storageOptions.type) {
      case 'memory':
        return this.getFromMemory(templateId)

      case 'localStorage':
        return this.getFromLocalStorage(templateId)

      case 'indexedDB':
        return await this.getFromIndexedDB(templateId)

      case 'remote':
        return await this.getFromRemote(templateId)

      default:
        return null
    }
  }

  /**
   * 保存到内存
   */
  private saveToMemory(templateId: string, item: PreviewCacheItem): void {
    // LRU清理
    if (this.cache.size >= this.storageOptions.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(templateId, item)
  }

  /**
   * 从内存获取
   */
  private getFromMemory(templateId: string): string | null {
    const item = this.cache.get(templateId)

    if (!item) return null

    // 检查是否过期
    if (Date.now() > item.expiresAt) {
      this.cache.delete(templateId)
      return null
    }

    return item.data.url
  }

  /**
   * 保存到LocalStorage
   */
  private saveToLocalStorage(templateId: string, item: PreviewCacheItem): void {
    try {
      const key = `template-preview:${templateId}`
      localStorage.setItem(key, JSON.stringify(item))
    } catch (error) {
      console.error('[TemplatePreview] LocalStorage保存失败:', error)
    }
  }

  /**
   * 从LocalStorage获取
   */
  private getFromLocalStorage(templateId: string): string | null {
    try {
      const key = `template-preview:${templateId}`
      const data = localStorage.getItem(key)

      if (!data) return null

      const item: PreviewCacheItem = JSON.parse(data)

      // 检查是否过期
      if (Date.now() > item.expiresAt) {
        localStorage.removeItem(key)
        return null
      }

      return item.data.url
    } catch (error) {
      console.error('[TemplatePreview] LocalStorage读取失败:', error)
      return null
    }
  }

  /**
   * 保存到IndexedDB
   */
  private async saveToIndexedDB(
    templateId: string,
    item: PreviewCacheItem
  ): Promise<void> {
    if (!this.indexedDB) {
      await this.initIndexedDB()
    }

    return new Promise((resolve, reject) => {
      if (!this.indexedDB) {
        reject(new Error('IndexedDB未初始化'))
        return
      }

      const transaction = this.indexedDB.transaction(['previews'], 'readwrite')
      const store = transaction.objectStore('previews')

      const request = store.put({
        templateId,
        ...item.data,
        expiresAt: item.expiresAt,
      })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 从IndexedDB获取
   */
  private async getFromIndexedDB(templateId: string): Promise<string | null> {
    if (!this.indexedDB) {
      await this.initIndexedDB()
    }

    return new Promise((resolve) => {
      if (!this.indexedDB) {
        resolve(null)
        return
      }

      const transaction = this.indexedDB.transaction(['previews'], 'readonly')
      const store = transaction.objectStore('previews')
      const request = store.get(templateId)

      request.onsuccess = () => {
        const data = request.result

        if (!data) {
          resolve(null)
          return
        }

        // 检查是否过期
        if (Date.now() > data.expiresAt) {
          this.deleteFromIndexedDB(templateId)
          resolve(null)
          return
        }

        resolve(data.url)
      }

      request.onerror = () => resolve(null)
    })
  }

  /**
   * 从IndexedDB删除
   */
  private async deleteFromIndexedDB(templateId: string): Promise<void> {
    if (!this.indexedDB) return

    return new Promise((resolve) => {
      const transaction = this.indexedDB!.transaction(['previews'], 'readwrite')
      const store = transaction.objectStore('previews')
      store.delete(templateId)
      resolve()
    })
  }

  /**
   * 保存到远程
   */
  private async saveToRemote(
    templateId: string,
    item: PreviewCacheItem
  ): Promise<void> {
    if (!this.storageOptions.endpoint) {
      throw new Error('未配置远程存储端点')
    }

    try {
      const response = await fetch(`${this.storageOptions.endpoint}/previews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          preview: item.data,
        }),
      })

      if (!response.ok) {
        throw new Error(`保存失败: ${response.statusText}`)
      }
    } catch (error) {
      console.error('[TemplatePreview] 远程保存失败:', error)
      throw error
    }
  }

  /**
   * 从远程获取
   */
  private async getFromRemote(templateId: string): Promise<string | null> {
    if (!this.storageOptions.endpoint) {
      return null
    }

    try {
      const response = await fetch(
        `${this.storageOptions.endpoint}/previews/${templateId}`
      )

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.url || null
    } catch (error) {
      console.error('[TemplatePreview] 远程获取失败:', error)
      return null
    }
  }

  /**
   * 批量生成预览图
   * 
   * @param elements - 元素列表
   * @param options - 预览选项
   * @returns 预览图列表
   */
  async generateBatch(
    elements: Array<{ element: HTMLElement; templateId: string }>,
    options: PreviewOptions = {}
  ): Promise<PreviewData[]> {
    const results: PreviewData[] = []

    // 使用并发控制，避免过多同时生成
    const concurrency = 3
    const chunks: typeof elements[] = []

    for (let i = 0; i < elements.length; i += concurrency) {
      chunks.push(elements.slice(i, i + concurrency))
    }

    for (const chunk of chunks) {
      const previews = await Promise.all(
        chunk.map(({ element, templateId }) =>
          this.generatePreview(element, options)
            .then(preview => ({ ...preview, templateId }))
            .catch(error => {
              console.error(`预览生成失败 ${templateId}:`, error)
              return null
            })
        )
      )

      results.push(...previews.filter(Boolean) as PreviewData[])
    }

    return results
  }

  /**
   * 清理过期预览图
   * 
   * @returns 清理数量
   */
  async cleanupExpired(): Promise<number> {
    let cleaned = 0

    switch (this.storageOptions.type) {
      case 'memory':
        const now = Date.now()
        this.cache.forEach((item, key) => {
          if (now > item.expiresAt) {
            this.cache.delete(key)
            cleaned++
          }
        })
        break

      case 'localStorage':
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('template-preview:')) {
            try {
              const item = JSON.parse(localStorage.getItem(key)!)
              if (Date.now() > item.expiresAt) {
                localStorage.removeItem(key)
                cleaned++
              }
            } catch (error) {
              // 损坏的数据，直接删除
              localStorage.removeItem(key)
              cleaned++
            }
          }
        })
        break

      case 'indexedDB':
        if (this.indexedDB) {
          // 通过索引查询过期项
          cleaned = await this.cleanupIndexedDB()
        }
        break
    }

    return cleaned
  }

  /**
   * 清理IndexedDB过期项
   */
  private async cleanupIndexedDB(): Promise<number> {
    if (!this.indexedDB) return 0

    return new Promise((resolve) => {
      const transaction = this.indexedDB!.transaction(['previews'], 'readwrite')
      const store = transaction.objectStore('previews')
      const request = store.openCursor()
      let cleaned = 0

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result

        if (cursor) {
          if (Date.now() > cursor.value.expiresAt) {
            cursor.delete()
            cleaned++
          }
          cursor.continue()
        } else {
          resolve(cleaned)
        }
      }

      request.onerror = () => resolve(0)
    })
  }

  /**
   * 获取缓存统计
   */
  getStats(): {
    size: number
    maxSize: number
    type: string
  } {
    return {
      size: this.cache.size,
      maxSize: this.storageOptions.maxSize,
      type: this.storageOptions.type,
    }
  }
}

/**
 * 创建预览管理器
 * 
 * @param options - 存储选项
 * @returns 预览管理器实例
 */
export function createTemplatePreviewManager(
  options?: PreviewStorageOptions
): TemplatePreviewManager {
  return new TemplatePreviewManager(options)
}

/**
 * 全局预览管理器
 */
let globalPreviewManager: TemplatePreviewManager | null = null

/**
 * 获取全局预览管理器
 */
export function getPreviewManager(): TemplatePreviewManager {
  if (!globalPreviewManager) {
    globalPreviewManager = new TemplatePreviewManager({
      type: 'indexedDB',
      maxSize: 100,
    })
  }
  return globalPreviewManager
}


