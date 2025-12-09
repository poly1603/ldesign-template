import type { Component, Ref } from 'vue'
import { markRaw, nextTick, ref, shallowRef, watch, onMounted, onUnmounted } from 'vue'
import type { TemplateMetadata } from '@ldesign/template-core'
import { getTemplateManager, hasTemplateManager } from '../plugin/context'
import type { DeviceType, TemplateChangeInfo } from '../types/config'
import {
  getBreakpoints,
  getCategoryConfig,
  getDefaultTemplateName,
  getDisabledMessage,
  isDeviceDisabled,
  triggerTemplateChange,
  onTemplateChange,
} from '../plugin/template-config-context'
import {
  cacheTemplateSelection,
  getCachedTemplateSelection,
} from '../plugin/template-cache'
import TemplateDeviceNotSupported from '../components/TemplateDeviceNotSupported.vue'

/** 最大重试次数 */
const MAX_RETRY = 10
/** 重试间隔（毫秒） */
const RETRY_INTERVAL = 100

/**
 * useTemplate 返回值
 */
export interface UseTemplateReturn {
  /** 模板元数据 */
  template: Ref<TemplateMetadata | undefined>
  /** 加载的组件 */
  component: Ref<Component | undefined>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 错误信息 */
  error: Ref<Error | undefined>
  /** 是否被禁用 */
  disabled: Ref<boolean>
  /** 禁用消息 */
  disabledMessage: Ref<string>
  /** 当前设备类型（自动检测时有效） */
  deviceType: Ref<DeviceType>
  /** 加载模板 */
  load: (id?: string, loadSource?: 'user' | 'auto' | 'cache' | 'default') => Promise<void>
  /** 卸载模板 */
  unload: () => void
}

/**
 * 等待模板管理器初始化
 */
async function waitForManager(): Promise<boolean> {
  for (let i = 0; i < MAX_RETRY; i++) {
    if (hasTemplateManager()) {
      return true
    }
    await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL))
  }
  return false
}

/**
 * useTemplate 选项
 */
export interface UseTemplateOptions {
  /** 是否自动加载 @default false */
  immediate?: boolean
  /** 模板分类（用于配置查找，简化模式下必填） */
  category?: string
  /**
   * 设备类型（用于配置查找）
   * - 如果不传递，将自动检测当前设备类型
   * - 如果传递了具体值，将使用指定的设备类型
   */
  device?: DeviceType
  /**
   * 是否启用自动设备检测和响应式切换
   * - true: 自动检测设备类型，并在窗口大小变化时自动切换模板
   * - false: 不自动检测，使用传入的 device 参数
   * @default true（当 device 未指定时）
   */
  autoDevice?: boolean
  /** 切换来源标识 @default 'auto' */
  source?: 'user' | 'auto' | 'cache' | 'default'
  /** 加载成功回调 */
  onLoad?: (template: TemplateMetadata) => void
  /** 加载失败回调 */
  onError?: (error: Error) => void
  /** 模板切换回调（补充全局回调） */
  onChange?: (info: TemplateChangeInfo) => void
  /** 设备类型变化回调 */
  onDeviceChange?: (device: DeviceType) => void
}

/**
 * 根据宽度计算设备类型
 */
function calculateDeviceType(width: number): DeviceType {
  const bp = getBreakpoints()
  if (width < bp.mobile) return 'mobile'
  if (width < bp.tablet) return 'tablet'
  return 'desktop'
}

/**
 * 使用模板 Composable
 *
 * 支持两种使用模式：
 * 1. 简化模式：只传分类名，自动检测设备类型
 *    ```ts
 *    const { component } = useTemplate('login', { immediate: true })
 *    ```
 *
 * 2. 完整模式：传完整的模板ID
 *    ```ts
 *    const { component } = useTemplate('login:desktop:default', { immediate: true })
 *    ```
 *
 * @param templateId - 模板ID、分类名或响应式ID
 * @param options - 选项
 * @returns 模板状态和操作方法
 */
