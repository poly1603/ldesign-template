/**
 * 智能三级缓存系统测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { createSmartCache } from '../../src/core/smart-cache'

describe('SmartCache', () => {
  let cache: ReturnType<typeof createSmartCache>

  beforeEach(() => {
    cache = createSmartCache({
      hotSize: 3,
      warmSize: 5,
      promoteThreshold: 2,
      enableMetrics: true,
    })
  })

  it('should create cache with correct options', () => {
    expect(cache).toBeDefined()
  })

  it('should store and retrieve component', () => {
    const component = { name: 'TestComponent' }
    cache.set('test-key', component as any)

    const retrieved = cache.get('test-key')
    expect(retrieved).toBe(component)
  })

  it('should promote from warm to hot after threshold', () => {
    const component = { name: 'TestComponent' }

    // 先填满热缓存
    cache.set('hot-1', { name: 'Hot1' } as any)
    cache.set('hot-2', { name: 'Hot2' } as any)
    cache.set('hot-3', { name: 'Hot3' } as any)

    // 这个会进入暖缓存（热缓存已满）
    cache.set('warm-1', component as any)

    // 访问2次触发提升
    cache.get('warm-1')
    cache.get('warm-1')

    const metrics = cache.getMetrics()
    expect(metrics.promotions).toBeGreaterThan(0)
  })

  it('should demote from hot to warm when full', () => {
    // 填满热缓存
    cache.set('hot-1', { name: 'Hot1' } as any)
    cache.set('hot-2', { name: 'Hot2' } as any)
    cache.set('hot-3', { name: 'Hot3' } as any)

    // 添加第4个，触发降级
    cache.set('hot-4', { name: 'Hot4' } as any)

    const metrics = cache.getMetrics()
    expect(metrics.demotions).toBeGreaterThan(0)
  })

  it('should track cache metrics', () => {
    const component = { name: 'Test' }

    cache.set('key-1', component as any)
    cache.get('key-1') // hit
    cache.get('key-2') // miss

    const metrics = cache.getMetrics()
    expect(metrics.totalAccess).toBe(2)
    expect(metrics.hits).toBe(1)
    expect(metrics.misses).toBe(1)
    expect(metrics.hitRate).toBe(50)
  })

  it('should handle cache deletion', () => {
    cache.set('test', { name: 'Test' } as any)
    expect(cache.has('test')).toBe(true)

    cache.delete('test')
    expect(cache.has('test')).toBe(false)
  })

  it('should clear all cache', () => {
    cache.set('key-1', { name: 'Test1' } as any)
    cache.set('key-2', { name: 'Test2' } as any)

    cache.clear()

    expect(cache.has('key-1')).toBe(false)
    expect(cache.has('key-2')).toBe(false)
  })

  it('should cleanup warm cache', () => {
    cache.set('test', { name: 'Test' } as any)

    const cleaned = cache.cleanupWarm()
    expect(cleaned).toBeGreaterThanOrEqual(0)
  })

  it('should provide cache stats', () => {
    cache.set('key-1', { name: 'Test' } as any)

    const stats = cache.getStats()
    expect(stats).toHaveProperty('hot')
    expect(stats).toHaveProperty('warm')
    expect(stats).toHaveProperty('metrics')
  })
})


