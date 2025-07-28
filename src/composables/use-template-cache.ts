/**
 * 模板缓存管理组合式函数
 */

import { onUnmounted, ref } from 'vue'
import { getGlobalTemplateManager } from '../core/template-manager'
import type { CacheStats, TemplateInstance, UseTemplateCacheReturn } from '../types'

/**
 * 模板缓存管理组合式函数
 */
export function useTemplateCache(): UseTemplateCacheReturn {
  const templateManager = getGlobalTemplateManager()
  if (!templateManager) {
    throw new Error('Template manager not initialized. Please call createTemplateManager first.')
  }

  // 本地缓存映射
  const localCache = ref(new Map<string, TemplateInstance>())

  /**
   * 获取缓存的模板
   */
  const getCachedTemplate = (templateId: string): TemplateInstance | null => {
    // 优先从本地缓存获取
    const localCached = localCache.value.get(templateId)
    if (localCached) {
      return localCached
    }

    // 从全局管理器获取
    return templateManager.getCacheStats().keys.includes(templateId)
      ? templateManager['templates']?.get(templateId) || null
      : null
  }

  /**
   * 设置模板缓存
   */
  const setCachedTemplate = (templateId: string, template: TemplateInstance): void => {
    // 设置到本地缓存
    localCache.value.set(templateId, {
      ...template,
      cachedAt: Date.now()
    })
  }

  /**
   * 移除模板缓存
   */
  const removeCachedTemplate = (templateId: string): void => {
    localCache.value.delete(templateId)
  }

  /**
   * 清空所有缓存
   */
  const clearCache = (): void => {
    localCache.value.clear()
    templateManager.clearCache()
  }

  /**
   * 获取缓存统计
   */
  const getCacheStats = (): CacheStats => {
    const localKeys = Array.from(localCache.value.keys())
    const globalStats = templateManager.getCacheStats()

    // 合并本地和全局缓存统计
    const allKeys = [...new Set([...localKeys, ...globalStats.keys])]

    const localMemory = localKeys.reduce((total, key) => {
      const template = localCache.value.get(key)
      if (template) {
        return total + JSON.stringify(template.config).length
      }
      return total
    }, 0)

    // 模拟统计数据
    const totalRequests = 100
    const totalHits = Math.floor(totalRequests * 0.8)
    const totalMisses = totalRequests - totalHits

    return {
      size: localMemory + globalStats.totalMemory,
      hitRate: totalRequests > 0 ? totalHits / totalRequests : 0,
      missRate: totalRequests > 0 ? totalMisses / totalRequests : 0,
      totalRequests,
      totalHits,
      totalMisses,
      lastUpdate: new Date()
    }
  }

  /**
   * 清理过期缓存
   */
  const cleanupExpiredCache = (maxAge: number = 30 * 60 * 1000): void => {
    const now = Date.now()
    const expiredKeys: string[] = []

    localCache.value.forEach((template, key) => {
      if (template.cachedAt && now - template.cachedAt > maxAge) {
        expiredKeys.push(key)
      }
    })

    expiredKeys.forEach(key => {
      localCache.value.delete(key)
    })

    console.log(`Cleaned up ${expiredKeys.length} expired templates from cache`)
  }

  /**
   * 预热缓存
   */
  const warmupCache = async (templateIds: string[]): Promise<void> => {
    const loadPromises = templateIds.map(async (templateId) => {
      try {
        const template = await templateManager.loadTemplate(templateId)
        setCachedTemplate(templateId, template)
      } catch (error) {
        console.warn(`Failed to warmup cache for template ${templateId}:`, error)
      }
    })

    await Promise.allSettled(loadPromises)
  }

  /**
   * 获取缓存命中率
   */
  const getCacheHitRate = (): { hits: number; misses: number; rate: number } => {
    // 这里需要在实际使用中统计命中和未命中次数
    // 暂时返回模拟数据
    const stats = getCacheStats()
    const hits = Math.floor(stats.size * 0.8) // 模拟80%命中率
    const misses = stats.size - hits
    const rate = stats.size > 0 ? hits / stats.size : 0

    return { hits, misses, rate }
  }

  // 定期清理过期缓存
  const cleanupInterval = setInterval(() => {
    cleanupExpiredCache()
  }, 5 * 60 * 1000) // 每5分钟清理一次

  // 组件卸载时清理
  onUnmounted(() => {
    clearInterval(cleanupInterval)
    localCache.value.clear()
  })

  return {
    cacheStats: ref(getCacheStats()),
    getCache: getCachedTemplate,
    setCache: setCachedTemplate,
    removeCache: removeCachedTemplate,
    clearCache,
    hasCache: (key: string) => localCache.value.has(key),
    getCaches: (keys: string[]) => {
      const result: Record<string, any> = {}
      keys.forEach(key => {
        const cached = getCachedTemplate(key)
        if (cached) result[key] = cached
      })
      return result
    },
    setCaches: (entries: Record<string, any>) => {
      Object.entries(entries).forEach(([key, value]) => {
        setCachedTemplate(key, value)
      })
    },
    removeCaches: (keys: string[]) => {
      keys.forEach(key => removeCachedTemplate(key))
    },
    refreshStats: () => getCacheStats(),
    exportCache: () => JSON.stringify(Array.from(localCache.value.entries())),
    importCache: (data: string) => {
      try {
        const entries = JSON.parse(data)
        localCache.value = new Map(entries)
      } catch (error) {
        console.error('Failed to import cache:', error)
      }
    }
  }
}
