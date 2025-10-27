/**
 * 内存感知的智能缓存系统
 *
 * @description
 * 基于内存压力动态调整缓存大小的智能缓存
 *
 * **核心特性：**
 * - 动态缓存大小调整
 * - 内存压力监控
 * - 自动垃圾回收
 * - 优先级管理
 * - 预加载策略
 */

import type { Component } from 'vue'
import type { MemoryStatus } from '../utils/memoryOptimizer'
import type { SmartCacheOptions } from './smart-cache'
import { createLogger } from '../utils/logger'
import { getMemoryOptimizer } from '../utils/memoryOptimizer'
import { SmartCache } from './smart-cache'

const logger = createLogger({ prefix: '[MemoryAwareCache]' })

/**
 * 缓存优先级
 */
export enum CachePriority {
  /** 关键资源，永不释放 */
  CRITICAL = 0,
  /** 高优先级，最后释放 */
  HIGH = 1,
  /** 正常优先级 */
  NORMAL = 2,
  /** 低优先级，优先释放 */
  LOW = 3,
}

/**
 * 内存感知缓存配置
 */
export interface MemoryAwareCacheOptions extends SmartCacheOptions {
  /** 启用动态调整 */
  dynamicAdjustment?: boolean
  /** 调整间隔（毫秒） */
  adjustmentInterval?: number
  /** 内存压力阈值 */
  memoryPressureThreshold?: number
  /** 最小缓存大小 */
  minHotSize?: number
  minWarmSize?: number
  /** 最大缓存大小 */
  maxHotSize?: number
  maxWarmSize?: number
  /** 预加载策略 */
  preloadStrategy?: 'aggressive' | 'moderate' | 'conservative' | 'none'
}

/**
 * 缓存项元数据
 */
interface CacheItemMetadata {
  /** 优先级 */
  priority: CachePriority
  /** 大小（字节） */
  size: number
  /** 最后访问时间 */
  lastAccess: number
  /** 访问次数 */
  accessCount: number
  /** 加载时间（毫秒） */
  loadTime: number
  /** 预加载 */
  preloaded?: boolean
}

/**
 * 内存感知的智能缓存
 */
export class MemoryAwareCache extends SmartCache {
  private metadata = new Map<string, CacheItemMetadata>()
  private memoryOptimizer = getMemoryOptimizer()
  private dynamicAdjustment: boolean
  private adjustmentTimer: ReturnType<typeof setInterval> | null = null
  private readonly minHotSize: number
  private readonly minWarmSize: number
  private readonly maxHotSize: number
  private readonly maxWarmSize: number
  private readonly memoryPressureThreshold: number
  private readonly preloadStrategy: string
  private preloadQueue = new Set<string>()
  private totalCacheSize = 0

  constructor(options: MemoryAwareCacheOptions = {}) {
    // 获取初始动态大小
    const initialSizes = getMemoryOptimizer().getDynamicCacheSize()

    super({
      ...options,
      hotSize: options.hotSize || initialSizes.hotSize,
      warmSize: options.warmSize || initialSizes.warmSize,
    })

    this.dynamicAdjustment = options.dynamicAdjustment ?? true
    this.minHotSize = options.minHotSize || 5
    this.minWarmSize = options.minWarmSize || 10
    this.maxHotSize = options.maxHotSize || 50
    this.maxWarmSize = options.maxWarmSize || 100
    this.memoryPressureThreshold = options.memoryPressureThreshold || 0.7
    this.preloadStrategy = options.preloadStrategy || 'moderate'

    if (this.dynamicAdjustment) {
      this.startDynamicAdjustment(options.adjustmentInterval || 10000)
    }
  }

  /**
   * 设置组件（带元数据）
   */
  setWithMetadata(
    key: string,
    component: Component,
    metadata?: Partial<CacheItemMetadata>,
  ): void {
    const itemMetadata: CacheItemMetadata = {
      priority: metadata?.priority || CachePriority.NORMAL,
      size: metadata?.size || this.estimateComponentSize(component),
      lastAccess: Date.now(),
      accessCount: 1,
      loadTime: metadata?.loadTime || 0,
      preloaded: metadata?.preloaded || false,
    }

    this.metadata.set(key, itemMetadata)
    this.totalCacheSize += itemMetadata.size

    super.set(key, component)

    // 检查内存压力
    this.checkMemoryPressure()
  }

  /**
   * 重写 set 方法
   */
  set(key: string, component: Component): void {
    this.setWithMetadata(key, component)
  }

