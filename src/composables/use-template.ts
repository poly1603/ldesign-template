/**
 * 模板管理 Vue 组合式函数
 */

import { computed, onMounted, ref, watch } from 'vue'
import { getGlobalTemplateManager } from '../core/template-manager'
import type {
  DeviceType,
  TemplateInstance,
  UseTemplateReturn
} from '../types'
import { useDeviceDetector } from './use-device-detector'
import { useStorage } from './use-storage'

/**
 * 模板管理组合式函数
 */
export function useTemplate(
  category: string,
  config: UseTemplateOptions = {}
): UseTemplateReturn {
  const templateManager = getGlobalTemplateManager()
  if (!templateManager) {
    throw new Error('Template manager not initialized. Please call createTemplateManager first.')
  }

  // 响应式状态
  const currentTemplate = ref<TemplateInstance | null>(null)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  // 设备检测
  const { deviceType: currentDevice } = useDeviceDetector()

  // 用户偏好存储
  const storageKey = config.storageKey || `template_preference_${category}`
  const { value: userPreference, setValue: setUserPreference } = useStorage<{
    templateId: string
    deviceType: DeviceType
  } | null>(storageKey, null, config.storageType)

  // 计算可用模板列表
  const availableTemplates = computed(() => {
    return templateManager.getTemplatesByCategory(category, currentDevice.value)
  })

  // 获取默认模板ID
  const getDefaultTemplateId = (device: DeviceType): string | null => {
    // 优先使用配置的默认模板
    if (config.defaultTemplates?.[device]) {
      return config.defaultTemplates[device]!
    }

    // 使用系统默认模板
    const defaultTemplate = templateManager.getDefaultTemplate(category, device)
    return defaultTemplate?.id || null
  }

  // 加载模板
  const loadTemplate = async (templateId: string): Promise<void> => {
    if (isLoading.value) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const template = await templateManager.loadTemplate(templateId)
      currentTemplate.value = template

      // 保存用户选择
      setUserPreference({
        templateId,
        deviceType: currentDevice.value
      })
    } catch (err) {
      error.value = err as Error
      console.error(`Failed to load template ${templateId}:`, err)
    } finally {
      isLoading.value = false
    }
  }

  // 切换模板
  const switchTemplate = async (templateId: string): Promise<boolean> => {
    const templateConfig = templateManager.getTemplateConfig(templateId)
    if (!templateConfig) {
      throw new Error(`Template not found: ${templateId}`)
    }

    // 检查模板是否属于当前分类和设备类型
    if (templateConfig.category !== category || templateConfig.device !== currentDevice.value) {
      throw new Error(`Template ${templateId} is not compatible with current category/device`)
    }

    await loadTemplate(templateId)
    return true
  }

  // 显示模板选择器
  const showSelector = async (selectorConfig?: TemplateSelectorConfig): Promise<string | null> => {
    return new Promise((resolve) => {
      // 这里需要与模板选择器组件集成
      // 暂时返回 null，实际实现需要显示选择器弹窗
      console.log('Template selector not implemented yet')
      resolve(null)
    })
  }

  // 刷新模板列表
  const refresh = async (): Promise<void> => {
    await templateManager.scanTemplates()
  }

  // 预加载模板
  const preload = async (templateIds: string[]): Promise<void> => {
    await templateManager.preloadTemplates(templateIds)
  }

  // 获取当前模板组件
  const getTemplateComponent = () => {
    return currentTemplate.value?.component || null
  }

  // 初始化模板
  const initializeTemplate = async (): Promise<void> => {
    const templates = availableTemplates.value
    if (templates.length === 0) {
      return
    }

    let templateId: string | null = null

    // 1. 优先使用用户保存的偏好（如果设备类型匹配）
    if (userPreference.value?.deviceType === currentDevice.value) {
      const preferredTemplate = templates.find(t => t.id === userPreference.value!.templateId)
      if (preferredTemplate) {
        templateId = preferredTemplate.id
      }
    }

    // 2. 使用默认模板
    if (!templateId) {
      templateId = getDefaultTemplateId(currentDevice.value)
    }

    // 3. 使用第一个可用模板
    if (!templateId && templates.length > 0) {
      templateId = templates[0].id
    }

    if (templateId) {
      await loadTemplate(templateId)
    }
  }

  // 监听设备类型变化
  watch(currentDevice, async (newDevice, oldDevice) => {
    if (config.autoSwitchByDevice && newDevice !== oldDevice) {
      await initializeTemplate()
    }
  })

  // 监听可用模板变化
  watch(availableTemplates, async (newTemplates) => {
    // 如果当前没有模板或当前模板不在新的模板列表中，重新初始化
    if (!currentTemplate.value ||
      !newTemplates.find(t => t.id === currentTemplate.value!.config.id)) {
      await initializeTemplate()
    }
  })

  // 组件挂载时初始化
  onMounted(async () => {
    await initializeTemplate()

    // 预加载（如果启用）
    if (config.preload) {
      const templateIds = availableTemplates.value.map(t => t.id)
      preload(templateIds).catch(err => {
        console.warn('Failed to preload templates:', err)
      })
    }
  })

  // 计算当前模板配置
  const currentTemplateConfig = computed(() =>
    currentTemplate.value ? currentTemplate.value.config : null
  )

  return {
    currentTemplate: currentTemplateConfig,
    availableTemplates,
    isLoading,
    error,
    switchTemplate,
    refreshTemplates: refresh,
    preloadTemplates: preload,
    clearError: () => { error.value = null },
    getTemplateById: (id: string) => templateManager.getTemplateConfig(id),
    getTemplatesByDevice: (device: DeviceType) => templateManager.getTemplatesByDevice(device),
    searchTemplates: (query: string) => templateManager.searchTemplates(query)
  }
}
