/**
 * 高性能请求调度器
 *
 * @description
 * 智能管理网络请求，优化并发控制和资源利用
 *
 * **核心特性：**
 * - 请求去重
 * - 并发控制
 * - 优先级队列
 * - 自动重试
 * - 请求缓存
 * - 批量请求合并
 * - 请求取消管理
 */

import { createLogger } from './logger'
import { objectFingerprint } from './performance'

const logger = createLogger({ prefix: '[RequestScheduler]' })

/**
 * 请求优先级
 */
export enum RequestPriority {
  IMMEDIATE = 0, // 立即执行
  HIGH = 1, // 高优先级
  NORMAL = 2, // 普通优先级
  LOW = 3, // 低优先级
  IDLE = 4, // 空闲时执行
}

/**
 * 请求配置
 */
export interface RequestConfig<T = any> {
  /** 请求函数 */
  fn: () => Promise<T>
  /** 请求唯一标识 */
  key?: string
  /** 优先级 */
  priority?: RequestPriority
  /** 超时时间（毫秒） */
  timeout?: number
  /** 重试次数 */
  retryCount?: number
  /** 重试延迟（毫秒） */
  retryDelay?: number | ((attempt: number) => number)
  /** 缓存时间（毫秒） */
  cacheTTL?: number
  /** 是否可取消 */
  cancellable?: boolean
  /** 批量合并键 */
  batchKey?: string
  /** 成功回调 */
  onSuccess?: (data: T) => void
  /** 错误回调 */
  onError?: (error: Error) => void
}

/**
 * 请求任务
 */
interface RequestTask<T = any> {
  id: string
  config: RequestConfig<T>
  promise?: Promise<T>
  resolve?: (value: T) => void
  reject?: (reason: any) => void
  retryCount: number
  timestamp: number
  controller?: AbortController
}

/**
 * 请求结果缓存
 */
interface CacheEntry<T = any> {
  data: T
  timestamp: number
  ttl: number
}

/**
 * 请求调度器
 */
export class RequestScheduler {
  // 配置
  private readonly maxConcurrent: number
  private readonly defaultTimeout: number
  private readonly cacheSize: number

  // 状态
  private activeCount = 0
  private queue: RequestTask[] = []
  private pending = new Map<string, Promise<any>>()
  private cache = new Map<string, CacheEntry>()
  private batches = new Map<string, RequestTask[]>()
  private nextTaskId = 1

  constructor(options: {
    maxConcurrent?: number
    defaultTimeout?: number
    cacheSize?: number
  } = {}) {
    this.maxConcurrent = options.maxConcurrent || 6
    this.defaultTimeout = options.defaultTimeout || 30000
    this.cacheSize = options.cacheSize || 100
  }

  /**
   * 调度请求
   */
  async schedule<T>(config: RequestConfig<T>): Promise<T> {
    // 生成请求键
    const key = config.key || this.generateKey(config)

    // 1. 检查缓存
    const cached = this.getFromCache<T>(key)
    if (cached !== null) {
      logger.debug(`缓存命中: ${key}`)
      return cached
    }

    // 2. 检查是否有相同请求正在进行
    if (this.pending.has(key)) {
      logger.debug(`复用请求: ${key}`)
      return this.pending.get(key) as Promise<T>
    }

    // 3. 创建任务
    const task = this.createTask(config, key)

    // 4. 处理批量请求
    if (config.batchKey) {
      return this.handleBatchRequest(task, config.batchKey)
    }

    // 5. 加入队列或立即执行
    if (config.priority === RequestPriority.IMMEDIATE) {
      return this.executeTask(task)
    }
    else {
      return this.enqueueTask(task)
    }
  }

  /**
   * 创建任务
   */
  private createTask<T>(config: RequestConfig<T>, key: string): RequestTask<T> {
    const task: RequestTask<T> = {
      id: `task-${this.nextTaskId++}`,
      config: { ...config, key },
      retryCount: 0,
      timestamp: Date.now(),
    }

    // 创建Promise
    const promise = new Promise<T>((resolve, reject) => {
      task.resolve = resolve
      task.reject = reject
    })

    task.promise = promise

    // 设置到pending映射
    this.pending.set(key, promise)

    // 清理函数
    promise.finally(() => {
      this.pending.delete(key)
    })

    return task
  }

  /**
   * 处理批量请求
   */
  private async handleBatchRequest<T>(
    task: RequestTask<T>,
    batchKey: string,
  ): Promise<T> {
    // 添加到批次
    if (!this.batches.has(batchKey)) {
      this.batches.set(batchKey, [])

      // 延迟执行批量请求
      setTimeout(() => {
        this.executeBatch(batchKey)
      }, 50) // 50ms收集窗口
    }

    this.batches.get(batchKey)!.push(task)

    return task.promise!
  }

  /**
   * 执行批量请求
   */
  private async executeBatch(batchKey: string) {
    const tasks = this.batches.get(batchKey)
    if (!tasks || tasks.length === 0)
      return

    this.batches.delete(batchKey)

    logger.debug(`执行批量请求: ${batchKey}, 任务数: ${tasks.length}`)

    // 合并执行
    try {
      // 这里需要具体的批量执行逻辑
      // 示例：执行第一个任务，结果广播给所有任务
      const result = await tasks[0].config.fn()

      tasks.forEach((task) => {
        if (task.config.cacheTTL) {
          this.setCache(task.config.key!, result, task.config.cacheTTL)
        }
        task.resolve?.(result)
      })
    }
    catch (error) {
      tasks.forEach((task) => {
        task.reject?.(error)
      })
    }
  }