  /**
   * 重写 get 方法
   */
  get(key: string): Component | null {
    const component = super.get(key)

    if (component) {
      const metadata = this.metadata.get(key)
      if (metadata) {
        metadata.lastAccess = Date.now()
        metadata.accessCount++
      }
    }

    return component
  }

  /**
   * 删除缓存项
   */
  delete(key: string): boolean {
    const metadata = this.metadata.get(key)
    if (metadata) {
      this.totalCacheSize -= metadata.size
      this.metadata.delete(key)
    }

    return super.delete(key)
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.metadata.clear()
    this.totalCacheSize = 0
    super.clear()
  }

  /**
   * 估算组件大小
   */
  private estimateComponentSize(component: Component): number {
    // 粗略估算：将组件序列化并计算字符串长度
    try {
      const str = JSON.stringify(component)
      return str.length * 2 // 每个字符约2字节
    }
    catch {
      return 10240 // 默认10KB
    }
  }

  /**
   * 检查内存压力
   */
  private checkMemoryPressure(): void {
    const status = this.memoryOptimizer.getMemoryStatus()

    if (status.usage > this.memoryPressureThreshold) {
      logger.warn(`内存压力高: ${(status.usage * 100).toFixed(1)}%`)
      this.releaseMemory(status)
    }
  }

  /**
   * 释放内存
   */
  private releaseMemory(_status: MemoryStatus): void {
    const targetRelease = this.totalCacheSize * 0.3 // 释放30%
    let released = 0

    // 按优先级排序
    const items = Array.from(this.metadata.entries()).sort((a, b) => {
      // 先按优先级，再按访问时间
      if (a[1].priority !== b[1].priority) {
        return b[1].priority - a[1].priority // 低优先级先释放
      }
      return a[1].lastAccess - b[1].lastAccess // 旧的先释放
    })

    for (const [key, metadata] of items) {
      if (released >= targetRelease)
        break

      // 不释放关键资源
      if (metadata.priority === CachePriority.CRITICAL)
        continue

      // 释放低优先级或长时间未访问的项
      const age = Date.now() - metadata.lastAccess
      if (metadata.priority === CachePriority.LOW || age > 60000) {
        released += metadata.size
        this.delete(key)
        logger.debug(`释放缓存项: ${key}, 大小: ${metadata.size}`)
      }
    }

    logger.info(`内存释放完成: ${(released / 1024).toFixed(2)}KB`)
  }

  /**
   * 启动动态调整
   */
  private startDynamicAdjustment(interval: number): void {
    this.adjustmentTimer = setInterval(() => {
      this.adjustCacheSize()
    }, interval)
  }

  /**
   * 动态调整缓存大小
   */
  private adjustCacheSize(): void {
    const status = this.memoryOptimizer.getMemoryStatus()
    const suggestions = this.memoryOptimizer.getDynamicCacheSize()

    // 根据内存状态调整
    let newHotSize = suggestions.hotSize
    let newWarmSize = suggestions.warmSize

    // 确保在限制范围内
    newHotSize = Math.max(this.minHotSize, Math.min(this.maxHotSize, newHotSize))
    newWarmSize = Math.max(this.minWarmSize, Math.min(this.maxWarmSize, newWarmSize))

    // 获取当前配置
    const stats = this.getStats()
    const currentHotSize = stats.hot.maxSize
    const currentWarmSize = stats.warm.maxSize

    // 仅在变化显著时调整
    if (Math.abs(newHotSize - currentHotSize) > 2
      || Math.abs(newWarmSize - currentWarmSize) > 5) {
      logger.info(
        `动态调整缓存大小: Hot ${currentHotSize} → ${newHotSize}, `
        + `Warm ${currentWarmSize} → ${newWarmSize}`,
      )

      this.resize(newHotSize, newWarmSize)
    }
  }

  /**
   * 调整缓存大小
   */
  private resize(hotSize: number, warmSize: number): void {
    // 这里需要修改父类的私有属性，可能需要重构
    // 暂时使用反射或提供 protected 方法
    (this as any).hotSize = hotSize;
    (this as any).warmSize = warmSize

    // 如果当前缓存超过新大小，需要淘汰
    const stats = this.getStats()
    while (stats.hot.size > hotSize) {
      this.evictFromHotCache()
      stats.hot.size--
    }
  }

