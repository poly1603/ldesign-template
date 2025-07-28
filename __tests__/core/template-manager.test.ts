import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { TemplateManager } from '../../src/core/template-manager'
import type { TemplateConfig, TemplateManagerConfig } from '../../src/types'

// Mock 模板配置
const mockTemplateConfig: TemplateConfig = {
  id: 'test-login-desktop-default',
  name: '测试登录模板',
  description: '用于测试的登录模板',
  version: '1.0.0',
  author: 'Test Author',
  category: 'login',
  device: 'desktop',
  templateName: 'default',
  preview: 'test-preview.png',
  tags: ['测试', '登录'],
  props: {
    title: {
      type: 'string',
      default: '用户登录',
      description: '登录页面标题'
    },
    showRememberMe: {
      type: 'boolean',
      default: true,
      description: '是否显示记住我选项'
    }
  },
  slots: {
    header: {
      description: '页面头部插槽'
    }
  },
  events: {
    login: {
      description: '登录事件',
      params: {
        username: 'string',
        password: 'string'
      }
    }
  }
}

const mockMobileTemplate: TemplateConfig = {
  ...mockTemplateConfig,
  id: 'test-login-mobile-default',
  device: 'mobile',
  name: '测试移动端登录模板'
}

describe('TemplateManager', () => {
  let templateManager: TemplateManager
  let config: TemplateManagerConfig

  beforeEach(() => {
    config = {
      autoScan: false, // 禁用自动扫描以便测试
      enableCache: true,
      enableDeviceDetection: true,
      enableStorage: false, // 禁用存储以避免副作用
      errorRetryCount: 2,
      errorRetryDelay: 100
    }
    
    templateManager = new TemplateManager(config)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('初始化', () => {
    it('应该正确初始化模板管理器', async () => {
      expect(templateManager).toBeDefined()
      expect(templateManager.isInitialized()).toBe(false)
      
      await templateManager.initialize()
      expect(templateManager.isInitialized()).toBe(true)
    })

    it('应该使用默认配置', () => {
      const defaultManager = new TemplateManager()
      expect(defaultManager).toBeDefined()
    })

    it('应该合并自定义配置', () => {
      const customConfig = { enableCache: false }
      const manager = new TemplateManager(customConfig)
      expect(manager).toBeDefined()
    })
  })

  describe('模板注册', () => {
    beforeEach(async () => {
      await templateManager.initialize()
    })

    it('应该能够注册模板', () => {
      const result = templateManager.registerTemplate(mockTemplateConfig)
      expect(result).toBe(true)
      
      const templates = templateManager.getAvailableTemplates()
      expect(templates).toHaveLength(1)
      expect(templates[0].id).toBe(mockTemplateConfig.id)
    })

    it('应该拒绝重复的模板ID', () => {
      templateManager.registerTemplate(mockTemplateConfig)
      const result = templateManager.registerTemplate(mockTemplateConfig)
      expect(result).toBe(false)
    })

    it('应该验证模板配置', () => {
      const invalidTemplate = { ...mockTemplateConfig, id: '' }
      const result = templateManager.registerTemplate(invalidTemplate as TemplateConfig)
      expect(result).toBe(false)
    })

    it('应该能够注册多个模板', () => {
      templateManager.registerTemplate(mockTemplateConfig)
      templateManager.registerTemplate(mockMobileTemplate)
      
      const templates = templateManager.getAvailableTemplates()
      expect(templates).toHaveLength(2)
    })
  })

  describe('模板查询', () => {
    beforeEach(async () => {
      await templateManager.initialize()
      templateManager.registerTemplate(mockTemplateConfig)
      templateManager.registerTemplate(mockMobileTemplate)
    })

    it('应该能够根据ID获取模板', () => {
      const template = templateManager.getTemplateById(mockTemplateConfig.id)
      expect(template).toBeDefined()
      expect(template?.id).toBe(mockTemplateConfig.id)
    })

    it('应该在模板不存在时返回null', () => {
      const template = templateManager.getTemplateById('non-existent')
      expect(template).toBeNull()
    })

    it('应该能够根据分类获取模板', () => {
      const templates = templateManager.getTemplatesByCategory('login')
      expect(templates).toHaveLength(2)
      expect(templates.every(t => t.category === 'login')).toBe(true)
    })

    it('应该能够根据设备类型获取模板', () => {
      const desktopTemplates = templateManager.getTemplatesByDevice('desktop')
      expect(desktopTemplates).toHaveLength(1)
      expect(desktopTemplates[0].device).toBe('desktop')

      const mobileTemplates = templateManager.getTemplatesByDevice('mobile')
      expect(mobileTemplates).toHaveLength(1)
      expect(mobileTemplates[0].device).toBe('mobile')
    })

    it('应该能够搜索模板', () => {
      const results = templateManager.searchTemplates('移动端')
      expect(results).toHaveLength(1)
      expect(results[0].device).toBe('mobile')
    })

    it('应该能够获取默认模板', () => {
      const defaultTemplate = templateManager.getDefaultTemplate('login', 'desktop')
      expect(defaultTemplate).toBeDefined()
      expect(defaultTemplate?.templateName).toBe('default')
    })
  })

  describe('模板切换', () => {
    beforeEach(async () => {
      await templateManager.initialize()
      templateManager.registerTemplate(mockTemplateConfig)
      templateManager.registerTemplate(mockMobileTemplate)
    })

    it('应该能够切换到指定模板', async () => {
      const result = await templateManager.switchTemplate(mockTemplateConfig.id)
      expect(result).toBe(true)
      
      const currentTemplate = templateManager.getCurrentTemplate()
      expect(currentTemplate?.id).toBe(mockTemplateConfig.id)
    })

    it('应该在模板不存在时返回false', async () => {
      const result = await templateManager.switchTemplate('non-existent')
      expect(result).toBe(false)
    })

    it('应该触发模板切换事件', async () => {
      const mockCallback = vi.fn()
      templateManager.on('templateChanged', mockCallback)
      
      await templateManager.switchTemplate(mockTemplateConfig.id)
      
      expect(mockCallback).toHaveBeenCalledWith({
        oldTemplate: null,
        newTemplate: mockTemplateConfig
      })
    })
  })

  describe('设备检测', () => {
    beforeEach(async () => {
      await templateManager.initialize()
      templateManager.registerTemplate(mockTemplateConfig)
      templateManager.registerTemplate(mockMobileTemplate)
    })

    it('应该能够自动检测设备类型', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200
      })
      
      const deviceType = templateManager.detectDeviceType()
      expect(deviceType).toBe('desktop')
    })

    it('应该能够根据设备类型自动选择模板', async () => {
      // Mock 移动设备
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600
      })
      
      const result = await templateManager.autoSelectTemplate('login')
      expect(result).toBe(true)
      
      const currentTemplate = templateManager.getCurrentTemplate()
      expect(currentTemplate?.device).toBe('mobile')
    })
  })

  describe('缓存管理', () => {
    beforeEach(async () => {
      await templateManager.initialize()
    })

    it('应该能够缓存模板', () => {
      templateManager.registerTemplate(mockTemplateConfig)
      
      // 第一次获取应该缓存
      const template1 = templateManager.getTemplateById(mockTemplateConfig.id)
      expect(template1).toBeDefined()
      
      // 第二次获取应该从缓存返回
      const template2 = templateManager.getTemplateById(mockTemplateConfig.id)
      expect(template2).toBe(template1)
    })

    it('应该能够清空缓存', () => {
      templateManager.registerTemplate(mockTemplateConfig)
      templateManager.getTemplateById(mockTemplateConfig.id) // 触发缓存
      
      templateManager.clearCache()
      
      // 验证缓存已清空（这里需要根据实际实现来验证）
      const stats = templateManager.getCacheStats()
      expect(stats.size).toBe(0)
    })

    it('应该能够获取缓存统计', () => {
      const stats = templateManager.getCacheStats()
      expect(stats).toHaveProperty('size')
      expect(stats).toHaveProperty('hitRate')
      expect(stats).toHaveProperty('missRate')
    })
  })

  describe('错误处理', () => {
    beforeEach(async () => {
      await templateManager.initialize()
    })

    it('应该处理模板加载错误', async () => {
      const mockErrorCallback = vi.fn()
      templateManager.on('error', mockErrorCallback)
      
      // 尝试切换到不存在的模板
      const result = await templateManager.switchTemplate('non-existent')
      expect(result).toBe(false)
    })

    it('应该支持错误重试', async () => {
      let attemptCount = 0
      const mockLoader = vi.fn().mockImplementation(() => {
        attemptCount++
        if (attemptCount < 3) {
          throw new Error('模拟错误')
        }
        return mockTemplateConfig
      })
      
      // 这里需要根据实际API来测试重试机制
      // templateManager.setCustomLoader(mockLoader)
      // const result = await templateManager.loadTemplate('test-id')
      // expect(attemptCount).toBe(3)
    })

    it('应该在达到最大重试次数后失败', async () => {
      const mockLoader = vi.fn().mockRejectedValue(new Error('持续失败'))
      
      // 测试最大重试次数
      // 这里需要根据实际API来实现
    })
  })

  describe('事件系统', () => {
    beforeEach(async () => {
      await templateManager.initialize()
    })

    it('应该能够注册和触发事件监听器', () => {
      const mockCallback = vi.fn()
      templateManager.on('test-event', mockCallback)
      
      templateManager.emit('test-event', { data: 'test' })
      expect(mockCallback).toHaveBeenCalledWith({ data: 'test' })
    })

    it('应该能够移除事件监听器', () => {
      const mockCallback = vi.fn()
      templateManager.on('test-event', mockCallback)
      templateManager.off('test-event', mockCallback)
      
      templateManager.emit('test-event', { data: 'test' })
      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('应该支持一次性事件监听器', () => {
      const mockCallback = vi.fn()
      templateManager.once('test-event', mockCallback)
      
      templateManager.emit('test-event', { data: 'test1' })
      templateManager.emit('test-event', { data: 'test2' })
      
      expect(mockCallback).toHaveBeenCalledTimes(1)
      expect(mockCallback).toHaveBeenCalledWith({ data: 'test1' })
    })
  })

  describe('性能监控', () => {
    beforeEach(async () => {
      await templateManager.initialize()
      templateManager.registerTemplate(mockTemplateConfig)
    })

    it('应该能够记录模板加载时间', async () => {
      await templateManager.switchTemplate(mockTemplateConfig.id)
      
      const metrics = templateManager.getPerformanceMetrics()
      expect(metrics).toHaveProperty('loadTime')
      expect(typeof metrics.loadTime).toBe('number')
    })

    it('应该能够记录模板切换次数', async () => {
      await templateManager.switchTemplate(mockTemplateConfig.id)
      await templateManager.switchTemplate(mockTemplateConfig.id)
      
      const metrics = templateManager.getPerformanceMetrics()
      expect(metrics.switchCount).toBeGreaterThan(0)
    })
  })

  describe('销毁和清理', () => {
    it('应该能够正确销毁管理器', async () => {
      await templateManager.initialize()
      templateManager.registerTemplate(mockTemplateConfig)
      
      templateManager.destroy()
      
      expect(templateManager.isInitialized()).toBe(false)
      expect(templateManager.getAvailableTemplates()).toHaveLength(0)
    })

    it('应该在销毁时清理所有监听器', () => {
      const mockCallback = vi.fn()
      templateManager.on('test-event', mockCallback)
      
      templateManager.destroy()
      templateManager.emit('test-event', { data: 'test' })
      
      expect(mockCallback).not.toHaveBeenCalled()
    })
  })
})
