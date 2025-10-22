/**
 * 依赖管理器测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { createDependencyManager } from '../../src/core/dependency-manager'

describe('DependencyManager', () => {
  let depMgr: ReturnType<typeof createDependencyManager>

  beforeEach(() => {
    depMgr = createDependencyManager()
  })

  it('should register dependencies', () => {
    depMgr.register('template-a', [
      { templateId: 'template-b' },
      { templateId: 'template-c' },
    ])

    const deps = depMgr.getDependencies('template-a')
    expect(deps).toHaveLength(2)
  })

  it('should get recursive dependencies', () => {
    depMgr.register('a', [{ templateId: 'b' }])
    depMgr.register('b', [{ templateId: 'c' }])
    depMgr.register('c', [])

    const deps = depMgr.getDependencies('a', true)
    expect(deps.length).toBeGreaterThanOrEqual(2)
  })

  it('should detect circular dependencies', () => {
    depMgr.register('a', [{ templateId: 'b' }])
    depMgr.register('b', [{ templateId: 'c' }])
    depMgr.register('c', [{ templateId: 'a' }]) // 循环

    const circular = depMgr.detectCircular('a')
    expect(circular.length).toBeGreaterThan(0)
  })

  it('should get load order', () => {
    depMgr.register('a', [{ templateId: 'b' }])
    depMgr.register('b', [{ templateId: 'c' }])
    depMgr.register('c', [])

    const order = depMgr.getLoadOrder(['a', 'b', 'c'])
    expect(order[0]).toBe('c') // c 应该最先加载
  })

  it('should validate dependencies', () => {
    depMgr.register('a', [{ templateId: 'b' }])
    depMgr.register('b', [])

    const { valid } = depMgr.validate()
    expect(valid).toBe(true)
  })

  it('should detect missing dependencies', () => {
    depMgr.register('a', [{ templateId: 'non-existent' }])

    const { valid, errors } = depMgr.validate()
    expect(valid).toBe(false)
    expect(errors.length).toBeGreaterThan(0)
  })

  it('should get dependency tree', () => {
    depMgr.register('a', [{ templateId: 'b' }])
    depMgr.register('b', [{ templateId: 'c' }])

    const tree = depMgr.getDependencyTree('a')
    expect(tree).toBeDefined()
    expect(tree.dependencies).toBeDefined()
  })

  it('should provide statistics', () => {
    depMgr.register('a', [{ templateId: 'b' }, { templateId: 'c' }])
    depMgr.register('b', [])

    const stats = depMgr.getStats()
    expect(stats.totalTemplates).toBeGreaterThan(0)
    expect(stats.totalDependencies).toBeGreaterThan(0)
  })
})


