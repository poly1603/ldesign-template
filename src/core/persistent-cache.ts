/**
 * 持久化缓存系统 - 使用 IndexedDB
 * 用于缓存模板扫描结果，加速初始化
 */

import type { TemplateScanResult } from '../types'

const DB_NAME = 'ldesign-template-cache'
const DB_VERSION = 1
const STORE_NAME = 'scan-results'

export interface CachedScanResult {
  hash: string
  timestamp: number
  result: TemplateScanResult
  version: string
}

/**
 * 持久化缓存管理器
 */
export class PersistentCache {
  private db: IDBDatabase | null = null
  private initPromise: Promise<void> | null = null

  /**
   * 初始化 IndexedDB
   */
  private async init(): Promise<void> {
    if (this.db) return

    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB not supported'))
        return
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // 创建对象存储
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'hash' })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('version', 'version', { unique: false })
        }
      }
    })

    return this.initPromise
  }

  /**
   * 保存扫描结果
   */
  async save(hash: string, result: TemplateScanResult, version: string = '1.0.0'): Promise<void> {
    try {
      await this.init()

      if (!this.db) {
        throw new Error('Database not initialized')
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)

      const data: CachedScanResult = {
        hash,
        timestamp: Date.now(),
        result,
        version,
      }

      return new Promise((resolve, reject) => {
        const request = store.put(data)

        request.onsuccess = () => resolve()
        request.onerror = () => reject(new Error('Failed to save cache'))
      })
    } catch (error) {
      console.warn('[PersistentCache] Save failed:', error)
    }
  }

  /**
   * 读取扫描结果
   */
  async load(hash: string, maxAge: number = 86400000): Promise<TemplateScanResult | null> {
    try {
      await this.init()

      if (!this.db) {
        return null
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)

      return new Promise((resolve, reject) => {
        const request = store.get(hash)

        request.onsuccess = () => {
          const cached = request.result as CachedScanResult | undefined

          if (!cached) {
            resolve(null)
            return
          }

          // 检查是否过期
          const age = Date.now() - cached.timestamp
          if (age > maxAge) {
            // 过期，删除并返回 null
            this.delete(hash).catch(() => { })
            resolve(null)
            return
          }

          resolve(cached.result)
        }

        request.onerror = () => {
          resolve(null)
        }
      })
    } catch (error) {
      console.warn('[PersistentCache] Load failed:', error)
      return null
    }
  }

  /**
   * 删除缓存
   */
  async delete(hash: string): Promise<void> {
    try {
      await this.init()

      if (!this.db) {
        return
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)

      return new Promise((resolve, reject) => {
        const request = store.delete(hash)

        request.onsuccess = () => resolve()
        request.onerror = () => reject(new Error('Failed to delete cache'))
      })
    } catch (error) {
      console.warn('[PersistentCache] Delete failed:', error)
    }
  }

  /**
   * 清空所有缓存
   */
  async clear(): Promise<void> {
    try {
      await this.init()

      if (!this.db) {
        return
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)

      return new Promise((resolve, reject) => {
        const request = store.clear()

        request.onsuccess = () => resolve()
        request.onerror = () => reject(new Error('Failed to clear cache'))
      })
    } catch (error) {
      console.warn('[PersistentCache] Clear failed:', error)
    }
  }

  /**
   * 清理过期缓存
   */
  async cleanup(maxAge: number = 86400000): Promise<number> {
    try {
      await this.init()

      if (!this.db) {
        return 0
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const index = store.index('timestamp')

      return new Promise((resolve, reject) => {
        const request = index.openCursor()
        let deletedCount = 0

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result as IDBCursorWithValue | null

          if (cursor) {
            const cached = cursor.value as CachedScanResult
            const age = Date.now() - cached.timestamp

            if (age > maxAge) {
              cursor.delete()
              deletedCount++
            }

            cursor.continue()
          } else {
            resolve(deletedCount)
          }
        }

        request.onerror = () => {
          reject(new Error('Failed to cleanup cache'))
        }
      })
    } catch (error) {
      console.warn('[PersistentCache] Cleanup failed:', error)
      return 0
    }
  }

  /**
   * 获取缓存统计信息
   */
  async getStats(): Promise<{ count: number; totalSize: number; oldestTimestamp: number | null }> {
    try {
      await this.init()

      if (!this.db) {
        return { count: 0, totalSize: 0, oldestTimestamp: null }
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)

      return new Promise((resolve, reject) => {
        const request = store.getAll()

        request.onsuccess = () => {
          const allResults = request.result as CachedScanResult[]

          const count = allResults.length
          const totalSize = JSON.stringify(allResults).length
          const oldestTimestamp = allResults.length > 0
            ? Math.min(...allResults.map(r => r.timestamp))
            : null

          resolve({ count, totalSize, oldestTimestamp })
        }

        request.onerror = () => {
          reject(new Error('Failed to get stats'))
        }
      })
    } catch (error) {
      console.warn('[PersistentCache] GetStats failed:', error)
      return { count: 0, totalSize: 0, oldestTimestamp: null }
    }
  }

  /**
   * 关闭数据库连接
   */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
      this.initPromise = null
    }
  }
}

/**
 * 全局持久化缓存实例
 */
let globalPersistentCache: PersistentCache | null = null

/**
 * 获取全局持久化缓存实例
 */
export function getPersistentCache(): PersistentCache {
  if (!globalPersistentCache) {
    globalPersistentCache = new PersistentCache()
  }
  return globalPersistentCache
}

/**
 * 生成内容哈希
 */
export async function generateHash(content: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(content)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    } catch (error) {
      console.warn('[PersistentCache] Hash generation failed, using fallback')
    }
  }

  // 降级方案：简单哈希
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString(36)
}

/**
 * 生成模板列表哈希
 */
export async function generateTemplatesHash(paths: string[]): Promise<string> {
  const sorted = [...paths].sort()
  const content = sorted.join('|')
  return generateHash(content)
}



