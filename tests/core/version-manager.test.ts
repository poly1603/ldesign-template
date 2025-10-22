/**
 * 版本管理器测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { createVersionManager } from '../../src/core/version-manager'

describe('VersionManager', () => {
  let versionMgr: ReturnType<typeof createVersionManager>

  beforeEach(() => {
    versionMgr = createVersionManager()
  })

  it('should register version', () => {
    const metadata = {
      name: 'test',
      displayName: 'Test',
      category: 'login',
      device: 'desktop' as const,
    }

    versionMgr.registerVersion('login/desktop/test', '1.0.0', metadata)

    const versions = versionMgr.getVersions('login/desktop/test')
    expect(versions).toHaveLength(1)
    expect(versions[0].version).toBe('1.0.0')
  })

  it('should sort versions correctly', () => {
    const metadata = {
      name: 'test',
      displayName: 'Test',
      category: 'login',
      device: 'desktop' as const,
    }

    versionMgr.registerVersion('test', '1.2.0', metadata)
    versionMgr.registerVersion('test', '1.0.0', metadata)
    versionMgr.registerVersion('test', '1.1.0', metadata)

    const versions = versionMgr.getVersions('test')
    expect(versions[0].version).toBe('1.0.0')
    expect(versions[1].version).toBe('1.1.0')
    expect(versions[2].version).toBe('1.2.0')
  })

  it('should switch version', () => {
    const metadata = {
      name: 'test',
      displayName: 'Test',
      category: 'login',
      device: 'desktop' as const,
    }

    versionMgr.registerVersion('test', '1.0.0', metadata)
    versionMgr.registerVersion('test', '2.0.0', metadata)

    const switched = versionMgr.switchVersion('test', '1.0.0')
    expect(switched?.version).toBe('1.0.0')

    const current = versionMgr.getCurrentVersion('test')
    expect(current).toBe('1.0.0')
  })

  it('should rollback to previous version', () => {
    const metadata = {
      name: 'test',
      displayName: 'Test',
      category: 'login',
      device: 'desktop' as const,
    }

    versionMgr.registerVersion('test', '1.0.0', metadata)
    versionMgr.registerVersion('test', '2.0.0', metadata)
    versionMgr.switchVersion('test', '2.0.0')

    const rolled = versionMgr.rollback('test')
    expect(rolled?.version).toBe('1.0.0')
  })

  it('should compare versions', () => {
    expect(versionMgr.compareVersions('1.0.0', '2.0.0')).toBe(-1)
    expect(versionMgr.compareVersions('2.0.0', '1.0.0')).toBe(1)
    expect(versionMgr.compareVersions('1.0.0', '1.0.0')).toBe(0)
  })

  it('should check compatibility', () => {
    const metadata = {
      name: 'test',
      displayName: 'Test',
      category: 'login',
      device: 'desktop' as const,
    }

    versionMgr.registerVersion('test', '1.5.0', metadata)
    versionMgr.switchVersion('test', '1.5.0')

    expect(versionMgr.isCompatible('test', '1.0.0')).toBe(true)
    expect(versionMgr.isCompatible('test', '1.0.0', '2.0.0')).toBe(true)
    expect(versionMgr.isCompatible('test', '2.0.0')).toBe(false)
  })
})


