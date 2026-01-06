/**
 * @ldesign/template-core - Smart Template Cache System
 * 智能三级缓存系统：内存缓存 → IndexedDB → 远程
 */

import type { 
  TemplateMetadata, 
  CacheStrategy, 
  AsyncData,
  TemplateMetrics 
} from '../types'

/**
 * 缓存项接口
 */
interface CacheItem<T = any> {
  key: string
  value: T
  metadata?: TemplateMetadata
  timestamp: number
  lastAccess: number
  accessCount: number
  size: number
  ttl?: number
  priority?: number
}

/**
 * 缓存统计接口
 */
export interface CacheStats {
  hits: number
  misses: number
  hitRate: number
  size: number
  itemCount: number
  evictions: number
  avgLoadTime: number
}

/**
 * IndexedDB配置
 */
interface IndexedDBConfig {
  dbName: string
  storeName: string
  version: number
}

/**
 * LRU节点
 */
class LRUNode<T> {
  key: string
  value: CacheItem<T>
  prev: LRUNode<T> | null = null
  next: LRUNode<T> | null = null

  constructor(key: string, value: CacheItem<T>) {
    this.key = key
    this.value = value
  }
}

/**
 * LRU缓存实现
 */
class LRUCache<T = any> {
  private capacity: number
  private size: number = 0
  private cache: Map<string, LRUNode<T>> = new Map()
  private head: LRUNode<T> | null = null
  private tail: LRUNode<T> | null = null

  constructor(capacity: number) {
    this.capacity = capacity
  }

  /**
   * 获取缓存项
   */
  get(key: string): CacheItem<T> | null {
    const node = this.cache.get(key)
    if (!node) return null

    // 移动到链表头部
    this.moveToHead(node)
    
    // 更新访问信息
    node.value.lastAccess = Date.now()
    node.value.accessCount++
    
    return node.value
  }

  /**
   * 设置缓存项
   */
  set(key: string, value: CacheItem<T>): void {
    const existingNode = this.cache.get(key)

    if (existingNode) {
      existingNode.value = value
      this.moveToHead(existingNode)
    } else {
      const newNode = new LRUNode(key, value)
      this.cache.set(key, newNode)
      this.addToHead(newNode)
      this.size++

      if (this.size > this.capacity) {
        this.removeTail()
      }
    }
  }

  /**
   * 删除缓存项
   */
  delete(key: string): boolean {
    const node = this.cache.get(key)
    if (!node) return false

    this.removeNode(node)
    this.cache.delete(key)
    this.size--
    return true
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear()
    this.head = null
    this.tail = null
    this.size = 0
  }

  /**
   * 获取所有键
   */
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * 获取缓存大小
   */
  getSize(): number {
    return this.size
  }

  private addToHead(node: LRUNode<T>): void {
    node.next = this.head
    node.prev = null

    if (this.head) {
      this.head.prev = node
    }
    this.head = node

    if (!this.tail) {
      this.tail = node
    }
  }

  private removeNode(node: LRUNode<T>): void {
    if (node.prev) {
      node.prev.next = node.next
    } else {
      this.head = node.next
    }

    if (node.next) {
      node.next.prev = node.prev
    } else {
      this.tail = node.prev
    }
  }

  private moveToHead(node: LRUNode<T>): void {
    this.removeNode(node)
    this.addToHead(node)
  }

  private removeTail(): void {
    if (!this.tail) return
    
    this.cache.delete(this.tail.key)
    this.removeNode(this.tail)
    this.size--
  }
}

/**
 * 智能模板缓存系统
 */
export class TemplateCache {
  // 内存缓存（一级缓存）
  private memoryCache: LRUCache
  
  // IndexedDB（二级缓存）
  private db: IDBDatabase | null = null
  private dbConfig: IndexedDBConfig
  
  // 远程缓存配置（三级缓存）
  private remoteEndpoint?: string
  
  // 缓存策略
  private strategy: CacheStrategy
  
