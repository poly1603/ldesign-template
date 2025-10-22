/**
 * 持久化缓存测试
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { getPersistentCache, generateHash } from '../../src/core/persistent-cache'

describe('PersistentCache', () => {
  let cache: ReturnType<typeof getPersistentCache>

  beforeEach(() => {
    cache = getPersistentCache()
  })

  afterEach(async () => {
    await cache.clear()
    cache.close()
  })

  it('should generate consistent hash', async () => {
    const content = 'test content'
    const hash1 = await generateHash(content)
    const hash2 = await generateHash(content)

    expect(hash1).toBe(hash2)
  })

  it('should generate different hash for different content', async () => {
    const hash1 = await generateHash('content1')
    const hash2 = await generateHash('content2')

    expect(hash1).not.toBe(hash2)
  })

  it('should save and load data', async () => {
    const hash = 'test-hash'
    const data = {
      total: 10,
      byCategory: { login: 5, dashboard: 5 },
      byDevice: { desktop: 6, mobile: 4 },
      scanTime: 100,
      templates: [],
    }

    await cache.save(hash, data)
    const loaded = await cache.load(hash)

    expect(loaded).toEqual(data)
  })

  it('should return null for non-existent cache', async () => {
    const loaded = await cache.load('non-existent-hash')
    expect(loaded).toBeNull()
  })

  it('should delete cache', async () => {
    const hash = 'test-hash'
    await cache.save(hash, { total: 0, byCategory: {}, byDevice: {}, scanTime: 0, templates: [] })

    await cache.delete(hash)
    const loaded = await cache.load(hash)

    expect(loaded).toBeNull()
  })

  it('should clear all cache', async () => {
    await cache.save('hash1', { total: 0, byCategory: {}, byDevice: {}, scanTime: 0, templates: [] })
    await cache.save('hash2', { total: 0, byCategory: {}, byDevice: {}, scanTime: 0, templates: [] })

    await cache.clear()

    const stats = await cache.getStats()
    expect(stats.count).toBe(0)
  })

  it('should provide cache stats', async () => {
    await cache.save('hash1', { total: 0, byCategory: {}, byDevice: {}, scanTime: 0, templates: [] })

    const stats = await cache.getStats()
    expect(stats.count).toBeGreaterThan(0)
    expect(stats).toHaveProperty('totalSize')
    expect(stats).toHaveProperty('oldestTimestamp')
  })
})


