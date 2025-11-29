/**
 * 模板缓存管理器
 *
 * 管理用户模板选择的缓存，支持多种存储方式
 *
 * @module plugin/template-cache
 */
import type { DeviceType, TemplateCacheConfig } from '../types/config'
import { getCacheConfig } from './template-config-context'

/** 内存缓存存储 */
const memoryStorage = new Map<string, { value: string, expiry: number }>()

/**
 * 缓存数据结构
 */
interface CacheEntry {
  /** 模板名称 */
  templateName: string
  /** 缓存时间戳 */
  timestamp: number
}

/**
 * 生成缓存键
 */
function generateCacheKey(category: string, device: DeviceType): string {
  const config = getCacheConfig()
  let key = `${config.keyPrefix}${category}:${device}`

  // 按用户隔离
  if (config.perUser && config.getUserId) {
    const userId = config.getUserId()
    if (userId) {
      key = `${key}:${userId}`
    }
  }

  return key
}

/**
 * 获取存储实例
 */
function getStorage(): Storage | null {
  const config = getCacheConfig()

  if (config.storage === 'memory') {
    return null // 使用内存存储
  }

  if (typeof window === 'undefined') {
    return null
  }

  return config.storage === 'sessionStorage'
    ? window.sessionStorage
    : window.localStorage
}

/**
 * 检查缓存是否过期
 */
function isExpired(timestamp: number): boolean {
  const config = getCacheConfig()

  if (config.ttl === 0) {
    return false // 永不过期
  }

  return Date.now() - timestamp > config.ttl
}

/**
 * 保存模板选择到缓存
 */
export function cacheTemplateSelection(
  category: string,
  device: DeviceType,
  templateName: string,
): void {
  const config = getCacheConfig()

  if (!config.enabled) {
    return
  }

  const key = generateCacheKey(category, device)
  const entry: CacheEntry = {
    templateName,
    timestamp: Date.now(),
  }

  const storage = getStorage()

  if (storage) {
    try {
      storage.setItem(key, JSON.stringify(entry))
    }
    catch (e) {
      console.warn('[TemplateCache] 保存缓存失败:', e)
    }
  }
  else {
    // 使用内存存储
    memoryStorage.set(key, {
      value: JSON.stringify(entry),
      expiry: config.ttl > 0 ? Date.now() + config.ttl : 0,
    })
  }
}

/**
 * 从缓存获取模板选择
 * @returns 模板名称，或 undefined 如果没有缓存或已过期
 */
export function getCachedTemplateSelection(
  category: string,
  device: DeviceType,
): string | undefined {
  const config = getCacheConfig()

  if (!config.enabled) {
    return undefined
  }

  const key = generateCacheKey(category, device)
  const storage = getStorage()

  let rawEntry: string | null = null

  if (storage) {
    try {
      rawEntry = storage.getItem(key)
    }
    catch (e) {
      console.warn('[TemplateCache] 读取缓存失败:', e)
      return undefined
    }
  }
  else {
    // 使用内存存储
    const memEntry = memoryStorage.get(key)
    if (memEntry) {
      // 检查内存缓存过期
      if (memEntry.expiry > 0 && Date.now() > memEntry.expiry) {
        memoryStorage.delete(key)
        return undefined
      }
      rawEntry = memEntry.value
    }
  }

  if (!rawEntry) {
    return undefined
  }

  try {
    const entry = JSON.parse(rawEntry) as CacheEntry

    // 检查是否过期
    if (isExpired(entry.timestamp)) {
      clearCachedTemplateSelection(category, device)
      return undefined
    }

    return entry.templateName
  }
  catch {
    return undefined
  }
}

/**
 * 清除指定分类和设备的缓存
 */
export function clearCachedTemplateSelection(category: string, device: DeviceType): void {
  const key = generateCacheKey(category, device)
  const storage = getStorage()
  storage ? storage.removeItem(key) : memoryStorage.delete(key)
}

/**
 * 清除所有模板缓存
 */
export function clearAllTemplateCache(): void {
  const config = getCacheConfig()
  const storage = getStorage()

  if (storage) {
    const keysToRemove: string[] = []
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key?.startsWith(config.keyPrefix)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => storage.removeItem(key))
  }
  else {
    // 清除内存存储中匹配的项
    for (const key of memoryStorage.keys()) {
      if (key.startsWith(config.keyPrefix)) {
        memoryStorage.delete(key)
      }
    }
  }
}

