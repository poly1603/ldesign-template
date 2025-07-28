import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { useTemplateCache } from '../../src/composables/useTemplateCache'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

// Mock sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

describe('useTemplateCache', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    Object.defineProperty(global, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    })
    
    Object.defineProperty(global, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true
    })
    
    // 重置 mock 返回值
    mockLocalStorage.getItem.mockReturnValue(null)
    mockSessionStorage.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('基础缓存操作', () => {
    it('应该能够设置和获取缓存', () => {
      const { setCache, getCache } = useTemplateCache()

      const testData = { id: 'test', name: '测试数据' }
      setCache('test-key', testData)

      const cachedData = getCache('test-key')
      expect(cachedData).toEqual(testData)
    })

    it('应该在缓存不存在时返回 undefined', () => {
      const { getCache } = useTemplateCache()

      const result = getCache('non-existent-key')
      expect(result).toBeUndefined()
    })

    it('应该能够移除缓存', () => {
      const { setCache, getCache, removeCache } = useTemplateCache()

      setCache('test-key', 'test-value')
      expect(getCache('test-key')).toBe('test-value')

      removeCache('test-key')
      expect(getCache('test-key')).toBeUndefined()
    })

    it('应该能够清空所有缓存', () => {
      const { setCache, getCache, clearCache } = useTemplateCache()

      setCache('key1', 'value1')
      setCache('key2', 'value2')
      
      expect(getCache('key1')).toBe('value1')
      expect(getCache('key2')).toBe('value2')

      clearCache()
      
      expect(getCache('key1')).toBeUndefined()
      expect(getCache('key2')).toBeUndefined()
    })

    it('应该能够检查缓存是否存在', () => {
      const { setCache, hasCache } = useTemplateCache()

      expect(hasCache('test-key')).toBe(false)

      setCache('test-key', 'test-value')
      expect(hasCache('test-key')).toBe(true)
    })
  })

  describe('缓存过期', () => {
    it('应该支持设置缓存过期时间', () => {
      const { setCache, getCache } = useTemplateCache()

      setCache('test-key', 'test-value', 1000) // 1秒过期

      // 立即获取应该有值
      expect(getCache('test-key')).toBe('test-value')

      // 模拟时间过去
      vi.useFakeTimers()
      vi.advanceTimersByTime(1500) // 1.5秒后

      // 应该已过期
      expect(getCache('test-key')).toBeUndefined()

      vi.useRealTimers()
    })

    it('应该在没有设置过期时间时永不过期', () => {
      const { setCache, getCache } = useTemplateCache()

      setCache('test-key', 'test-value')

      vi.useFakeTimers()
      vi.advanceTimersByTime(86400000) // 24小时后

      expect(getCache('test-key')).toBe('test-value')

      vi.useRealTimers()
    })
  })

  describe('批量操作', () => {
    it('应该支持批量获取缓存', () => {
      const { setCache, getCaches } = useTemplateCache()

      setCache('key1', 'value1')
      setCache('key2', 'value2')
      setCache('key3', 'value3')

      const results = getCaches(['key1', 'key2', 'key4'])
      
      expect(results).toEqual({
        key1: 'value1',
        key2: 'value2',
        key4: undefined
      })
    })

    it('应该支持批量设置缓存', () => {
      const { setCaches, getCache } = useTemplateCache()

      const data = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3'
      }

      setCaches(data)

      expect(getCache('key1')).toBe('value1')
      expect(getCache('key2')).toBe('value2')
      expect(getCache('key3')).toBe('value3')
    })

    it('应该支持批量移除缓存', () => {
      const { setCache, removeCaches, hasCache } = useTemplateCache()

      setCache('key1', 'value1')
      setCache('key2', 'value2')
      setCache('key3', 'value3')

      removeCaches(['key1', 'key3'])

      expect(hasCache('key1')).toBe(false)
      expect(hasCache('key2')).toBe(true)
      expect(hasCache('key3')).toBe(false)
    })
  })

  describe('缓存统计', () => {
    it('应该提供缓存统计信息', async () => {
      const { setCache, getCache, cacheStats } = useTemplateCache()

      // 初始状态
      expect(cacheStats.value.size).toBe(0)
      expect(cacheStats.value.hitRate).toBe(0)
      expect(cacheStats.value.missRate).toBe(0)

      // 设置缓存
      setCache('key1', 'value1')
      setCache('key2', 'value2')

      await nextTick()
      expect(cacheStats.value.size).toBe(2)

      // 缓存命中
      getCache('key1')
      getCache('key1')
      
      // 缓存未命中
      getCache('non-existent')

      await nextTick()
      expect(cacheStats.value.totalRequests).toBe(3)
      expect(cacheStats.value.totalHits).toBe(2)
      expect(cacheStats.value.totalMisses).toBe(1)
      expect(cacheStats.value.hitRate).toBe(66.67) // 2/3 * 100
      expect(cacheStats.value.missRate).toBe(33.33) // 1/3 * 100
    })

    it('应该能够刷新统计信息', async () => {
      const { setCache, refreshStats, cacheStats } = useTemplateCache()

      setCache('key1', 'value1')
      
      // 手动刷新统计
      refreshStats()
      
      await nextTick()
      expect(cacheStats.value.size).toBe(1)
    })
  })

  describe('持久化存储', () => {
    it('应该支持 localStorage 持久化', () => {
      const { setCache, getCache } = useTemplateCache({
        enablePersistence: true,
        storageType: 'localStorage'
      })

      setCache('persistent-key', 'persistent-value')

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining('persistent-key'),
        expect.any(String)
      )
    })

    it('应该支持 sessionStorage 持久化', () => {
      const { setCache } = useTemplateCache({
        enablePersistence: true,
        storageType: 'sessionStorage'
      })

      setCache('session-key', 'session-value')

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining('session-key'),
        expect.any(String)
      )
    })

    it('应该从持久化存储中恢复缓存', () => {
      const cacheData = {
        value: 'restored-value',
        expiry: Date.now() + 60000 // 1分钟后过期
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(cacheData))

      const { getCache } = useTemplateCache({
        enablePersistence: true,
        storageType: 'localStorage'
      })

      const result = getCache('restored-key')
      expect(result).toBe('restored-value')
    })

    it('应该忽略过期的持久化缓存', () => {
      const expiredCacheData = {
        value: 'expired-value',
        expiry: Date.now() - 60000 // 1分钟前过期
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(expiredCacheData))

      const { getCache } = useTemplateCache({
        enablePersistence: true,
        storageType: 'localStorage'
      })

      const result = getCache('expired-key')
      expect(result).toBeUndefined()
    })
  })

  describe('缓存策略', () => {
    it('应该支持 LRU 缓存策略', () => {
      const { setCache, getCache } = useTemplateCache({
        strategy: 'lru',
        maxSize: 2
      })

      setCache('key1', 'value1')
      setCache('key2', 'value2')
      setCache('key3', 'value3') // 应该淘汰 key1

      expect(getCache('key1')).toBeUndefined()
      expect(getCache('key2')).toBe('value2')
      expect(getCache('key3')).toBe('value3')
    })

    it('应该支持 FIFO 缓存策略', () => {
      const { setCache, getCache } = useTemplateCache({
        strategy: 'fifo',
        maxSize: 2
      })

      setCache('key1', 'value1')
      setCache('key2', 'value2')
      
      // 访问 key1 不应该影响淘汰顺序
      getCache('key1')
      
      setCache('key3', 'value3') // 应该淘汰 key1（最先进入）

      expect(getCache('key1')).toBeUndefined()
      expect(getCache('key2')).toBe('value2')
      expect(getCache('key3')).toBe('value3')
    })

    it('应该支持 LFU 缓存策略', () => {
      const { setCache, getCache } = useTemplateCache({
        strategy: 'lfu',
        maxSize: 2
      })

      setCache('key1', 'value1')
      setCache('key2', 'value2')
      
      // key2 被访问更多次
      getCache('key2')
      getCache('key2')
      getCache('key1')
      
      setCache('key3', 'value3') // 应该淘汰 key1（使用频率低）

      expect(getCache('key1')).toBeUndefined()
      expect(getCache('key2')).toBe('value2')
      expect(getCache('key3')).toBe('value3')
    })
  })

  describe('数据导入导出', () => {
    it('应该能够导出缓存数据', () => {
      const { setCache, exportCache } = useTemplateCache()

      setCache('key1', 'value1')
      setCache('key2', { nested: 'object' })

      const exported = exportCache()
      const data = JSON.parse(exported)

      expect(data).toHaveProperty('key1')
      expect(data).toHaveProperty('key2')
      expect(data.key1.value).toBe('value1')
      expect(data.key2.value).toEqual({ nested: 'object' })
    })

    it('应该能够导入缓存数据', () => {
      const { importCache, getCache } = useTemplateCache()

      const importData = JSON.stringify({
        key1: { value: 'imported1', expiry: null },
        key2: { value: 'imported2', expiry: Date.now() + 60000 }
      })

      importCache(importData)

      expect(getCache('key1')).toBe('imported1')
      expect(getCache('key2')).toBe('imported2')
    })

    it('应该处理无效的导入数据', () => {
      const { importCache } = useTemplateCache()

      expect(() => {
        importCache('invalid json')
      }).not.toThrow()

      expect(() => {
        importCache('null')
      }).not.toThrow()
    })
  })

  describe('错误处理', () => {
    it('应该处理存储配额超限', () => {
      const { setCache } = useTemplateCache({
        enablePersistence: true,
        storageType: 'localStorage'
      })

      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

      expect(() => {
        setCache('large-key', 'large-value')
      }).not.toThrow()
    })

    it('应该处理存储不可用', () => {
      Object.defineProperty(global, 'localStorage', {
        value: undefined,
        writable: true
      })

      const { setCache, getCache } = useTemplateCache({
        enablePersistence: true,
        storageType: 'localStorage'
      })

      expect(() => {
        setCache('key', 'value')
        getCache('key')
      }).not.toThrow()
    })

    it('应该处理序列化错误', () => {
      const { setCache } = useTemplateCache()

      const circularObj: any = {}
      circularObj.self = circularObj

      expect(() => {
        setCache('circular', circularObj)
      }).not.toThrow()
    })
  })

  describe('内存管理', () => {
    it('应该在达到最大缓存大小时清理旧缓存', () => {
      const { setCache, getCache, cacheStats } = useTemplateCache({
        maxSize: 3
      })

      setCache('key1', 'value1')
      setCache('key2', 'value2')
      setCache('key3', 'value3')
      
      expect(cacheStats.value.size).toBe(3)

      setCache('key4', 'value4')
      
      expect(cacheStats.value.size).toBe(3)
      expect(getCache('key4')).toBe('value4')
    })

    it('应该定期清理过期缓存', async () => {
      vi.useFakeTimers()

      const { setCache, getCache, cacheStats } = useTemplateCache({
        enableAutoCleanup: true,
        cleanupInterval: 1000
      })

      setCache('key1', 'value1', 500) // 0.5秒过期
      setCache('key2', 'value2', 2000) // 2秒过期

      expect(cacheStats.value.size).toBe(2)

      // 1秒后，key1 应该被清理
      vi.advanceTimersByTime(1000)
      await nextTick()

      expect(getCache('key1')).toBeUndefined()
      expect(getCache('key2')).toBe('value2')

      vi.useRealTimers()
    })
  })

  describe('配置选项', () => {
    it('应该支持自定义缓存键前缀', () => {
      const { setCache } = useTemplateCache({
        enablePersistence: true,
        storageType: 'localStorage',
        keyPrefix: 'custom-prefix:'
      })

      setCache('test-key', 'test-value')

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'custom-prefix:test-key',
        expect.any(String)
      )
    })

    it('应该支持自定义序列化器', () => {
      const customSerializer = {
        serialize: vi.fn().mockReturnValue('custom-serialized'),
        deserialize: vi.fn().mockReturnValue('custom-deserialized')
      }

      const { setCache, getCache } = useTemplateCache({
        serializer: customSerializer
      })

      setCache('key', 'value')
      expect(customSerializer.serialize).toHaveBeenCalledWith('value')

      getCache('key')
      expect(customSerializer.deserialize).toHaveBeenCalled()
    })
  })
})
