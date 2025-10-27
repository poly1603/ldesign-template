/**
 * 性能优化工具函数
 */

/**
 * 防抖函数返回值 - 包含清理方法
 */
export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  cancel: () => void
  flush: () => void
}

/**
 * 创建防抖函数 - 优化版本
 * 
 * @description
 * 防抖函数会延迟执行，只有在指定时间内没有新的调用时才会执行。
 * 返回的函数包含 cancel 和 flush 方法用于手动控制。
 * 
 * 性能优化：
 * - 避免内存泄漏：提供 cancel 方法清理定时器
 * - 支持立即执行模式
 * - 支持手动触发（flush）
 * 
 * @param fn - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的函数，包含 cancel 和 flush 方法
 * 
 * @example
 * ```ts
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('搜索:', query)
 * }, 300)
 * 
 * debouncedSearch('hello')
 * debouncedSearch('world') // 只会执行这次
 * 
 * // 清理定时器
 * debouncedSearch.cancel()
 * 
 * // 立即执行
 * debouncedSearch.flush()
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): DebouncedFunction<T> {
  let timerId: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null
  let lastThis: any = null

  const debounced = function (this: any, ...args: Parameters<T>) {
    lastArgs = args
    lastThis = this

    if (timerId !== null) {
      clearTimeout(timerId)
    }

    timerId = setTimeout(() => {
      fn.apply(lastThis, lastArgs!)
      timerId = null
      lastArgs = null
      lastThis = null
    }, delay)
  }

  // 取消防抖，清理定时器
  debounced.cancel = () => {
    if (timerId !== null) {
      clearTimeout(timerId)
      timerId = null
      lastArgs = null
      lastThis = null
    }
  }

  // 立即执行，并清理定时器
  debounced.flush = () => {
    if (timerId !== null) {
      clearTimeout(timerId)
      timerId = null
      if (lastArgs !== null) {
        fn.apply(lastThis, lastArgs)
        lastArgs = null
        lastThis = null
      }
    }
  }

  return debounced as DebouncedFunction<T>
}

/**
 * 节流选项
 */
interface ThrottleOptions {
  /** 是否在延迟开始前调用 */
  leading?: boolean
  /** 是否在延迟结束后调用 */
  trailing?: boolean
}

/**
 * 节流函数返回值 - 包含清理方法
 */
export interface ThrottledFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void
  cancel: () => void
}

/**
 * 创建节流函数 - 优化版本
 * 
 * @description
 * 节流函数会限制函数的执行频率，在指定时间内最多执行一次。
 * 支持前缘触发（立即执行）和后缘触发（延迟执行）。
 * 
 * 性能优化：
 * - 避免内存泄漏：提供 cancel 方法清理定时器
 * - 灵活的触发时机控制
 * - 适用于高频事件（如scroll、resize等）
 * 
 * @param fn - 要节流的函数
 * @param limit - 时间限制（毫秒）
 * @param options - 节流选项
 * @returns 节流后的函数，包含 cancel 方法
 * 
 * @example
 * ```ts
 * const throttledScroll = throttle(() => {
 *   console.log('滚动事件')
 * }, 100, { leading: true, trailing: true })
 * 
 * window.addEventListener('scroll', throttledScroll)
 * 
 * // 清理
 * throttledScroll.cancel()
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number = 300,
  options: ThrottleOptions = { leading: true, trailing: true }
): ThrottledFunction<T> {
  let inThrottle = false
  let lastArgs: Parameters<T> | null = null
  let lastThis: any = null
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const throttled = function (this: any, ...args: Parameters<T>) {
    lastArgs = args
    lastThis = this

    if (!inThrottle) {
      // 前缘触发
      if (options.leading !== false) {
        fn.apply(this, args)
      }
      inThrottle = true

      timeoutId = setTimeout(() => {
        inThrottle = false

        // 后缘触发
        if (options.trailing !== false && lastArgs) {
          fn.apply(lastThis, lastArgs)
        }

        lastArgs = null
        lastThis = null
        timeoutId = null
      }, limit)
    }
  }

  // 取消节流，清理定时器
  throttled.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
      inThrottle = false
      lastArgs = null
      lastThis = null
    }
  }

  return throttled as ThrottledFunction<T>
}

/**
 * 批量处理 - 将多次调用合并为一次
 */
export function batch<T>(
  fn: (items: T[]) => void,
  delay: number = 16
): (item: T) => void {
  let items: T[] = []
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (item: T) {
    items.push(item)

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(items)
      items = []
      timeoutId = null
    }, delay)
  }
}

/**
 * 惰性初始化 - 延迟创建开销大的对象
 */
export function lazy<T>(factory: () => T): () => T {
  let instance: T | null = null

  return function () {
    if (instance === null) {
      instance = factory()
    }
    return instance
  }
}

