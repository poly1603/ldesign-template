/**
 * 智能三级缓存系统
 * 
 * 三级缓存策略：
 * 1. 强引用缓存 (hot) - 最近使用，保持强引用
 * 2. WeakRef 缓存 (warm) - 次常用，使用弱引用允许GC
 * 3. 未加载 (cold) - 仅存储元数据
 * 
 * 性能目标：
 * - 缓存命中率 > 90%
 * - 内存占用 < 50MB (100个模板)
 * - 查找时间 < 1ms
 */

import type { Component } from 'vue'

export interface SmartCacheOptions {
  /** 强引用缓存最大数量 */
  hotSize?: number
  /** WeakRef 缓存最大数量 */
  warmSize?: number
  /** 访问计数阈值，超过后提升到热缓存 */
  promoteThreshold?: number
  /** 启用性能监控 */
  enableMetrics?: boolean
}

export interface CacheMetrics {
  /** 总访问次数 */
  totalAccess: number
  /** 命中次数 */
  hits: number
  /** 未命中次数 */
  misses: number
  /** 命中率 */
  hitRate: number
  /** 热缓存大小 */
  hotSize: number
  /** 暖缓存大小 */
  warmSize: number
  /** 提升次数 */
  promotions: number
  /** 降级次数 */
  demotions: number
}

interface CacheEntry {
  component: Component
  accessCount: number
  lastAccess: number
}

interface WarmCacheEntry {
  weakRef: WeakRef<Component>
  accessCount: number
  lastAccess: number
}

/**
 * 智能三级缓存
 */
export class SmartCache {
  // 热缓存 - 强引用，LRU管理
  private hotCache = new Map<string, CacheEntry>()
  // 暖缓存 - WeakRef，允许GC
  private warmCache = new Map<string, WarmCacheEntry>()
  // FinalizationRegistry 追踪GC
  private registry = new FinalizationRegistry((key: string) => {
    this.warmCache.delete(key)
  })

  private readonly hotSize: number
  private readonly warmSize: number
  private readonly promoteThreshold: number
  private readonly enableMetrics: boolean

  // 性能指标
  private metrics = {
    totalAccess: 0,
    hits: 0,
    misses: 0,
    promotions: 0,
    demotions: 0,
  }

  constructor(options: SmartCacheOptions = {}) {
    this.hotSize = options.hotSize || 20
    this.warmSize = options.warmSize || 50
    this.promoteThreshold = options.promoteThreshold || 3
    this.enableMetrics = options.enableMetrics ?? true
  }

  /**
   * 获取组件
   */
  get(key: string): Component | null {
    if (this.enableMetrics) {
      this.metrics.totalAccess++
    }

    // 1. 检查热缓存
    const hotEntry = this.hotCache.get(key)
    if (hotEntry) {
      // 更新访问信息
      hotEntry.accessCount++
      hotEntry.lastAccess = Date.now()

      // 移动到末尾（LRU）
      this.hotCache.delete(key)
      this.hotCache.set(key, hotEntry)

      if (this.enableMetrics) {
        this.metrics.hits++
      }

      return hotEntry.component
    }

    // 2. 检查暖缓存
    const warmEntry = this.warmCache.get(key)
    if (warmEntry) {
      const component = warmEntry.weakRef.deref()

      if (component) {
        // 组件仍然存在
        warmEntry.accessCount++
        warmEntry.lastAccess = Date.now()

        // 检查是否需要提升到热缓存
        if (warmEntry.accessCount >= this.promoteThreshold) {
          this.promoteToHot(key, component, warmEntry.accessCount)
        }

        if (this.enableMetrics) {
          this.metrics.hits++
        }

        return component
      } else {
        // 组件已被GC
        this.warmCache.delete(key)
      }
    }

    // 3. 未命中
    if (this.enableMetrics) {
      this.metrics.misses++
    }

    return null
  }

  /**
   * 设置组件
   */
  set(key: string, component: Component): void {
    // 直接添加到热缓存
    const entry: CacheEntry = {
      component,
      accessCount: 1,
      lastAccess: Date.now(),
    }

    // 如果热缓存已满，降级最旧的到暖缓存
    if (this.hotCache.size >= this.hotSize) {
      this.evictFromHot()
    }

    this.hotCache.set(key, entry)
  }

  /**
   * 提升到热缓存
   */
  private promoteToHot(key: string, component: Component, accessCount: number): void {
    // 从暖缓存移除
    this.warmCache.delete(key)

    // 添加到热缓存
    const entry: CacheEntry = {
      component,
      accessCount,
      lastAccess: Date.now(),
    }

    // 如果热缓存已满，先淘汰
    if (this.hotCache.size >= this.hotSize) {
      this.evictFromHot()
    }

    this.hotCache.set(key, entry)

    if (this.enableMetrics) {
      this.metrics.promotions++
    }
  }

