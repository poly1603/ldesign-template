/**
 * Vue模板管理组合式函数
 */

import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import {
  Template,
  DeviceType,
  UseTemplateConfig,
  TemplateStatus,
  TemplateCategory
} from '../types'
import { TemplateManager } from '../core/TemplateManager'
import { DeviceDetector, StorageManager } from '../utils'

/**
 * 模板管理组合式函数
 */
export function useTemplate(category: string, config: UseTemplateConfig = {}) {
  // 配置默认值
  const defaultConfig: Required<UseTemplateConfig> = {
    defaultTemplates: {
      [DeviceType.DESKTOP]: 'default',
      [DeviceType.MOBILE]: 'default',
      [DeviceType.TABLET]: 'default'
    },
    autoSwitchByDevice: false,
    storageKey: `template-${category}`,
    storageType: 'localStorage',
    preload: true,
    deviceDetection: {
      mobileBreakpoint: 768,
      tabletBreakpoint: 1024
    },
    ...config
  }

  // 响应式状态
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentDevice = ref<DeviceType>(DeviceType.DESKTOP)
  const currentTemplate = ref<Template | null>(null)
  const availableTemplates = ref<Template[]>([])
  const templateCategories = ref<TemplateCategory[]>([])
  const isInitialized = ref(false)

  // 管理器实例
  const templateManager = TemplateManager.getInstance()
  const deviceDetector = DeviceDetector.getInstance()
  const storageManager = new StorageManager(defaultConfig.storageType)

  // 计算属性
  const currentTemplateId = computed(() => {
    if (!currentTemplate.value) return null
    return currentTemplate.value.info.id
  })

  const isTemplateLoaded = computed(() => {
    return currentTemplate.value?.status === TemplateStatus.LOADED ||
           currentTemplate.value?.status === TemplateStatus.CACHED
  })

  const hasError = computed(() => {
    return !!error.value || currentTemplate.value?.status === TemplateStatus.ERROR
  })

  const templateComponent = computed(() => {
    if (!isTemplateLoaded.value || !currentTemplate.value?.component) {
      return null
    }
    return currentTemplate.value.component.component
  })

  /**
   * 初始化
   */
  const initialize = async () => {
    try {
      isLoading.value = true
      error.value = null

      // 配置设备检测
      deviceDetector.configure(defaultConfig.deviceDetection)
      currentDevice.value = deviceDetector.getCurrentDevice()

      // 确保模板管理器已初始化
      await templateManager.initialize()

      // 加载可用模板
      await loadAvailableTemplates()

      // 加载当前模板
      await loadCurrentTemplate()

      // 预加载模板组件
      if (defaultConfig.preload) {
        await preloadTemplates()
      }

      isInitialized.value = true
    } catch (err) {
      error.value = (err as Error).message
      console.error('Template initialization failed:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 加载可用模板
   */
  const loadAvailableTemplates = async () => {
    const templates = templateManager.getTemplates(category, currentDevice.value)
    availableTemplates.value = templates
    
    const categories = templateManager.getCategories()
    templateCategories.value = categories
  }

  /**
   * 加载当前模板
   */
  const loadCurrentTemplate = async () => {
    try {
      // 从存储中获取用户选择
      const savedTemplateId = storageManager.get<string>(
        `${defaultConfig.storageKey}-${currentDevice.value}`
      )

      let template: Template | null = null

      if (savedTemplateId) {
        template = templateManager.getTemplate(savedTemplateId)
      }

      // 如果没有保存的模板或模板不存在，使用默认模板
      if (!template) {
        const defaultTemplateName = defaultConfig.defaultTemplates[currentDevice.value]
        if (defaultTemplateName) {
          const templates = templateManager.getTemplates(category, currentDevice.value)
          template = templates.find(t => t.info.name === defaultTemplateName) ||
                    templateManager.getDefaultTemplate(category, currentDevice.value)
        } else {
          template = templateManager.getDefaultTemplate(category, currentDevice.value)
        }
      }

      if (template) {
        await switchToTemplate(template.info.id, false)
      }
    } catch (err) {
      error.value = `Failed to load current template: ${(err as Error).message}`
    }
  }

  /**
   * 预加载模板组件
   */
  const preloadTemplates = async () => {
    const templates = availableTemplates.value
    const preloadPromises = templates.map(async (template) => {
      try {
        await templateManager.loadTemplateComponent(template.info.id)
      } catch (err) {
        console.warn(`Failed to preload template ${template.info.id}:`, err)
      }
    })

    await Promise.allSettled(preloadPromises)
  }

  /**
   * 切换模板
   */
  const switchTemplate = async (templateId: string, saveToStorage = true) => {
    await switchToTemplate(templateId, saveToStorage)
  }

  /**
   * 内部切换模板方法
   */
  const switchToTemplate = async (templateId: string, saveToStorage = true) => {
    try {
      isLoading.value = true
      error.value = null

      const template = templateManager.getTemplate(templateId)
      if (!template) {
        throw new Error(`Template not found: ${templateId}`)
      }

      // 加载模板组件
      if (!template.component) {
        await templateManager.loadTemplateComponent(templateId)
      }

      currentTemplate.value = template

      // 保存用户选择
      if (saveToStorage) {
        storageManager.set(
          `${defaultConfig.storageKey}-${currentDevice.value}`,
          templateId
        )
      }

      // 等待DOM更新
      await nextTick()

    } catch (err) {
      error.value = `Failed to switch template: ${(err as Error).message}`
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 切换到下一个模板
   */
  const switchToNext = async () => {
    if (!currentTemplate.value || availableTemplates.value.length <= 1) {
      return
    }

    const currentIndex = availableTemplates.value.findIndex(
      t => t.info.id === currentTemplate.value!.info.id
    )
    
    const nextIndex = (currentIndex + 1) % availableTemplates.value.length
    const nextTemplate = availableTemplates.value[nextIndex]
    
    await switchTemplate(nextTemplate.info.id)
  }

  /**
   * 切换到上一个模板
   */
  const switchToPrevious = async () => {
    if (!currentTemplate.value || availableTemplates.value.length <= 1) {
      return
    }

    const currentIndex = availableTemplates.value.findIndex(
      t => t.info.id === currentTemplate.value!.info.id
    )
    
    const prevIndex = currentIndex === 0 
      ? availableTemplates.value.length - 1 
      : currentIndex - 1
    const prevTemplate = availableTemplates.value[prevIndex]
    
    await switchTemplate(prevTemplate.info.id)
  }

  /**
   * 重新加载当前模板
   */
  const reloadCurrentTemplate = async () => {
    if (!currentTemplate.value) return

    try {
      isLoading.value = true
      const reloadedTemplate = await templateManager.reloadTemplate(currentTemplate.value.info.id)
      if (reloadedTemplate) {
        currentTemplate.value = reloadedTemplate
      }
    } catch (err) {
      error.value = `Failed to reload template: ${(err as Error).message}`
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 搜索模板
   */
  const searchTemplates = (query: string) => {
    if (!query.trim()) {
      return availableTemplates.value
    }
    return templateManager.searchTemplates(query, category, currentDevice.value)
  }

  /**
   * 获取模板信息
   */
  const getTemplateInfo = (templateId: string) => {
    const template = templateManager.getTemplate(templateId)
    return template?.info || null
  }

  /**
   * 检查模板是否可用
   */
  const isTemplateAvailable = (templateId: string) => {
    const template = templateManager.getTemplate(templateId)
    return template && template.status !== TemplateStatus.ERROR
  }

  /**
   * 处理设备变化
   */
  const handleDeviceChange = async (newDevice: DeviceType) => {
    if (newDevice === currentDevice.value) return

    currentDevice.value = newDevice
    await loadAvailableTemplates()
    await loadCurrentTemplate()
  }

  /**
   * 清除错误
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * 获取统计信息
   */
  const getStats = () => {
    return {
      totalTemplates: availableTemplates.value.length,
      loadedTemplates: availableTemplates.value.filter(
        t => t.status === TemplateStatus.LOADED || t.status === TemplateStatus.CACHED
      ).length,
      errorTemplates: availableTemplates.value.filter(
        t => t.status === TemplateStatus.ERROR
      ).length,
      currentDevice: currentDevice.value,
      currentTemplate: currentTemplate.value?.info.name || null
    }
  }

  // 监听设备变化
  let deviceUnsubscribe: (() => void) | null = null

  // 生命周期
  onMounted(async () => {
    await initialize()

    // 监听设备变化
    if (defaultConfig.autoSwitchByDevice) {
      deviceUnsubscribe = deviceDetector.addListener(handleDeviceChange)
    }
  })

  onUnmounted(() => {
    if (deviceUnsubscribe) {
      deviceUnsubscribe()
    }
  })

  // 监听配置变化
  watch(
    () => defaultConfig.autoSwitchByDevice,
    (newValue) => {
      if (newValue && !deviceUnsubscribe) {
        deviceUnsubscribe = deviceDetector.addListener(handleDeviceChange)
      } else if (!newValue && deviceUnsubscribe) {
        deviceUnsubscribe()
        deviceUnsubscribe = null
      }
    }
  )

  return {
    // 状态
    isLoading: readonly(isLoading),
    error: readonly(error),
    currentDevice: readonly(currentDevice),
    currentTemplate: readonly(currentTemplate),
    availableTemplates: readonly(availableTemplates),
    templateCategories: readonly(templateCategories),
    isInitialized: readonly(isInitialized),

    // 计算属性
    currentTemplateId,
    isTemplateLoaded,
    hasError,
    templateComponent,

    // 方法
    switchTemplate,
    switchToNext,
    switchToPrevious,
    reloadCurrentTemplate,
    searchTemplates,
    getTemplateInfo,
    isTemplateAvailable,
    clearError,
    getStats,

    // 内部方法（用于高级用法）
    initialize,
    loadAvailableTemplates
  }
}

export default useTemplate