/**
 * @ldesign/template-vue - useTemplate Tests
 * useTemplate组合式函数单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { useTemplate } from '@ldesign/template-vue/composables'

// Mock template manager
const mockTemplateManager = {
  getTemplate: vi.fn(),
  getTemplates: vi.fn(),
  registerTemplate: vi.fn(),
  loadTemplate: vi.fn(),
  unloadTemplate: vi.fn(),
  setCurrentDevice: vi.fn(),
  getCurrentDevice: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
}

vi.mock('@ldesign/template-core', () => ({
  getTemplateManager: () => mockTemplateManager,
}))

describe('useTemplate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTemplateManager.getCurrentDevice.mockReturnValue('desktop')
    mockTemplateManager.getTemplates.mockReturnValue([])
  })
  
  describe('基础功能', () => {
    it('应该返回模板状态和方法', () => {
      const result = useTemplate()
      
      expect(result.loading).toBeDefined()
      expect(result.error).toBeDefined()
      expect(result.currentTemplate).toBeDefined()
      expect(result.templates).toBeDefined()
      expect(result.device).toBeDefined()
      expect(result.loadTemplate).toBeDefined()
      expect(result.selectTemplate).toBeDefined()
      expect(result.setDevice).toBeDefined()
    })
    
    it('应该初始化为加载状态', () => {
      const { loading } = useTemplate()
      expect(loading.value).toBe(true)
    })
    
    it('应该获取当前设备类型', () => {
      mockTemplateManager.getCurrentDevice.mockReturnValue('mobile')
      
      const { device } = useTemplate()
      expect(device.value).toBe('mobile')
    })
  })
  
  describe('模板加载', () => {
    it('应该加载模板', async () => {
      const mockTemplate = {
        id: 'login:desktop:default',
        name: 'Default Login',
        component: { template: '<div>Login</div>' },
      }
      
      mockTemplateManager.loadTemplate.mockResolvedValue(mockTemplate)
      
      const { loadTemplate, currentTemplate, loading, error } = useTemplate()
      
      await loadTemplate('login:desktop:default')
      
      expect(mockTemplateManager.loadTemplate).toHaveBeenCalledWith('login:desktop:default')
      expect(currentTemplate.value).toEqual(mockTemplate)
      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
    })
    
    it('应该处理加载错误', async () => {
      const loadError = new Error('加载失败')
      mockTemplateManager.loadTemplate.mockRejectedValue(loadError)
      
      const { loadTemplate, error, loading } = useTemplate()
      
      await loadTemplate('invalid:template:id')
      
      expect(error.value).toBe(loadError)
      expect(loading.value).toBe(false)
    })
    
    it('应该在加载时设置loading状态', async () => {
      mockTemplateManager.loadTemplate.mockImplementation(() => {
        return new Promise(resolve => setTimeout(resolve, 100))
      })
      
      const { loadTemplate, loading } = useTemplate()
      
      const loadPromise = loadTemplate('test:desktop:v1')
      
      expect(loading.value).toBe(true)
      
      await loadPromise
      
      expect(loading.value).toBe(false)
    })
  })
  
  describe('模板选择', () => {
    it('应该选择模板', async () => {
      const templates = [
        { id: 'login:desktop:default', name: 'Default' },
        { id: 'login:desktop:modern', name: 'Modern' },
      ]
      
      mockTemplateManager.getTemplates.mockReturnValue(templates)
      mockTemplateManager.loadTemplate.mockResolvedValue(templates[1])
      
      const { selectTemplate, currentTemplate } = useTemplate()
      
      await selectTemplate('login:desktop:modern')
      
      expect(mockTemplateManager.loadTemplate).toHaveBeenCalledWith('login:desktop:modern')
    })
    
    it('应该触发模板选择事件', async () => {
      const onSelect = vi.fn()
      mockTemplateManager.loadTemplate.mockResolvedValue({ id: 'test' })
      
      const { selectTemplate } = useTemplate({ onSelect })
      
      await selectTemplate('test:desktop:v1')
      
      expect(onSelect).toHaveBeenCalledWith({ id: 'test' })
    })
  })
  
  describe('设备切换', () => {
    it('应该切换设备类型', async () => {
      const { setDevice, device } = useTemplate()
      
      await setDevice('mobile')
      
      expect(mockTemplateManager.setCurrentDevice).toHaveBeenCalledWith('mobile')
    })
    
    it('应该在设备切换后重新加载模板', async () => {
      mockTemplateManager.loadTemplate.mockResolvedValue({ id: 'test:mobile:v1' })
      
      const { setDevice, loadTemplate } = useTemplate({ autoReload: true })
      
      await loadTemplate('test:desktop:v1')
      await setDevice('mobile')
      
      // 应该尝试加载移动版本
      expect(mockTemplateManager.loadTemplate).toHaveBeenCalledTimes(2)
    })
  })
  
  describe('模板列表', () => {
    it('应该获取模板列表', () => {
      const templates = [
        { id: 'login:desktop:default', name: 'Default' },
        { id: 'login:desktop:modern', name: 'Modern' },
      ]
      
      mockTemplateManager.getTemplates.mockReturnValue(templates)
      
      const { templates: templateList, refreshTemplates } = useTemplate()
      
      refreshTemplates()
      
      expect(templateList.value).toEqual(templates)
    })
    
    it('应该按类别过滤模板', () => {
      const templates = [
        { id: 'login:desktop:default', category: 'login' },
        { id: 'register:desktop:default', category: 'register' },
        { id: 'login:mobile:default', category: 'login' },
      ]
      
      mockTemplateManager.getTemplates.mockReturnValue(templates)
      
      const { getTemplatesByCategory } = useTemplate()
      
      const loginTemplates = getTemplatesByCategory('login')
      
      expect(loginTemplates.length).toBe(2)
      expect(loginTemplates.every(t => t.category === 'login')).toBe(true)
    })
    
    it('应该按设备过滤模板', () => {
      const templates = [
        { id: 'login:desktop:default', device: 'desktop' },
        { id: 'login:mobile:default', device: 'mobile' },
        { id: 'register:desktop:default', device: 'desktop' },
      ]
      
      mockTemplateManager.getTemplates.mockReturnValue(templates)
      
      const { getTemplatesByDevice } = useTemplate()
      
      const mobileTemplates = getTemplatesByDevice('mobile')
      
      expect(mobileTemplates.length).toBe(1)
      expect(mobileTemplates[0].device).toBe('mobile')
    })
  })
  
  describe('选项配置', () => {
    it('应该支持自动加载', async () => {
      mockTemplateManager.loadTemplate.mockResolvedValue({ id: 'auto' })
      
      useTemplate({
        autoLoad: true,
        defaultTemplate: 'auto:desktop:v1',
      })
      
      await nextTick()
      
      expect(mockTemplateManager.loadTemplate).toHaveBeenCalledWith('auto:desktop:v1')
    })
    
    it('应该支持缓存选项', () => {
      const { loadTemplate } = useTemplate({ cache: true })
      
      expect(loadTemplate).toBeDefined()
    })
    
    it('应该支持错误处理回调', async () => {
      const onError = vi.fn()
      const error = new Error('测试错误')
      
      mockTemplateManager.loadTemplate.mockRejectedValue(error)
      
      const { loadTemplate } = useTemplate({ onError })
      
      await loadTemplate('error:test')
      
      expect(onError).toHaveBeenCalledWith(error)
    })
  })
  
  describe('生命周期', () => {
    it('应该在卸载时清理资源', () => {
      const { cleanup } = useTemplate()
      
      cleanup()
      
      // 验证清理逻辑被执行
      expect(mockTemplateManager.off).toHaveBeenCalled()
    })
    
    it('应该订阅模板变化事件', () => {
      useTemplate()
      
      expect(mockTemplateManager.on).toHaveBeenCalled()
    })
  })
  
  describe('响应式', () => {
    it('应该响应式更新loading状态', async () => {
      let resolveLoad: (value: any) => void
      mockTemplateManager.loadTemplate.mockImplementation(() => {
        return new Promise(resolve => {
          resolveLoad = resolve
        })
      })
      
      const { loadTemplate, loading } = useTemplate()
      
      expect(loading.value).toBe(true)
      
      const loadPromise = loadTemplate('test')
      await nextTick()
      
      expect(loading.value).toBe(true)
      
      resolveLoad!({ id: 'test' })
      await loadPromise
      await nextTick()
      
      expect(loading.value).toBe(false)
    })
    
    it('应该响应式更新error状态', async () => {
      const { loadTemplate, error } = useTemplate()
      
      mockTemplateManager.loadTemplate.mockRejectedValue(new Error('错误1'))
      await loadTemplate('test1')
      
      expect(error.value?.message).toBe('错误1')
      
      mockTemplateManager.loadTemplate.mockResolvedValue({ id: 'test2' })
      await loadTemplate('test2')
      
      expect(error.value).toBeNull()
    })
  })
  
  describe('计算属性', () => {
    it('应该提供hasTemplate计算属性', async () => {
      mockTemplateManager.loadTemplate.mockResolvedValue({ id: 'test' })
      
      const { hasTemplate, loadTemplate } = useTemplate()
      
      expect(hasTemplate.value).toBe(false)
      
      await loadTemplate('test')
      
      expect(hasTemplate.value).toBe(true)
    })
    
    it('应该提供isReady计算属性', async () => {
      mockTemplateManager.loadTemplate.mockResolvedValue({ id: 'test' })
      
      const { isReady, loadTemplate } = useTemplate()
      
      expect(isReady.value).toBe(false)
      
      await loadTemplate('test')
      
      expect(isReady.value).toBe(true)
    })
    
    it('应该提供templateInfo计算属性', async () => {
      const template = {
        id: 'login:desktop:default',
        name: 'Default Login',
        version: '1.0.0',
        description: '默认登录模板',
      }
      
      mockTemplateManager.loadTemplate.mockResolvedValue(template)
      
      const { templateInfo, loadTemplate } = useTemplate()
      
      await loadTemplate('login:desktop:default')
      
      expect(templateInfo.value).toEqual({
        id: template.id,
        name: template.name,
        version: template.version,
        description: template.description,
      })
    })
  })
})