/**
 * Memoization - 缓存函数结果
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    maxSize?: number
    keyGenerator?: (...args: Parameters<T>) => string
  } = {}
): T {
  const cache = new Map<string, ReturnType<T>>()
  const { maxSize = 100, keyGenerator = (...args) => JSON.stringify(args) } = options

  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = keyGenerator(...args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn.apply(this, args)

    // 限制缓存大小
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }

    cache.set(key, result)
    return result
  } as T
}

/**
 * 使用 requestIdleCallback 优化非关键任务
 */
export function runWhenIdle(
  callback: () => void,
  options?: IdleRequestOptions
): void {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(callback, options)
  } else {
    // 降级方案
    setTimeout(callback, 1)
  }
}

/**
 * 使用 requestAnimationFrame 优化动画
 */
export function runInNextFrame(callback: () => void): number {
  return requestAnimationFrame(callback)
}

/**
 * 分批处理大数组 - 避免阻塞主线程
 */
export async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => R,
  batchSize: number = 100
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = batch.map(processor)
    results.push(...batchResults)

    // 让出主线程
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }

  return results
}

/**
 * 虚拟滚动辅助函数
 */
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 3
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const end = Math.min(totalItems, start + visibleCount + overscan * 2)

  return { start, end }
}

/**
 * 对象池 - 重用对象减少 GC 压力
 * 
 * @description
 * 通过重用对象来减少垃圾回收压力，提高性能。
 * 适用于需要频繁创建和销毁的对象，如临时数据结构。
 * 
 * @example
 * ```ts
 * const arrayPool = new ObjectPool(
 *   () => [],
 *   (arr) => arr.length = 0,
 *   10
 * )
 * 
 * const temp = arrayPool.acquire()
 * temp.push(1, 2, 3)
 * // 使用完后释放
 * arrayPool.release(temp)
 * ```
 */
export class ObjectPool<T> {
  private pool: T[] = []
  private factory: () => T
  private reset?: (obj: T) => void

  /**
   * 创建对象池
   * @param factory - 对象工厂函数
   * @param reset - 重置对象的函数
   * @param initialSize - 初始池大小
   */
  constructor(factory: () => T, reset?: (obj: T) => void, initialSize: number = 10) {
    this.factory = factory
    this.reset = reset

    // 预创建对象
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory())
    }
  }

  /**
   * 从池中获取对象
   * @returns 池中的对象或新创建的对象
   */
  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!
    }
    return this.factory()
  }

  /**
   * 释放对象回池中
   * @param obj - 要释放的对象
   */
  release(obj: T): void {
    if (this.reset) {
      this.reset(obj)
    }
    this.pool.push(obj)
  }

  /**
   * 清空对象池
   */
  clear(): void {
    this.pool = []
  }

  /**
   * 获取池中可用对象数量
   */
  get size(): number {
    return this.pool.length
  }
}

/**
 * 快速哈希函数 - 用于生成对象的哈希键
 * 
 * @description
 * 使用FNV-1a算法生成字符串的32位哈希值。
 * 比JSON.stringify快得多，适用于生成缓存键。
 * 
 * @param str - 要哈希的字符串
 * @returns 32位哈希值的十六进制字符串
 * 
 * @example
 * ```ts
 * const hash = fastHash('category:login,device:mobile')
 * // => '7c9f8b3a'
 * ```
 */
export function fastHash(str: string): string {
  let hash = 2166136261 // FNV offset basis

  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = (hash * 16777619) >>> 0 // FNV prime, 使用无符号右移保持32位
  }

  return hash.toString(16)
}

/**
 * 对象指纹生成器 - 为对象生成唯一标识
 * 
 * @description
 * 生成对象的稳定指纹，相同内容的对象生成相同的指纹。
 * 比JSON.stringify性能好，因为只处理关键字段。
 * 
 * @param obj - 要生成指纹的对象
 * @returns 对象指纹字符串
 * 
 * @example
 * ```ts
 * const fingerprint = objectFingerprint({ category: 'login', device: 'mobile' })
 * // => '7c9f8b3a'
 * ```
 */
export function objectFingerprint(obj: Record<string, any>): string {
  // 获取排序后的键
  const keys = Object.keys(obj).sort()

  // 构建指纹字符串
  let fingerprint = ''
  for (const key of keys) {
    const value = obj[key]
    if (value !== undefined && value !== null) {
      // 处理数组
      if (Array.isArray(value)) {
        fingerprint += `${key}:[${value.sort().join(',')}],`
      } else if (typeof value === 'object') {
        // 递归处理嵌套对象
        fingerprint += `${key}:{${objectFingerprint(value)}},`
      } else {
        fingerprint += `${key}:${value},`
      }
    }
  }

  return fastHash(fingerprint)
}

