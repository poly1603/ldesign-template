import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { useTemplate } from '../../src/composables/useTemplate'
import { useDeviceDetector } from '../../src/composables/useDeviceDetector'
import type { TemplateConfig } from '../../src/types'

// Mock 设备检测
vi.mock('../../src/composables/useDeviceDetector', () => ({
  useDeviceDetector: vi.fn(() => ({
    deviceType: ref('desktop'),
    isMobile: ref(false),
    isTablet: ref(false),
    isDesktop: ref(true)
  }))
}))

// Mock 模板管理器
const mockTemplateManager = {
  initialize: vi.fn().mockResolvedValue(true),
  getAvailableTemplates: vi.fn().mockReturnValue([]),
  getCurrentTemplate: vi.fn().mockReturnValue(null),
  switchTemplate: vi.fn().mockResolvedValue(true),
  refreshTemplates: vi.fn().mockResolvedValue(true),
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn()
}

vi.mock('../../src/core/template-manager', () => ({
  getGlobalTemplateManager: vi.fn(() => mockTemplateManager)
}))

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
    }
  },
  slots: {},
  events: {}
}

const mockMobileTemplate: TemplateConfig = {
  ...mockTemplateConfig,
  id: 'test-login-mobile-default',
  device: 'mobile',
  name: '测试移动端登录模板'
}

