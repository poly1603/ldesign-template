/**
 * 模板管理系统工具函数
 */

import { DeviceType, TemplateFilter, Template, TemplateSortOptions } from '../types'

/**
 * 简单的事件发射器
 */
export class EventEmitter {
  private events: { [key: string]: Function[] } = {}

  on(event: string, listener: Function): void {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(listener)
  }

  off(event: string, listener: Function): void {
    if (!this.events[event]) return
    const index = this.events[event].indexOf(listener)
    if (index > -1) {
      this.events[event].splice(index, 1)
    }
  }

  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return
    this.events[event].forEach(listener => listener(...args))
  }

  removeAllListeners(event?: string): void {
    if (event) {
      delete this.events[event]
    } else {
      this.events = {}
    }
  }
}

/**
 * 设备检测工具类
 */
export class DeviceDetector {
  private static instance: DeviceDetector
  private currentDevice: DeviceType = DeviceType.DESKTOP
  private listeners: Array<(device: DeviceType) => void> = []
  private config = {
    mobileBreakpoint: 768,
    tabletBreakpoint: 1024
  }

  private constructor() {
    this.detectDevice()
    this.bindEvents()
  }

  static getInstance(): DeviceDetector {
    if (!DeviceDetector.instance) {
      DeviceDetector.instance = new DeviceDetector()
    }
    return DeviceDetector.instance
  }

  /**
   * 配置断点
   */
  configure(config: { mobileBreakpoint?: number; tabletBreakpoint?: number }) {
    this.config = { ...this.config, ...config }
    this.detectDevice()
  }

  /**
   * 检测当前设备类型
   */
  private detectDevice(): void {
    if (typeof window === 'undefined') {
      return
    }

    const width = window.innerWidth
    let newDevice: DeviceType

    if (width < this.config.mobileBreakpoint) {
      newDevice = DeviceType.MOBILE
    } else if (width < this.config.tabletBreakpoint) {
      newDevice = DeviceType.TABLET
    } else {
      newDevice = DeviceType.DESKTOP
    }

    if (newDevice !== this.currentDevice) {
      this.currentDevice = newDevice
      this.notifyListeners()
    }
  }

  /**
   * 绑定窗口变化事件
   */
  private bindEvents(): void {
    if (typeof window === 'undefined') {
      return
    }

    let resizeTimer: NodeJS.Timeout
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        this.detectDevice()
      }, 100)
    })
  }

  /**
   * 通知监听器
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentDevice))
  }

  /**
   * 获取当前设备类型
   */
  getCurrentDevice(): DeviceType {
    return this.currentDevice
  }

  /**
   * 添加设备变化监听器
   */
  addListener(listener: (device: DeviceType) => void): () => void {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  /**
   * 移除所有监听器
   */
  removeAllListeners(): void {
    this.listeners = []
  }
}

/**
 * 存储管理工具类
 */
export class StorageManager {
  private storageType: 'localStorage' | 'sessionStorage'

  constructor(storageType: 'localStorage' | 'sessionStorage' = 'localStorage') {
    this.storageType = storageType
  }

  /**
   * 获取存储实例
   */
  private getStorage(): Storage | null {
    if (typeof window === 'undefined') {
      return null
    }
    return window[this.storageType]
  }

  /**
   * 设置存储值
   */
  set<T>(key: string, value: T): boolean {
    try {
      const storage = this.getStorage()
      if (!storage) return false
      
      storage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.warn('Storage set failed:', error)
      return false
    }
  }

  /**
   * 获取存储值
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const storage = this.getStorage()
      if (!storage) return defaultValue || null
      
      const item = storage.getItem(key)
      if (item === null) return defaultValue || null
      
      return JSON.parse(item) as T
    } catch (error) {
      console.warn('Storage get failed:', error)
      return defaultValue || null
    }
  }

  /**
   * 移除存储值
   */
  remove(key: string): boolean {
    try {
      const storage = this.getStorage()
      if (!storage) return false
      
      storage.removeItem(key)
      return true
    } catch (error) {
      console.warn('Storage remove failed:', error)
      return false
    }
  }

  /**
   * 清空存储
   */
  clear(): boolean {
    try {
      const storage = this.getStorage()
      if (!storage) return false
      
      storage.clear()
      return true
    } catch (error) {
      console.warn('Storage clear failed:', error)
      return false
    }
  }

  /**
   * 检查键是否存在
   */
  has(key: string): boolean {
    const storage = this.getStorage()
    if (!storage) return false
    
    return storage.getItem(key) !== null
  }
}

/**
 * 模板路径工具
 */
export class TemplatePathUtils {
  /**
   * 标准化模板路径
   */
  static normalizePath(path: string): string {
    return path.replace(/\\/g, '/').replace(/\/+/g, '/')
  }