  /**
   * 从热缓存淘汰（优先级感知）
   */
  private evictFromHotCache(): void {
    // 找到优先级最低且最少使用的项
    let candidateKey: string | null = null
    let candidateMetadata: CacheItemMetadata | null = null

    for (const [key, metadata] of this.metadata) {
      if (!candidateMetadata
        || metadata.priority > candidateMetadata.priority
        || (metadata.priority === candidateMetadata.priority
          && metadata.accessCount < candidateMetadata.accessCount)) {
        candidateKey = key
        candidateMetadata = metadata
      }
    }

    if (candidateKey) {
      // 调用父类的降级逻辑
      // 需要父类提供 protected 方法或重构
      logger.debug(`淘汰缓存项: ${candidateKey}`)
    }
  }

  /**
   * 预加载模板
   */
  async preload(keys: string[]): Promise<void> {
    if (this.preloadStrategy === 'none')
      return

    const maxPreload = this.getMaxPreloadCount()
    const toPreload = keys.slice(0, maxPreload)

    for (const key of toPreload) {
      if (!this.has(key)) {
        this.preloadQueue.add(key)
      }
    }

    // 异步预加载
    this.processPreloadQueue()
  }

  /**
   * 获取最大预加载数量
   */
  private getMaxPreloadCount(): number {
    switch (this.preloadStrategy) {
      case 'aggressive': return 10
      case 'moderate': return 5
      case 'conservative': return 2
      default: return 0
    }
  }

  /**
   * 处理预加载队列
   */
  private async processPreloadQueue(): Promise<void> {
    const status = this.memoryOptimizer.getMemoryStatus()

    // 内存压力过高时停止预加载
    if (status.usage > 0.8) {
      logger.warn('内存压力过高，停止预加载')
      this.preloadQueue.clear()
      return
    }

    // 批量预加载
    const batch = Array.from(this.preloadQueue).slice(0, 3)
    for (const key of batch) {
      this.preloadQueue.delete(key)
      // 这里需要实际的加载逻辑
      logger.debug(`预加载: ${key}`)
    }
  }

  /**
   * 获取缓存报告
   */
  getCacheReport(): string {
    const stats = this.getStats()
    const metrics = this.getMetrics()

    const lines: string[] = []
    lines.push('# 内存感知缓存报告')
    lines.push('')
    lines.push('## 缓存统计')
    lines.push(`- 热缓存: ${stats.hot.size}/${stats.hot.maxSize} (${stats.hot.utilization.toFixed(1)}%)`)
    lines.push(`- 暖缓存: ${stats.warm.size}/${stats.warm.maxSize} (${stats.warm.utilization.toFixed(1)}%)`)
    lines.push(`- 总大小: ${(this.totalCacheSize / 1024 / 1024).toFixed(2)} MB`)
    lines.push('')
    lines.push('## 性能指标')
    lines.push(`- 命中率: ${metrics.hitRate.toFixed(1)}%`)
    lines.push(`- 总访问: ${metrics.totalAccess}`)
    lines.push(`- 提升次数: ${metrics.promotions}`)
    lines.push(`- 降级次数: ${metrics.demotions}`)
    lines.push('')
    lines.push('## 优先级分布')

    const priorityCount = { 0: 0, 1: 0, 2: 0, 3: 0 }
    for (const metadata of this.metadata.values()) {
      priorityCount[metadata.priority]++
    }

    lines.push(`- CRITICAL: ${priorityCount[0]}`)
    lines.push(`- HIGH: ${priorityCount[1]}`)
    lines.push(`- NORMAL: ${priorityCount[2]}`)
    lines.push(`- LOW: ${priorityCount[3]}`)

    return lines.join('\n')
  }

  /**
   * 清理
   */
  cleanup(): void {
    if (this.adjustmentTimer) {
      clearInterval(this.adjustmentTimer)
      this.adjustmentTimer = null
    }

    this.clear()
  }
}

/**
 * 创建内存感知缓存
 */
export function createMemoryAwareCache(
  options?: MemoryAwareCacheOptions,
): MemoryAwareCache {
  return new MemoryAwareCache(options)
}

/**
 * 全局内存感知缓存实例
 */
let globalCache: MemoryAwareCache | null = null

/**
 * 获取全局缓存实例
 */
export function getMemoryAwareCache(): MemoryAwareCache {
  if (!globalCache) {
    globalCache = new MemoryAwareCache({
      dynamicAdjustment: true,
      preloadStrategy: 'moderate',
    })
  }
  return globalCache
}
