/**
 * 智能三级缓存系统
 * 
 * @description
 * 创新的三级缓存架构，平衡性能与内存占用：
 * 
 * **三级缓存策略：**
 * 1. **热缓存 (Hot Cache)** - 强引用，保存最常用的组件
 *    - 使用LRU策略管理
 *    - 保证最快的访问速度
 *    - 内存占用可控
 * 
 * 2. **暖缓存 (Warm Cache)** - 弱引用，保存次常用的组件
 *    - 使用WeakRef，允许垃圾回收
 *    - 在内存充足时提供缓存
 *    - 在内存紧张时自动释放
 * 
 * 3. **冷数据 (Cold Data)** - 未加载，仅保存元数据
 *    - 需要时动态加载
 *    - 最小内存占用
 * 
 * **自动提升/降级机制：**
 * - 访问次数达到阈值：暖 → 热
 * - 热缓存满时：热 → 暖（LRU淘汰）
 * - 被GC回收：暖 → 冷
 * 
 * **性能目标：**
 * - 缓存命中率 > 90%
 * - 内存占用 < 50MB (100个模板)
 * - 查找时间 < 1ms
 * - 提升/降级时间 < 0.1ms
 * 
 * @example
 * ```ts
 * const cache = new SmartCache({
 *   hotSize: 20,
 *   warmSize: 50,
 *   promoteThreshold: 3,
 *   enableMetrics: true
 * })
 * 
 * // 设置组件
 * cache.set('login-mobile', LoginComponent)
 * 
 * // 获取组件
 * const component = cache.get('login-mobile')
 * 
 * // 查看统计
 * const stats = cache.getStats()
 * console.log(`命中率: ${stats.metrics.hitRate}%`)
 * ```
 */

import type { Component } from 'vue'

/**
 * 智能缓存配置选项
 */
export interface SmartCacheOptions {
  /** 
   * 强引用缓存最大数量
   * @default 20
   */
  hotSize?: number
  /** 
   * WeakRef 缓存最大数量
   * @default 50
   */
  warmSize?: number
  /** 
   * 访问计数阈值，超过后提升到热缓存
   * @default 3
   */
  promoteThreshold?: number
  /** 
   * 启用性能监控
   * @default true
   */
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
   * 
   * @description
   * 查找顺序：热缓存 → 暖缓存 → 未命中
   * 
   * **查找流程：**
   * 1. 在热缓存中查找
   *    - 找到：更新访问信息，移到末尾（LRU），返回组件
   * 
   * 2. 在暖缓存中查找
   *    - 找到且未被GC：更新访问信息
   *      - 如果访问次数达到阈值：提升到热缓存
   *      - 否则：继续保留在暖缓存
   *    - 找到但已被GC：删除缓存项
   * 
   * 3. 未命中：返回null
   * 
   * **性能特点：**
   * - 热缓存查找：O(1)，~0.01ms
   * - 暖缓存查找：O(1) + WeakRef.deref()，~0.1ms
   * - LRU更新：O(1)
   * 
   * @param key - 组件键
   * @returns 组件实例或null
   */
  get(key: string): Component | null {
    if (this.enableMetrics) {
      this.metrics.totalAccess++
    }

    // 1. 检查热缓存（最快路径）
    const hotEntry = this.hotCache.get(key)
    if (hotEntry) {
      // 更新访问信息
      hotEntry.accessCount++
      hotEntry.lastAccess = Date.now()

      // 移动到末尾实现LRU（Map的迭代顺序是插入顺序）
      this.hotCache.delete(key)
      this.hotCache.set(key, hotEntry)

      if (this.enableMetrics) {
        this.metrics.hits++
      }

      return hotEntry.component
    }

    // 2. 检查暖缓存（次快路径）
    const warmEntry = this.warmCache.get(key)
    if (warmEntry) {
      // 尝试获取弱引用的组件
      const component = warmEntry.weakRef.deref()

      if (component) {
        // 组件仍然存在，更新访问信息
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
        // 组件已被GC，清理缓存项
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
   * 
   * @description
   * 新组件直接添加到热缓存，如果热缓存已满则淘汰最旧的项。
   * 
   * **设置流程：**
   * 1. 创建缓存项（初始访问次数为1）
   * 2. 检查热缓存是否已满
   *    - 已满：淘汰最不常用的项到暖缓存
   * 3. 添加到热缓存
   * 
   * **设计决策：**
   * - 新组件加入热缓存：假设新加载的组件很可能被立即使用
   * - 使用LFU+LRU混合策略淘汰：综合考虑访问频率和时间
   * 
   * @param key - 组件键
   * @param component - 组件实例
   */
  set(key: string, component: Component): void {
    // 直接添加到热缓存（新加载的组件很可能被立即使用）
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
   * 
   * @description
   * 将频繁访问的组件从暖缓存提升到热缓存，提高访问速度。
   * 
   * **提升条件：**
   * - 暖缓存中的组件访问次数 >= promoteThreshold
   * 
   * **提升流程：**
   * 1. 从暖缓存中移除
   * 2. 检查热缓存是否已满
   *    - 已满：淘汰一个项到暖缓存
   * 3. 添加到热缓存（保留原有访问次数）
   * 4. 更新统计指标
   * 
   * **性能影响：**
   * - 提升操作：O(1)
   * - 避免了频繁的WeakRef.deref()调用
   * - 提高了热点数据的访问速度
   * 
   * @param key - 组件键
   * @param component - 组件实例
   * @param accessCount - 当前访问次数
   */
  private promoteToHot(key: string, component: Component, accessCount: number): void {
    // 从暖缓存移除
    this.warmCache.delete(key)

    // 添加到热缓存（保留访问计数）
    const entry: CacheEntry = {
      component,
      accessCount,
      lastAccess: Date.now(),
    }

    // 如果热缓存已满，先淘汰最不常用的
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