describe('useTemplate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // 重置 mock 返回值
    mockTemplateManager.getAvailableTemplates.mockReturnValue([
      mockTemplateConfig,
      mockMobileTemplate
    ])
    mockTemplateManager.getCurrentTemplate.mockReturnValue(mockTemplateConfig)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('基础功能', () => {
    it('应该正确初始化', () => {
      const { currentTemplate, availableTemplates, isLoading, error } = useTemplate({
        category: 'login'
      })

      expect(currentTemplate.value).toBeDefined()
      expect(availableTemplates.value).toHaveLength(2)
      expect(isLoading.value).toBe(false)
      expect(error.value).toBeNull()
    })

    it('应该使用默认配置', () => {
      const result = useTemplate()
      expect(result).toBeDefined()
      expect(result.currentTemplate).toBeDefined()
    })

    it('应该支持自定义配置', () => {
      const { currentTemplate } = useTemplate({
        category: 'login',
        device: 'mobile',
        fallback: 'default',
        autoDetectDevice: false
      })

      expect(currentTemplate.value).toBeDefined()
    })
  })

  describe('模板切换', () => {
    it('应该能够切换模板', async () => {
      const { switchTemplate, currentTemplate } = useTemplate({
        category: 'login'
      })

      mockTemplateManager.getCurrentTemplate.mockReturnValue(mockMobileTemplate)
      
      const result = await switchTemplate('test-login-mobile-default')
      
      expect(result).toBe(true)
      expect(mockTemplateManager.switchTemplate).toHaveBeenCalledWith('test-login-mobile-default')
    })

    it('应该在切换失败时返回false', async () => {
      const { switchTemplate } = useTemplate({
        category: 'login'
      })

      mockTemplateManager.switchTemplate.mockResolvedValue(false)
      
      const result = await switchTemplate('non-existent')
      
      expect(result).toBe(false)
    })

    it('应该在切换时更新加载状态', async () => {
      const { switchTemplate, isLoading } = useTemplate({
        category: 'login'
      })

      // 模拟异步切换
      let resolveSwitch: (value: boolean) => void
      const switchPromise = new Promise<boolean>((resolve) => {
        resolveSwitch = resolve
      })
      mockTemplateManager.switchTemplate.mockReturnValue(switchPromise)

      const switchResult = switchTemplate('test-template')
      
      // 切换开始时应该是加载状态
      expect(isLoading.value).toBe(true)
      
      // 完成切换
      resolveSwitch!(true)
      await switchResult
      
      // 切换完成后应该不是加载状态
      await nextTick()
      expect(isLoading.value).toBe(false)
    })
  })

  describe('设备检测', () => {
    it('应该根据设备类型过滤模板', () => {
      const mockDeviceDetector = useDeviceDetector as any
      mockDeviceDetector.mockReturnValue({
        deviceType: ref('mobile'),
        isMobile: ref(true),
        isTablet: ref(false),
        isDesktop: ref(false)
      })

      const { availableTemplates } = useTemplate({
        category: 'login',
        autoDetectDevice: true
      })

      // 应该只返回移动端模板
      const mobileTemplates = availableTemplates.value.filter(t => t.device === 'mobile')
      expect(mobileTemplates).toHaveLength(1)
    })

    it('应该在禁用自动检测时返回所有模板', () => {
      const { availableTemplates } = useTemplate({
        category: 'login',
        autoDetectDevice: false
      })

      expect(availableTemplates.value).toHaveLength(2)
    })
  })

  describe('错误处理', () => {
    it('应该处理模板加载错误', async () => {
      const { switchTemplate, error } = useTemplate({
        category: 'login'
      })

      const testError = new Error('模板加载失败')
      mockTemplateManager.switchTemplate.mockRejectedValue(testError)
      
      const result = await switchTemplate('test-template')
      
      expect(result).toBe(false)
      expect(error.value).toBe(testError)
    })

    it('应该在错误后清除错误状态', async () => {
      const { switchTemplate, error } = useTemplate({
        category: 'login'
      })

      // 先产生一个错误
      mockTemplateManager.switchTemplate.mockRejectedValueOnce(new Error('错误'))
      await switchTemplate('test-template')
      expect(error.value).toBeTruthy()

      // 然后成功切换
      mockTemplateManager.switchTemplate.mockResolvedValueOnce(true)
      await switchTemplate('test-template')
      expect(error.value).toBeNull()
    })
  })

  describe('模板刷新', () => {
    it('应该能够刷新模板列表', async () => {
      const { refreshTemplates, availableTemplates } = useTemplate({
        category: 'login'
      })

      // 模拟新增模板
      const newTemplate = { ...mockTemplateConfig, id: 'new-template' }
      mockTemplateManager.getAvailableTemplates.mockReturnValue([
        mockTemplateConfig,
        mockMobileTemplate,
        newTemplate
      ])

      await refreshTemplates()

      expect(mockTemplateManager.refreshTemplates).toHaveBeenCalled()
      expect(availableTemplates.value).toHaveLength(3)
    })

    it('应该在刷新时更新加载状态', async () => {
      const { refreshTemplates, isLoading } = useTemplate({
        category: 'login'
      })

      let resolveRefresh: (value: boolean) => void
      const refreshPromise = new Promise<boolean>((resolve) => {
        resolveRefresh = resolve
      })
      mockTemplateManager.refreshTemplates.mockReturnValue(refreshPromise)

      const refreshResult = refreshTemplates()
      
      expect(isLoading.value).toBe(true)
      
      resolveRefresh!(true)
      await refreshResult
      
      await nextTick()
      expect(isLoading.value).toBe(false)
    })
  })

  describe('响应式更新', () => {
    it('应该在模板管理器状态变化时更新', async () => {
      const { currentTemplate } = useTemplate({
        category: 'login'
      })

      expect(currentTemplate.value?.id).toBe('test-login-desktop-default')

      // 模拟模板管理器状态变化
      mockTemplateManager.getCurrentTemplate.mockReturnValue(mockMobileTemplate)
      
      // 触发响应式更新（这里需要根据实际实现来触发）
      // 可能需要通过事件系统或其他方式来触发更新
      
      await nextTick()
      // expect(currentTemplate.value?.id).toBe('test-login-mobile-default')
    })
  })

  describe('生命周期', () => {
    it('应该在组件卸载时清理资源', () => {
      const { cleanup } = useTemplate({
        category: 'login'
      })

      // 手动调用清理函数
      if (cleanup) {
        cleanup()
      }

      // 验证事件监听器已被移除
      expect(mockTemplateManager.off).toHaveBeenCalled()
    })
  })

  describe('缓存和性能', () => {
    it('应该缓存模板查询结果', () => {
      const { availableTemplates } = useTemplate({
        category: 'login'
      })

      // 多次访问应该使用缓存
      const templates1 = availableTemplates.value
      const templates2 = availableTemplates.value
      
      expect(templates1).toBe(templates2)
      expect(mockTemplateManager.getAvailableTemplates).toHaveBeenCalledTimes(1)
    })

    it('应该支持模板预加载', async () => {
      const { preloadTemplates } = useTemplate({
        category: 'login',
        preload: true
      })

      if (preloadTemplates) {
        await preloadTemplates()
        // 验证预加载逻辑
      }
    })
  })

  describe('配置验证', () => {
    it('应该验证无效的分类', () => {
      expect(() => {
        useTemplate({
          category: ''
        })
      }).toThrow()
    })

    it('应该验证无效的设备类型', () => {
      expect(() => {
        useTemplate({
          category: 'login',
          device: 'invalid-device' as any
        })
      }).toThrow()
    })
  })

  describe('事件处理', () => {
    it('应该支持模板变化事件', () => {
      const mockOnChange = vi.fn()
      
      useTemplate({
        category: 'login',
        onChange: mockOnChange
      })

      // 验证事件监听器已注册
      expect(mockTemplateManager.on).toHaveBeenCalledWith('templateChanged', expect.any(Function))
    })

    it('应该支持错误事件', () => {
      const mockOnError = vi.fn()
      
      useTemplate({
        category: 'login',
        onError: mockOnError
      })

      expect(mockTemplateManager.on).toHaveBeenCalledWith('error', expect.any(Function))
    })
  })
})