  /**
   * 解析模板路径
   */
  static parsePath(path: string): {
    category: string
    device: DeviceType
    templateName: string
  } | null {
    const normalizedPath = this.normalizePath(path)
    const parts = normalizedPath.split('/').filter(Boolean)
    
    // 新的三层结构：/src/templates/category/device/templateName/index.ts
    // 需要至少6个部分：['src', 'templates', 'category', 'device', 'templateName', 'index.ts']
    if (parts.length < 6) {
      return null
    }

    // 从路径中提取分类、设备类型和模板名称
    const templatesIndex = parts.findIndex(part => part === 'templates')
    if (templatesIndex === -1 || templatesIndex + 3 >= parts.length) {
      return null
    }

    const category = parts[templatesIndex + 1]
    const device = parts[templatesIndex + 2] as DeviceType
    const templateName = parts[templatesIndex + 3]

    if (!Object.values(DeviceType).includes(device)) {
      return null
    }

    return { category, device, templateName }
  }

  /**
   * 构建模板路径
   */
  static buildPath(category: string, device: DeviceType, templateName: string): string {
    return `${category}/${device}/${templateName}`
  }

  /**
   * 获取模板ID
   */
  static getTemplateId(category: string, device: DeviceType, templateName: string): string {
    return `${category}-${device}-${templateName}`
  }
}

/**
 * 模板过滤和排序工具
 */
export class TemplateFilterUtils {
  /**
   * 过滤模板
   */
  static filterTemplates(templates: Template[], filter: TemplateFilter): Template[] {
    return templates.filter(template => {
      // 按名称过滤
      if (filter.name && !template.info.name.toLowerCase().includes(filter.name.toLowerCase())) {
        return false
      }

      // 按标签过滤
      if (filter.tags && filter.tags.length > 0) {
        const templateTags = template.info.tags || []
        if (!filter.tags.some(tag => templateTags.includes(tag))) {
          return false
        }
      }

      // 按作者过滤
      if (filter.author && template.info.author !== filter.author) {
        return false
      }

      // 按状态过滤
      if (filter.status && template.status !== filter.status) {
        return false
      }

      // 只显示默认模板
      if (filter.defaultOnly && !template.info.isDefault) {
        return false
      }

      return true
    })
  }

  /**
   * 排序模板
   */
  static sortTemplates(templates: Template[], sortOptions: TemplateSortOptions): Template[] {
    return [...templates].sort((a, b) => {
      const { field, order } = sortOptions
      let aValue: any
      let bValue: any

      switch (field) {
        case 'name':
          aValue = a.info.name
          bValue = b.info.name
          break
        case 'createdAt':
          aValue = a.info.createdAt || ''
          bValue = b.info.createdAt || ''
          break
        case 'updatedAt':
          aValue = a.info.updatedAt || ''
          bValue = b.info.updatedAt || ''
          break
        case 'version':
          aValue = a.info.version
          bValue = b.info.version
          break
        default:
          return 0
      }

      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  /**
   * 搜索模板
   */
  static searchTemplates(templates: Template[], query: string): Template[] {
    if (!query.trim()) {
      return templates
    }

    const lowerQuery = query.toLowerCase()
    return templates.filter(template => {
      const { name, description, tags, author } = template.info
      
      return (
        name.toLowerCase().includes(lowerQuery) ||
        (description && description.toLowerCase().includes(lowerQuery)) ||
        (tags && tags.some(tag => tag.toLowerCase().includes(lowerQuery))) ||
        (author && author.toLowerCase().includes(lowerQuery))
      )
    })
  }
}

/**
 * 缓存管理工具
 */
export class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; expiry: number }>()
  private defaultExpiry: number

  constructor(defaultExpiry: number = 5 * 60 * 1000) { // 默认5分钟
    this.defaultExpiry = defaultExpiry
  }

  /**
   * 设置缓存
   */
  set<T>(key: string, data: T, expiry?: number): void {
    const expiryTime = expiry || this.defaultExpiry
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: expiryTime
    })
  }

  /**
   * 获取缓存
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) {
      return null
    }

    const now = Date.now()
    if (now - item.timestamp > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  /**
   * 删除缓存
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 检查缓存是否存在且有效
   */
  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) {
      return false
    }

    const now = Date.now()
    if (now - item.timestamp > item.expiry) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.size
  }

  /**
   * 清理过期缓存
   */
  cleanup(): number {
    const now = Date.now()
    let cleaned = 0

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.expiry) {
        this.cache.delete(key)
        cleaned++
      }
    }

    return cleaned
  }
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), wait)
    }
  }
}

/**
 * 深度克隆
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T
  }

  if (typeof obj === 'object') {
    const cloned = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }

  return obj
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 验证模板配置
 */
export function validateTemplateConfig(config: any): boolean {
  if (!config || typeof config !== 'object') {
    return false
  }

  const required = ['id', 'name', 'version']
  return required.every(field => config[field] && typeof config[field] === 'string')
}