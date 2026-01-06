/**
 * @ldesign/template-core - Cache System Tests
 * 缓存系统单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TemplateCache, createTemplateCache } from '@ldesign/template-core/cache'
import type { TemplateMetadata } from '@ldesign/template-core/types'

describe('TemplateCache', () => {
  let cache: TemplateCache
  
  // 测试用模板元数据
  const mockMetadata: TemplateMetadata = {
    id: 'login:desktop:default',
    category: 'login',
    device: 'desktop',
    name: 'default',
    path: '/templates/login/desktop/default',
    displayName: '默认登录模板',
    version: '1.0.0',
  }
  
  beforeEach(() => {
    cache = new TemplateCache({ type: 'lru', maxSize: 10 })
  })
  
  describe('基础操作', () => {
    it('应该能够设置和获取缓存项', async () => {
      await cache.set('test-key', { data: 'test-value' }, mockMetadata)
      const result = await cache.get('test-key')
      
      expect(result).toEqual({ data: 'test-value' })
    })
    
    it('获取不存在的key应该返回null', async () => {
      const result = await cache.get('non-existent-key')
      expect(result).toBeNull()
    })
    
    it('应该能够删除缓存项', async () => {
      await cache.set('delete-key', 'value')
      const deleted = await cache.delete('delete-key')
      
      expect(deleted).toBe(true)
      expect(await cache.get('delete-key')).toBeNull()
    })
    
    it('删除不存在的key应该返回false', async () => {
      const deleted = await cache.delete('non-existent-key')
      expect(deleted).toBe(false)
    })
    
    it('应该能够清空所有缓存', async () => {
      await cache.set('key1', 'value1')
      await cache.set('key2', 'value2')
      await cache.clear()
      
      expect(await cache.get('key1')).toBeNull()
      expect(await cache.get('key2')).toBeNull()
    })
  })
  
  describe('LRU策略', () => {
    it('应该在达到容量限制时淘汰最久未使用的项', async () => {
      const smallCache = new TemplateCache({ type: 'lru', maxSize: 3 })
      
      await smallCache.set('key1', 'value1')
      await smallCache.set('key2', 'value2')
      await smallCache.set('key3', 'value3')
      
      // 访问key1使其成为最近使用
      await smallCache.get('key1')
      
      // 添加新项，应该淘汰key2
      await smallCache.set('key4', 'value4')
      
      expect(await smallCache.get('key1')).toBe('value1')
      expect(await smallCache.get('key2')).toBeNull() // 被淘汰
      expect(await smallCache.get('key3')).toBe('value3')
      expect(await smallCache.get('key4')).toBe('value4')
    })
  })
  
  describe('TTL过期', () => {
    it('过期的缓存项应该返回null', async () => {
      await cache.set('ttl-key', 'value', undefined, 100) // 100ms TTL
      
      // 立即获取应该成功
      expect(await cache.get('ttl-key')).toBe('value')
      
      // 等待过期
      await new Promise(resolve => setTimeout(resolve, 150))
      
      // 过期后应该返回null
      expect(await cache.get('ttl-key')).toBeNull()
    })
  })
  
  describe('统计信息', () => {
    it('应该正确记录缓存命中', async () => {
      await cache.set('stats-key', 'value')
      
      // 命中
      await cache.get('stats-key')
      await cache.get('stats-key')
      
      // 未命中
      await cache.get('non-existent')
      
      const stats = cache.getStats()
      expect(stats.hits).toBe(2)
      expect(stats.misses).toBe(1)
      expect(stats.hitRate).toBeCloseTo(2/3, 2)
    })
    
    it('应该正确记录缓存大小', async () => {
      await cache.set('key1', { data: 'value1' })
      await cache.set('key2', { data: 'value2' })
      
      const stats = cache.getStats()
      expect(stats.itemCount).toBe(2)
      expect(stats.size).toBeGreaterThan(0)
    })
  })
  
  describe('缓存预热', () => {
    it('应该能够预热多个key', async () => {
      await cache.set('warm1', 'value1')
      await cache.set('warm2', 'value2')
      
      // 清除统计
      const initialStats = cache.getStats()
      
      // 预热
      await cache.warm(['warm1', 'warm2', 'non-existent'])
      
      const stats = cache.getStats()
      // 预热后hits应该增加
      expect(stats.hits).toBeGreaterThan(initialStats.hits)
    })
  })
  
  describe('createTemplateCache工厂函数', () => {
    it('应该创建默认配置的缓存实例', () => {
      const defaultCache = createTemplateCache()
      expect(defaultCache).toBeInstanceOf(TemplateCache)
    })
    
    it('应该创建自定义配置的缓存实例', () => {
      const customCache = createTemplateCache({
        type: 'lru',
        maxSize: 50,
        ttl: 60000,
      })
      expect(customCache).toBeInstanceOf(TemplateCache)
    })
  })
})

describe('TemplateCache - 边界情况', () => {
  it('应该处理空值', async () => {
    const cache = new TemplateCache()
    
    await cache.set('null-key', null)
    await cache.set('undefined-key', undefined)
    
    // 空值也应该被缓存
    expect(await cache.get('null-key')).toBeNull()
  })
  
  it('应该处理大型对象', async () => {
    const cache = new TemplateCache()
    
    const largeObject = {
      data: 'x'.repeat(10000),
      nested: { deep: { value: 'test' } },
    }
    
    await cache.set('large-key', largeObject)
    const result = await cache.get('large-key')
    
    expect(result).toEqual(largeObject)
  })
  
  it('应该处理特殊字符的key', async () => {
    const cache = new TemplateCache()
    
    const specialKeys = [
      'key with spaces',
      'key:with:colons',
      'key/with/slashes',
      '键使用中文',
      'key🎉emoji',
    ]
    
    for (const key of specialKeys) {
      await cache.set(key, `value for ${key}`)
      expect(await cache.get(key)).toBe(`value for ${key}`)
    }
  })
})