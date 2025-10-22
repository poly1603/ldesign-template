/**
 * A/B 测试引擎测试
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createABTestEngine } from '../../src/core/ab-test-engine'

describe('ABTestEngine', () => {
  let engine: ReturnType<typeof createABTestEngine>

  beforeEach(() => {
    engine = createABTestEngine('weighted')
    // 清除 localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('ldesign-ab-tests')
    }
  })

  afterEach(() => {
    engine.clear()
  })

  it('should create test', () => {
    engine.createTest({
      id: 'test-1',
      name: 'Test 1',
      variants: [
        { id: 'control', name: 'Control', templateId: 'template-a', weight: 0.5 },
        { id: 'variant', name: 'Variant', templateId: 'template-b', weight: 0.5 },
      ],
    })

    const test = engine.getTest('test-1')
    expect(test).toBeDefined()
    expect(test?.variants).toHaveLength(2)
  })

  it('should allocate variant to user', () => {
    engine.createTest({
      id: 'test-1',
      name: 'Test 1',
      variants: [
        { id: 'a', name: 'A', templateId: 'template-a', weight: 0.5 },
        { id: 'b', name: 'B', templateId: 'template-b', weight: 0.5 },
      ],
    })

    const variant = engine.allocate('test-1', 'user-123')
    expect(variant).toMatch(/^(a|b)$/)

    // 同一用户应获得相同变体
    const variant2 = engine.allocate('test-1', 'user-123')
    expect(variant2).toBe(variant)
  })

  it('should record impression', () => {
    engine.createTest({
      id: 'test-1',
      name: 'Test 1',
      variants: [
        { id: 'a', name: 'A', templateId: 'template-a', weight: 1 },
      ],
    })

    engine.recordImpression('test-1', 'a')
    engine.recordImpression('test-1', 'a')

    const stats = engine.getStats()
    expect(stats.totalImpressions).toBe(2)
  })

  it('should record conversion', () => {
    engine.createTest({
      id: 'test-1',
      name: 'Test 1',
      variants: [
        { id: 'a', name: 'A', templateId: 'template-a', weight: 1 },
      ],
    })

    engine.allocate('test-1', 'user-1') // impression
    engine.recordConversion('test-1', 'a')

    const stats = engine.getStats()
    expect(stats.totalConversions).toBe(1)
  })

  it('should analyze test results', () => {
    engine.createTest({
      id: 'test-1',
      name: 'Test 1',
      variants: [
        { id: 'a', name: 'A', templateId: 'template-a', weight: 0.5 },
        { id: 'b', name: 'B', templateId: 'template-b', weight: 0.5 },
      ],
    })

    // 模拟数据
    for (let i = 0; i < 100; i++) {
      engine.allocate('test-1', `user-${i}`)
    }

    const result = engine.analyze('test-1')
    expect(result).toBeDefined()
    expect(result?.metrics).toBeDefined()
  })

  it('should stop test', () => {
    engine.createTest({
      id: 'test-1',
      name: 'Test 1',
      variants: [
        { id: 'a', name: 'A', templateId: 'template-a', weight: 1 },
      ],
    })

    engine.stopTest('test-1')

    const test = engine.getTest('test-1')
    expect(test).toBeNull()
  })

  it('should provide stats', () => {
    engine.createTest({
      id: 'test-1',
      name: 'Test 1',
      variants: [
        { id: 'a', name: 'A', templateId: 'template-a', weight: 1 },
      ],
    })

    const stats = engine.getStats()
    expect(stats.activeTests).toBe(1)
    expect(stats.totalVariants).toBe(1)
  })
})