  /**
   * 加入队列
   */
  private async enqueueTask<T>(task: RequestTask<T>): Promise<T> {
    // 按优先级插入队列
    const priority = task.config.priority || RequestPriority.NORMAL
    const insertIndex = this.queue.findIndex(
      t => (t.config.priority || RequestPriority.NORMAL) > priority,
    )

    if (insertIndex === -1) {
      this.queue.push(task)
    }
    else {
      this.queue.splice(insertIndex, 0, task)
    }

    // 尝试处理队列
    this.processQueue()

    return task.promise!
  }

  /**
   * 处理队列
   */
  private processQueue() {
    while (this.activeCount < this.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift()!
      this.executeTask(task)
    }
  }

  /**
   * 执行任务
   */
  private async executeTask<T>(task: RequestTask<T>): Promise<T> {
    this.activeCount++

    try {
      // 创建超时和取消控制
      const controller = new AbortController()
      task.controller = controller

      // 超时处理
      const timeout = task.config.timeout || this.defaultTimeout
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, timeout)

      // 执行请求
      logger.debug(`执行请求: ${task.config.key}`)
      const result = await this.executeWithRetry(task)

      clearTimeout(timeoutId)

      // 缓存结果
      if (task.config.cacheTTL) {
        this.setCache(task.config.key!, result, task.config.cacheTTL)
      }

      // 成功回调
      task.config.onSuccess?.(result)
      task.resolve?.(result)

      return result
    }
    catch (error: any) {
      // 错误回调
      task.config.onError?.(error)
      task.reject?.(error)
      throw error
    }
    finally {
      this.activeCount--
      this.processQueue()
    }
  }

  /**
   * 带重试的执行
   */
  private async executeWithRetry<T>(task: RequestTask<T>): Promise<T> {
    const maxRetries = task.config.retryCount || 0

    while (task.retryCount <= maxRetries) {
      try {
        return await task.config.fn()
      }
      catch (error) {
        task.retryCount++

        if (task.retryCount > maxRetries) {
          throw error
        }

        // 计算重试延迟
        const delay = typeof task.config.retryDelay === 'function'
          ? task.config.retryDelay(task.retryCount)
          : task.config.retryDelay || 1000

        logger.debug(`重试请求 ${task.config.key}, 第 ${task.retryCount} 次, 延迟 ${delay}ms`)

        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw new Error('重试次数已用尽')
  }

  /**
   * 生成请求键
   */
  private generateKey(config: RequestConfig): string {
    // 基于函数字符串和参数生成唯一键
    return objectFingerprint({
      fn: config.fn.toString(),
      priority: config.priority,
      batchKey: config.batchKey,
    })
  }

  /**
   * 从缓存获取
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry)
      return null

    // 检查是否过期
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * 设置缓存
   */
  private setCache<T>(key: string, data: T, ttl: number) {
    // LRU淘汰
    if (this.cache.size >= this.cacheSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  /**
   * 取消请求
   */
  cancelRequest(key: string): boolean {
    // 从队列中移除
    const queueIndex = this.queue.findIndex(t => t.config.key === key)
    if (queueIndex !== -1) {
      const task = this.queue.splice(queueIndex, 1)[0]
      task.reject?.(new Error('请求已取消'))
      return true
    }

    // 取消正在执行的请求
    // 需要任务跟踪机制
    return false
  }

  /**
   * 取消所有请求
   */
  cancelAll() {
    // 清空队列
    this.queue.forEach((task) => {
      task.reject?.(new Error('请求已取消'))
    })
    this.queue = []

    // 清空批次
    this.batches.forEach((tasks) => {
      tasks.forEach((task) => {
        task.reject?.(new Error('请求已取消'))
      })
    })
    this.batches.clear()

    logger.info('已取消所有请求')
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.cache.clear()
    logger.info('已清理请求缓存')
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      activeCount: this.activeCount,
      queueLength: this.queue.length,
      pendingCount: this.pending.size,
      cacheSize: this.cache.size,
      batchCount: this.batches.size,
    }
  }

  /**
   * 等待空闲
   */
  async waitForIdle(): Promise<void> {
    return new Promise((resolve) => {
      const check = () => {
        if (this.activeCount === 0 && this.queue.length === 0) {
          resolve()
        }
        else {
          setTimeout(check, 100)
        }
      }
      check()
    })
  }
}

/**
 * 创建请求调度器
 */
export function createRequestScheduler(options?: {
  maxConcurrent?: number
  defaultTimeout?: number
  cacheSize?: number
}): RequestScheduler {
  return new RequestScheduler(options)
}

/**
 * 全局请求调度器
 */
let globalScheduler: RequestScheduler | null = null

/**
 * 获取全局调度器
 */
export function getRequestScheduler(): RequestScheduler {
  if (!globalScheduler) {
    globalScheduler = new RequestScheduler()
  }
  return globalScheduler
}