  /**
   * 从热缓存淘汰到暖缓存
   */
  private evictFromHot(): void {
    // 找到访问次数最少的项（如果次数相同，选最旧的）
    let minKey: string | null = null
    let minEntry: CacheEntry | null = null

    for (const [key, entry] of this.hotCache) {
      if (!minEntry ||
        entry.accessCount < minEntry.accessCount ||
        (entry.accessCount === minEntry.accessCount && entry.lastAccess < minEntry.lastAccess)) {
        minKey = key
        minEntry = entry
      }
    }

    if (minKey && minEntry) {
      // 降级到暖缓存
      this.hotCache.delete(minKey)

      // 如果暖缓存也满了，删除最旧的
      if (this.warmCache.size >= this.warmSize) {
        this.evictFromWarm()
      }

      const weakRef = new WeakRef(minEntry.component)
      this.warmCache.set(minKey, {
        weakRef,
        accessCount: minEntry.accessCount,
        lastAccess: minEntry.lastAccess,
      })

      // 注册到 FinalizationRegistry
      this.registry.register(minEntry.component, minKey)

      if (this.enableMetrics) {
        this.metrics.demotions++
      }
    }
  }

  /**
   * 从暖缓存淘汰
   */
  private evictFromWarm(): void {
    // 找到访问次数最少且最旧的项
    let minKey: string | null = null
    let minEntry: WarmCacheEntry | null = null

    for (const [key, entry] of this.warmCache) {
      // 检查组件是否已被GC
      if (!entry.weakRef.deref()) {
        // 已被GC，直接删除
        this.warmCache.delete(key)
        continue
      }

      if (!minEntry ||
        entry.accessCount < minEntry.accessCount ||
        (entry.accessCount === minEntry.accessCount && entry.lastAccess < minEntry.lastAccess)) {
        minKey = key
        minEntry = entry
      }
    }

    if (minKey) {
      this.warmCache.delete(minKey)
    }
  }

  /**
   * 删除缓存项
   */
  delete(key: string): boolean {
    const hotDeleted = this.hotCache.delete(key)
    const warmDeleted = this.warmCache.delete(key)
    return hotDeleted || warmDeleted
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.hotCache.clear()
    this.warmCache.clear()
  }

  /**
   * 检查是否存在
   */
  has(key: string): boolean {
    if (this.hotCache.has(key)) {
      return true
    }

    const warmEntry = this.warmCache.get(key)
    if (warmEntry) {
      // 检查是否已被GC
      const component = warmEntry.weakRef.deref()
      if (component) {
        return true
      } else {
        this.warmCache.delete(key)
      }
    }

    return false
  }

  /**
   * 获取性能指标
   */
  getMetrics(): CacheMetrics {
    return {
      totalAccess: this.metrics.totalAccess,
      hits: this.metrics.hits,
      misses: this.metrics.misses,
      hitRate: this.metrics.totalAccess > 0
        ? (this.metrics.hits / this.metrics.totalAccess) * 100
        : 0,
      hotSize: this.hotCache.size,
      warmSize: this.warmCache.size,
      promotions: this.metrics.promotions,
      demotions: this.metrics.demotions,
    }
  }

  /**
   * 重置指标
   */
  resetMetrics(): void {
    this.metrics = {
      totalAccess: 0,
      hits: 0,
      misses: 0,
      promotions: 0,
      demotions: 0,
    }
  }

  /**
   * 清理已GC的暖缓存条目
   */
  cleanupWarm(): number {
    let cleaned = 0

    for (const [key, entry] of this.warmCache) {
      if (!entry.weakRef.deref()) {
        this.warmCache.delete(key)
        cleaned++
      }
    }

    return cleaned
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    return {
      hot: {
        size: this.hotCache.size,
        maxSize: this.hotSize,
        utilization: (this.hotCache.size / this.hotSize) * 100,
      },
      warm: {
        size: this.warmCache.size,
        maxSize: this.warmSize,
        utilization: (this.warmCache.size / this.warmSize) * 100,
        alive: Array.from(this.warmCache.values()).filter(e => e.weakRef.deref()).length,
      },
      metrics: this.getMetrics(),
    }
  }
}

/**
 * 创建智能缓存实例
 */
export function createSmartCache(options?: SmartCacheOptions): SmartCache {
  return new SmartCache(options)
}