  // 统计信息
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    size: 0,
    itemCount: 0,
    evictions: 0,
    avgLoadTime: 0
  }
  
  // 性能监控
  private loadTimes: number[] = []

  constructor(strategy: CacheStrategy = { type: 'lru', maxSize: 100 }) {
    this.strategy = strategy
    this.memoryCache = new LRUCache(strategy.maxSize || 100)
    
    this.dbConfig = {
      dbName: 'template-cache',
      storeName: 'templates',
      version: 1
    }
    
    // 初始化IndexedDB
    this.initIndexedDB()
  }

  /**
   * 初始化IndexedDB
   */
  private async initIndexedDB(): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('IndexedDB is not available')
      return
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbConfig.dbName, this.dbConfig.version)

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        if (!db.objectStoreNames.contains(this.dbConfig.storeName)) {
          const store = db.createObjectStore(this.dbConfig.storeName, { 
            keyPath: 'key' 
          })
          
          // 创建索引
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('category', 'metadata.category', { unique: false })
          store.createIndex('device', 'metadata.device', { unique: false })
        }
      }
    })
  }

  /**
   * 获取缓存项（三级缓存查询）
   */
  async get<T = any>(key: string): Promise<T | null> {
    const startTime = performance.now()
    
    // 1. 查询内存缓存
    const memoryItem = this.memoryCache.get(key)
    if (memoryItem) {
      this.recordHit(startTime)
      return this.validateAndReturn(memoryItem)
    }

    // 2. 查询IndexedDB
    const dbItem = await this.getFromIndexedDB<T>(key)
    if (dbItem) {
      // 提升到内存缓存
      this.memoryCache.set(key, dbItem)
      this.recordHit(startTime)
      return this.validateAndReturn(dbItem)
    }

    // 3. 查询远程缓存
    if (this.remoteEndpoint) {
      const remoteItem = await this.getFromRemote<T>(key)
      if (remoteItem) {
        // 保存到本地缓存
        await this.set(key, remoteItem.value, remoteItem.metadata)
        this.recordHit(startTime)
        return remoteItem.value
      }
    }

    this.recordMiss(startTime)
    return null
  }

  /**
   * 设置缓存项（写入所有级别）
   */
  async set<T = any>(
    key: string, 
    value: T, 
    metadata?: TemplateMetadata,
    ttl?: number
  ): Promise<void> {
    const item: CacheItem<T> = {
      key,
      value,
      metadata,
      timestamp: Date.now(),
      lastAccess: Date.now(),
      accessCount: 0,
      size: this.estimateSize(value),
      ttl: ttl || this.strategy.ttl
    }

    // 1. 写入内存缓存
    this.memoryCache.set(key, item)

    // 2. 异步写入IndexedDB
    this.setToIndexedDB(key, item).catch(console.error)

    // 3. 异步写入远程缓存
    if (this.remoteEndpoint) {
      this.setToRemote(key, item).catch(console.error)
    }

    this.updateStats()
  }

  /**
   * 删除缓存项
   */
  async delete(key: string): Promise<boolean> {
    // 从所有级别删除
    const memoryDeleted = this.memoryCache.delete(key)
    const dbDeleted = await this.deleteFromIndexedDB(key)
    
    if (this.remoteEndpoint) {
      await this.deleteFromRemote(key)
    }

    this.updateStats()
    return memoryDeleted || dbDeleted
  }

  /**
   * 清空所有缓存
   */
  async clear(): Promise<void> {
    this.memoryCache.clear()
    await this.clearIndexedDB()
    
    if (this.remoteEndpoint) {
      await this.clearRemote()
    }

    this.resetStats()
  }

  /**
   * 预热缓存
   */
  async warm(keys: string[]): Promise<void> {
    const promises = keys.map(key => this.get(key))
    await Promise.all(promises)
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): CacheStats {
    return { ...this.stats }
  }

  /**
   * 设置远程缓存端点
   */
  setRemoteEndpoint(endpoint: string): void {
    this.remoteEndpoint = endpoint
  }

  // ============================================================================
  // IndexedDB 操作
  // ============================================================================

  private async getFromIndexedDB<T>(key: string): Promise<CacheItem<T> | null> {
    if (!this.db) return null

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([this.dbConfig.storeName], 'readonly')
      const store = transaction.objectStore(this.dbConfig.storeName)
      const request = store.get(key)

      request.onsuccess = () => {
        resolve(request.result || null)
      }

      request.onerror = () => {
        console.error('IndexedDB get error:', request.error)
        resolve(null)
      }
    })
  }

  private async setToIndexedDB<T>(key: string, item: CacheItem<T>): Promise<void> {
    if (!this.db) return

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.dbConfig.storeName], 'readwrite')
      const store = transaction.objectStore(this.dbConfig.storeName)
      const request = store.put(item)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  private async deleteFromIndexedDB(key: string): Promise<boolean> {
    if (!this.db) return false

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([this.dbConfig.storeName], 'readwrite')
      const store = transaction.objectStore(this.dbConfig.storeName)
      const request = store.delete(key)

      request.onsuccess = () => resolve(true)
      request.onerror = () => resolve(false)
    })
  }

  private async clearIndexedDB(): Promise<void> {
    if (!this.db) return

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([this.dbConfig.storeName], 'readwrite')
      const store = transaction.objectStore(this.dbConfig.storeName)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => resolve()
    })
  }

  // ============================================================================
  // 远程缓存操作
  // ============================================================================

  private async getFromRemote<T>(key: string): Promise<CacheItem<T> | null> {
    if (!this.remoteEndpoint) return null

    try {
      const response = await fetch(`${this.remoteEndpoint}/cache/${key}`)
      if (!response.ok) return null
      
      return await response.json()
    } catch (error) {
      console.error('Remote cache get error:', error)
      return null
    }
  }

  private async setToRemote<T>(key: string, item: CacheItem<T>): Promise<void> {
    if (!this.remoteEndpoint) return

    try {
      await fetch(`${this.remoteEndpoint}/cache/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })
    } catch (error) {
      console.error('Remote cache set error:', error)
    }
  }

  private async deleteFromRemote(key: string): Promise<void> {
    if (!this.remoteEndpoint) return

    try {
      await fetch(`${this.remoteEndpoint}/cache/${key}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Remote cache delete error:', error)
    }
  }

  private async clearRemote(): Promise<void> {
    if (!this.remoteEndpoint) return

    try {
      await fetch(`${this.remoteEndpoint}/cache/clear`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('Remote cache clear error:', error)
    }
  }

  // ============================================================================
  // 辅助方法
  // ============================================================================

  private validateAndReturn<T>(item: CacheItem<T>): T | null {
    // 检查TTL
    if (item.ttl) {
      const age = Date.now() - item.timestamp
      if (age > item.ttl) {
        this.delete(item.key)
        return null
      }
    }

    return item.value
  }

  private estimateSize(value: any): number {
    try {
      return JSON.stringify(value).length
    } catch {
      return 0
    }
  }

  private recordHit(startTime: number): void {
    this.stats.hits++
    this.recordLoadTime(startTime)
    this.updateHitRate()
  }

  private recordMiss(startTime: number): void {
    this.stats.misses++
    this.recordLoadTime(startTime)
    this.updateHitRate()
  }

  private recordLoadTime(startTime: number): void {
    const loadTime = performance.now() - startTime
    this.loadTimes.push(loadTime)
    
    // 保持最近100次的加载时间
    if (this.loadTimes.length > 100) {
      this.loadTimes.shift()
    }
    
    // 更新平均加载时间
    this.stats.avgLoadTime = this.loadTimes.reduce((a, b) => a + b, 0) / this.loadTimes.length
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0
  }

  private updateStats(): void {
    this.stats.itemCount = this.memoryCache.getSize()
    this.stats.size = this.memoryCache.keys().reduce((total, key) => {
      const item = this.memoryCache.get(key)
      return total + (item?.size || 0)
    }, 0)
  }

  private resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      size: 0,
      itemCount: 0,
      evictions: 0,
      avgLoadTime: 0
    }
    this.loadTimes = []
  }
}

/**
 * 创建缓存实例
 */
export function createTemplateCache(strategy?: CacheStrategy): TemplateCache {
  return new TemplateCache(strategy)
}