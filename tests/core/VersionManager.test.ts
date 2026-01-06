/**
 * @ldesign/template-core - VersionManager Tests
 * 版本管理器单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { VersionManager, createVersionManager } from '@ldesign/template-core/version'

describe('VersionManager', () => {
  let versionManager: VersionManager
  
  beforeEach(() => {
    versionManager = new VersionManager()
  })
  
  describe('版本注册', () => {
    it('应该注册新版本', () => {
      const result = versionManager.registerVersion('template-1', {
        version: '1.0.0',
        content: { name: 'Test Template' },
        changelog: '初始版本',
      })
      
      expect(result.success).toBe(true)
      expect(result.version).toBe('1.0.0')
    })
    
    it('应该自动生成版本号', () => {
      versionManager.registerVersion('template-1', {
        content: { name: 'v1' },
      })
      
      const result = versionManager.registerVersion('template-1', {
        content: { name: 'v2' },
      })
      
      expect(result.version).toBe('1.0.1')
    })
    
    it('应该支持自定义版本号', () => {
      versionManager.registerVersion('template-1', {
        version: '2.0.0',
        content: { name: 'v2' },
      })
      
      const versions = versionManager.getVersions('template-1')
      expect(versions[0].version).toBe('2.0.0')
    })
    
    it('应该记录注册时间', () => {
      const before = Date.now()
      versionManager.registerVersion('template-1', {
        version: '1.0.0',
        content: {},
      })
      const after = Date.now()
      
      const versions = versionManager.getVersions('template-1')
      expect(versions[0].createdAt).toBeGreaterThanOrEqual(before)
      expect(versions[0].createdAt).toBeLessThanOrEqual(after)
    })
    
    it('应该拒绝重复版本号', () => {
      versionManager.registerVersion('template-1', {
        version: '1.0.0',
        content: {},
      })
      
      const result = versionManager.registerVersion('template-1', {
        version: '1.0.0',
        content: {},
      })
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('已存在')
    })
  })
  
  describe('版本获取', () => {
    beforeEach(() => {
      versionManager.registerVersion('template-1', {
        version: '1.0.0',
        content: { name: 'v1.0.0' },
      })
      versionManager.registerVersion('template-1', {
        version: '1.1.0',
        content: { name: 'v1.1.0' },
      })
      versionManager.registerVersion('template-1', {
        version: '2.0.0',
        content: { name: 'v2.0.0' },
      })
    })
    
    it('应该获取所有版本', () => {
      const versions = versionManager.getVersions('template-1')
      expect(versions.length).toBe(3)
    })
    
    it('应该按版本号排序', () => {
      const versions = versionManager.getVersions('template-1')
      expect(versions[0].version).toBe('2.0.0')
      expect(versions[1].version).toBe('1.1.0')
      expect(versions[2].version).toBe('1.0.0')
    })
    
    it('应该获取特定版本', () => {
      const version = versionManager.getVersion('template-1', '1.1.0')
      expect(version).toBeDefined()
      expect(version?.content.name).toBe('v1.1.0')
    })
    
    it('应该获取最新版本', () => {
      const latest = versionManager.getLatestVersion('template-1')
      expect(latest?.version).toBe('2.0.0')
    })
    
    it('应该返回undefined对于不存在的版本', () => {
      const version = versionManager.getVersion('template-1', '3.0.0')
      expect(version).toBeUndefined()
    })
    
    it('应该返回undefined对于不存在的模板', () => {
      const version = versionManager.getVersion('non-existent', '1.0.0')
      expect(version).toBeUndefined()
    })
  })
  
  describe('版本切换', () => {
    beforeEach(() => {
      versionManager.registerVersion('template-1', {
        version: '1.0.0',
        content: { name: 'v1' },
      })
      versionManager.registerVersion('template-1', {
        version: '2.0.0',
        content: { name: 'v2' },
      })
    })
    
    it('应该切换到指定版本', () => {
      const result = versionManager.switchVersion('template-1', '1.0.0')
      
      expect(result.success).toBe(true)
      expect(versionManager.getCurrentVersion('template-1')).toBe('1.0.0')
    })
    
    it('应该默认使用最新版本', () => {
      expect(versionManager.getCurrentVersion('template-1')).toBe('2.0.0')
    })
    
    it('应该拒绝切换到不存在的版本', () => {
      const result = versionManager.switchVersion('template-1', '3.0.0')
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('不存在')
    })
  })
  
  describe('版本回滚', () => {
    beforeEach(() => {
      versionManager.registerVersion('template-1', {
        version: '1.0.0',
        content: { name: 'v1' },
      })
      versionManager.registerVersion('template-1', {
        version: '2.0.0',
        content: { name: 'v2' },
      })
      versionManager.registerVersion('template-1', {
        version: '3.0.0',
        content: { name: 'v3' },
      })
    })
    
    it('应该回滚到上一个版本', () => {
      const result = versionManager.rollback('template-1')
      
      expect(result.success).toBe(true)
      expect(result.fromVersion).toBe('3.0.0')
      expect(result.toVersion).toBe('2.0.0')
      expect(versionManager.getCurrentVersion('template-1')).toBe('2.0.0')
    })
    
    it('应该支持多次回滚', () => {
      versionManager.rollback('template-1')
      versionManager.rollback('template-1')
      
      expect(versionManager.getCurrentVersion('template-1')).toBe('1.0.0')
    })
    
    it('应该在只有一个版本时拒绝回滚', () => {
      const manager = new VersionManager()
      manager.registerVersion('single', { version: '1.0.0', content: {} })
      
      const result = manager.rollback('single')
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('没有可回滚')
    })
  })
  
  describe('版本比较', () => {
    it('应该正确比较版本号', () => {
      expect(versionManager.compareVersions('1.0.0', '2.0.0')).toBeLessThan(0)
      expect(versionManager.compareVersions('2.0.0', '1.0.0')).toBeGreaterThan(0)
      expect(versionManager.compareVersions('1.0.0', '1.0.0')).toBe(0)
    })
    
    it('应该处理次版本号', () => {
      expect(versionManager.compareVersions('1.1.0', '1.2.0')).toBeLessThan(0)
      expect(versionManager.compareVersions('1.10.0', '1.9.0')).toBeGreaterThan(0)
    })
    
    it('应该处理修订版本号', () => {
      expect(versionManager.compareVersions('1.0.1', '1.0.2')).toBeLessThan(0)
      expect(versionManager.compareVersions('1.0.10', '1.0.9')).toBeGreaterThan(0)
    })
  })
  
  describe('版本差异', () => {
    beforeEach(() => {
      versionManager.registerVersion('template-1', {
        version: '1.0.0',
        content: {
          name: 'Template',
          description: 'Original description',
          settings: { theme: 'light' },
        },
      })
      versionManager.registerVersion('template-1', {
        version: '2.0.0',
        content: {
          name: 'Template Updated',
          description: 'Original description',
          settings: { theme: 'dark', fontSize: 14 },
        },
      })
    })
    
    it('应该生成版本差异', () => {
      const diff = versionManager.diff('template-1', '1.0.0', '2.0.0')
      
      expect(diff).toBeDefined()
      expect(diff?.added).toBeDefined()
      expect(diff?.removed).toBeDefined()
      expect(diff?.modified).toBeDefined()
    })
    
    it('应该检测添加的字段', () => {
      const diff = versionManager.diff('template-1', '1.0.0', '2.0.0')
      
      expect(diff?.added).toContain('settings.fontSize')
    })
    
    it('应该检测修改的字段', () => {
      const diff = versionManager.diff('template-1', '1.0.0', '2.0.0')
      
      expect(diff?.modified).toContain('name')
      expect(diff?.modified).toContain('settings.theme')
    })
    
    it('应该返回null对于不存在的版本', () => {
      const diff = versionManager.diff('template-1', '1.0.0', '3.0.0')
      expect(diff).toBeNull()
    })
  })
  
  describe('版本弃用', () => {
    beforeEach(() => {
      versionManager.registerVersion('template-1', {
        version: '1.0.0',
        content: {},
      })
      versionManager.registerVersion('template-1', {
        version: '2.0.0',
        content: {},
      })
    })
    
    it('应该标记版本为弃用', () => {
      const result = versionManager.deprecateVersion('template-1', '1.0.0', '请升级到2.0.0')
      
      expect(result.success).toBe(true)
      
      const version = versionManager.getVersion('template-1', '1.0.0')
      expect(version?.deprecated).toBe(true)
      expect(version?.deprecationMessage).toBe('请升级到2.0.0')
    })
    
    it('应该获取非弃用版本列表', () => {
      versionManager.deprecateVersion('template-1', '1.0.0')
      
      const activeVersions = versionManager.getActiveVersions('template-1')
      expect(activeVersions.length).toBe(1)
      expect(activeVersions[0].version).toBe('2.0.0')
    })
  })
  
  describe('更新检测', () => {
    beforeEach(() => {
      versionManager.registerVersion('template-1', {
        version: '1.0.0',
        content: {},
      })
      versionManager.registerVersion('template-1', {
        version: '2.0.0',
        content: {},
      })
    })
    
    it('应该检测可用更新', () => {
      versionManager.switchVersion('template-1', '1.0.0')
      
      const hasUpdate = versionManager.hasUpdate('template-1')
      expect(hasUpdate).toBe(true)
    })
    
    it('应该在最新版本时返回false', () => {
      const hasUpdate = versionManager.hasUpdate('template-1')
      expect(hasUpdate).toBe(false)
    })
    
    it('应该获取可用更新信息', () => {
      versionManager.switchVersion('template-1', '1.0.0')
      
      const update = versionManager.getAvailableUpdate('template-1')
      expect(update?.currentVersion).toBe('1.0.0')
      expect(update?.latestVersion).toBe('2.0.0')
    })
  })
  
  describe('版本统计', () => {
    beforeEach(() => {
      versionManager.registerVersion('template-1', { version: '1.0.0', content: {} })
      versionManager.registerVersion('template-1', { version: '2.0.0', content: {} })
      versionManager.registerVersion('template-2', { version: '1.0.0', content: {} })
    })
    
    it('应该获取版本统计', () => {
      const stats = versionManager.getStats()
      
      expect(stats.totalTemplates).toBe(2)
      expect(stats.totalVersions).toBe(3)
    })
    
    it('应该获取单个模板的版本统计', () => {
      const stats = versionManager.getTemplateStats('template-1')
      
      expect(stats.versionCount).toBe(2)
      expect(stats.currentVersion).toBe('2.0.0')
      expect(stats.oldestVersion).toBe('1.0.0')
      expect(stats.newestVersion).toBe('2.0.0')
    })
  })
  
  describe('版本清理', () => {
    it('应该清理旧版本', () => {
      for (let i = 1; i <= 10; i++) {
        versionManager.registerVersion('template-1', {
          version: `1.0.${i}`,
          content: {},
        })
      }
      
      const removed = versionManager.cleanup('template-1', { keepCount: 5 })
      
      expect(removed).toBe(5)
      expect(versionManager.getVersions('template-1').length).toBe(5)
    })
    
    it('应该保留最新版本', () => {
      for (let i = 1; i <= 5; i++) {
        versionManager.registerVersion('template-1', {
          version: `1.0.${i}`,
          content: {},
        })
      }
      
      versionManager.cleanup('template-1', { keepCount: 2 })
      
      const versions = versionManager.getVersions('template-1')
      expect(versions[0].version).toBe('1.0.5')
      expect(versions[1].version).toBe('1.0.4')
    })
  })
  
  describe('工厂函数', () => {
    it('createVersionManager应该创建实例', () => {
      const manager = createVersionManager()
      expect(manager).toBeInstanceOf(VersionManager)
    })
    
    it('应该支持自定义配置', () => {
      const manager = createVersionManager({
        maxVersionsPerTemplate: 5,
        autoCleanup: true,
      })
      
      expect(manager).toBeInstanceOf(VersionManager)
    })
  })
  
  describe('事件监听', () => {
    it('应该在版本注册时触发事件', () => {
      const callback = vi.fn()
      versionManager.on('version:registered', callback)
      
      versionManager.registerVersion('template-1', {
        version: '1.0.0',
        content: {},
      })
      
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          templateId: 'template-1',
          version: '1.0.0',
        })
      )
    })
    
    it('应该在版本切换时触发事件', () => {
      versionManager.registerVersion('template-1', { version: '1.0.0', content: {} })
      versionManager.registerVersion('template-1', { version: '2.0.0', content: {} })
      
      const callback = vi.fn()
      versionManager.on('version:switched', callback)
      
      versionManager.switchVersion('template-1', '1.0.0')
      
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          templateId: 'template-1',
          fromVersion: '2.0.0',
          toVersion: '1.0.0',
        })
      )
    })
    
    it('应该支持移除事件监听', () => {
      const callback = vi.fn()
      const off = versionManager.on('version:registered', callback)
      
      off()
      
      versionManager.registerVersion('template-1', {
        version: '1.0.0',
        content: {},
      })
      
      expect(callback).not.toHaveBeenCalled()
    })
  })
})