export function useTemplate(
  templateId: string | Ref<string>,
  options: UseTemplateOptions = {},
): UseTemplateReturn {
  const {
    immediate = false,
    category: optCategory,
    device: optDevice,
    autoDevice: optAutoDevice,
    source = 'auto',
    onLoad,
    onError,
    onChange,
    onDeviceChange,
  } = options

  // 判断是否需要自动设备检测
  // 如果显式传了 device，默认不自动检测；否则默认自动检测
  const shouldAutoDetect = optAutoDevice ?? (optDevice === undefined)

  const template = ref<TemplateMetadata>()
  const component = shallowRef<Component>()
  const loading = ref(false)
  const error = ref<Error>()
  const disabled = ref(false)
  const disabledMessage = ref('')

  // 当前设备类型（用于自动检测模式）
  const deviceType = ref<DeviceType>(
    optDevice ?? (typeof window !== 'undefined' ? calculateDeviceType(window.innerWidth) : 'desktop'),
  )

  /** 上一个模板（用于切换回调） */
  let previousTemplate: TemplateMetadata | undefined

  /** 防抖定时器 */
  let resizeDebounceTimer: ReturnType<typeof setTimeout> | null = null

  /** 是否正在加载中（用于防止重复加载） */
  let isLoading = false

  /** 取消订阅模板变化事件的函数 */
  let unsubscribeTemplateChange: (() => void) | null = null

  /**
   * 解析模板ID，提取分类、设备和名称
   */
  function parseTemplateId(id: string): { category: string, device: DeviceType, name: string } {
    const parts = id.split(':')
    return {
      category: parts[0] || '',
      device: (parts[1] || 'desktop') as DeviceType,
      name: parts[2] || 'default',
    }
  }

  /**
   * 解析最终要加载的模板ID
   * 优先级：缓存 > 配置默认值 > 传入的ID
   */
  function resolveTemplateId(
    originalId: string,
    currentCategory: string,
    currentDevice: DeviceType,
  ): { finalId: string, resolvedSource: 'user' | 'auto' | 'cache' | 'default' } {
    const { name: originalName } = parseTemplateId(originalId)

    // 1. 优先从缓存获取用户上次选择的模板
    const cachedName = getCachedTemplateSelection(currentCategory, currentDevice)
    if (cachedName) {
      return {
        finalId: `${currentCategory}:${currentDevice}:${cachedName}`,
        resolvedSource: 'cache',
      }
    }

    // 2. 其次使用配置中的默认模板名称
    const configDefaultName = getDefaultTemplateName(currentCategory, currentDevice)
    if (typeof configDefaultName === 'string' && configDefaultName) {
      return {
        finalId: `${currentCategory}:${currentDevice}:${configDefaultName}`,
        resolvedSource: 'default',
      }
    }

    // 3. 最后使用传入的原始ID
    return {
      finalId: originalId,
      resolvedSource: 'auto',
    }
  }

  /**
   * 判断传入的 ID 是否为简化模式（只有分类名）
   */
  function isSimplifiedId(id: string): boolean {
    return !id.includes(':')
  }

  /**
   * 加载模板
   */
  async function load(id?: string, loadSource?: 'user' | 'auto' | 'cache' | 'default'): Promise<void> {
    // 防止重复加载
    if (isLoading) return
    isLoading = true

    const originalId = id || (typeof templateId === 'string' ? templateId : templateId.value)

    if (!originalId) {
      const err = new Error('模板ID不能为空')
      error.value = err
      onError?.(err)
      isLoading = false
      return
    }

    // 判断是否为简化模式（只传分类名）
    const isSimplified = isSimplifiedId(originalId)

    // 解析原始模板ID
    let category: string
    let device: DeviceType
    let name: string

    if (isSimplified) {
      category = originalId
      device = deviceType.value
      name = 'default'
    }
    else {
      const parsed = parseTemplateId(originalId)
      category = parsed.category
      device = parsed.device
      name = parsed.name
    }

    // 应用选项覆盖
    const currentCategory = optCategory || category
    const currentDevice = optDevice || device

    // 检查是否被禁用
    if (isDeviceDisabled(currentCategory, currentDevice)) {
      disabled.value = true
      disabledMessage.value = getDisabledMessage(currentCategory, currentDevice)
      loading.value = false
      isLoading = false

      const categoryConfig = getCategoryConfig(currentCategory)
      component.value = markRaw(categoryConfig?.disabledComponent || TemplateDeviceNotSupported)
      template.value = undefined
      return
    }

    disabled.value = false
    disabledMessage.value = ''
    loading.value = true
    error.value = undefined

    try {
      const ready = await waitForManager()
      if (!ready) {
        throw new Error('模板管理器初始化超时。请确保已安装 TemplatePlugin')
      }

      let targetId: string
      let actualSource: 'user' | 'auto' | 'cache' | 'default'

      if (loadSource === 'user') {
        targetId = originalId
        actualSource = 'user'
      }
      else {
        const resolved = resolveTemplateId(originalId, currentCategory, currentDevice)
        targetId = resolved.finalId
        actualSource = loadSource || resolved.resolvedSource
      }

      const { name: finalName } = parseTemplateId(targetId)
      const manager = getTemplateManager()

      const meta = manager.resolveTemplate(targetId)
      if (!meta) {
        throw new Error(`模板未找到: ${targetId}`)
      }

      previousTemplate = template.value
      template.value = meta

      if (meta.loader) {
        const module = await meta.loader()
        component.value = markRaw(module.default)
        onLoad?.(meta)

        if (actualSource === 'user') {
          cacheTemplateSelection(currentCategory, currentDevice, finalName)
        }

        const changeInfo: TemplateChangeInfo = {
          category: currentCategory,
          device: currentDevice,
          templateName: finalName,
          templateId: targetId,
          template: meta,
          previousTemplate,
          timestamp: Date.now(),
          source: actualSource,
        }

        onChange?.(changeInfo)
        await triggerTemplateChange(changeInfo)
      }
      else {
        throw new Error(`模板缺少加载器: ${targetId}`)
      }
    }
    catch (e) {
      const err = e as Error
      error.value = err
      console.error('加载模板失败:', err)
      onError?.(err)
    }
    finally {
      loading.value = false
      isLoading = false
    }
  }

  /**
   * 卸载模板
   */
  function unload(): void {
    previousTemplate = template.value
    component.value = undefined
    template.value = undefined
    error.value = undefined
    disabled.value = false
    disabledMessage.value = ''
  }

  /**
   * 处理窗口大小变化（带防抖）
   */
  function handleResize(): void {
    if (resizeDebounceTimer) {
      clearTimeout(resizeDebounceTimer)
    }
    resizeDebounceTimer = setTimeout(() => {
      if (typeof window === 'undefined') return

      const newDeviceType = calculateDeviceType(window.innerWidth)
      if (newDeviceType !== deviceType.value) {
        deviceType.value = newDeviceType
        onDeviceChange?.(newDeviceType)

        const currentId = typeof templateId === 'string' ? templateId : templateId.value
        if (currentId) {
          if (isSimplifiedId(currentId)) {
            load(currentId)
          }
          else {
            const { category, name } = parseTemplateId(currentId)
            load(`${category}:${newDeviceType}:${name}`)
          }
        }
      }
      resizeDebounceTimer = null
    }, 100)
  }

  /**
   * 处理全局模板变化事件
   * 当其他 useTemplate 实例切换了同一分类的模板时，自动重新加载
   */
  function handleGlobalTemplateChange(info: TemplateChangeInfo): void {
    const currentCat = optCategory || (typeof templateId === 'string' ? (isSimplifiedId(templateId) ? templateId : parseTemplateId(templateId).category) : '')
    if (info.category === currentCat && info.source === 'user') {
      load(undefined, 'cache')
    }
  }

  // 设置事件监听
  onMounted(() => {
    if (shouldAutoDetect && typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
    }
    unsubscribeTemplateChange = onTemplateChange(handleGlobalTemplateChange)
  })

  onUnmounted(() => {
    if (resizeDebounceTimer) {
      clearTimeout(resizeDebounceTimer)
      resizeDebounceTimer = null
    }
    if (shouldAutoDetect && typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize)
    }
    if (unsubscribeTemplateChange) {
      unsubscribeTemplateChange()
      unsubscribeTemplateChange = null
    }
  })

  // 响应式ID变化
  if (typeof templateId !== 'string') {
    watch(
      templateId,
      (newId) => {
        if (newId) {
          load(newId)
        }
        else {
          unload()
        }
      },
      { immediate },
    )
  }
  else if (immediate) {
    nextTick(() => load(templateId))
  }

  return {
    template,
    component,
    loading,
    error,
    disabled,
    disabledMessage,
    deviceType,
    load,
    unload,
  }
}
