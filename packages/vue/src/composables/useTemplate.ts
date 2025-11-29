import type { Component, Ref } from 'vue'
import { markRaw, nextTick, ref, shallowRef, watch } from 'vue'
import type { TemplateMetadata } from '@ldesign/template-core'
import { getTemplateManager, hasTemplateManager } from '../plugin/context'
import type { DeviceType, TemplateChangeInfo } from '../types/config'
import {
  getCategoryConfig,
  getDefaultTemplateName,
  getDisabledMessage,
  isDeviceDisabled,
  triggerTemplateChange,
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
  /** 加载模板 */
  load: (id?: string) => Promise<void>
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
  /** 模板分类（用于配置查找） */
  category?: string
  /** 设备类型（用于配置查找） */
  device?: DeviceType
  /** 切换来源标识 @default 'auto' */
  source?: 'user' | 'auto' | 'cache' | 'default'
  /** 加载成功回调 */
  onLoad?: (template: TemplateMetadata) => void
  /** 加载失败回调 */
  onError?: (error: Error) => void
  /** 模板切换回调（补充全局回调） */
  onChange?: (info: TemplateChangeInfo) => void
}

/**
 * 使用模板 Composable
 *
 * @param templateId - 模板ID或响应式ID
 * @param options - 选项
 * @returns 模板状态和操作方法
 *
 * @example
 * ```ts
 * const { component, loading, error, load } = useTemplate('login:desktop:default')
 *
 * onMounted(() => load())
 * ```
 */
export function useTemplate(
  templateId: string | Ref<string>,
  options: UseTemplateOptions = {},
): UseTemplateReturn {
  const {
    immediate = false,
    category: optCategory,
    device: optDevice,
    source = 'auto',
    onLoad,
    onError,
    onChange,
  } = options

  const template = ref<TemplateMetadata>()
  const component = shallowRef<Component>()
  const loading = ref(false)
  const error = ref<Error>()
  const disabled = ref(false)
  const disabledMessage = ref('')

  /** 上一个模板（用于切换回调） */
  let previousTemplate: TemplateMetadata | undefined

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
   *
   * @param originalId - 原始模板ID
   * @param currentCategory - 当前分类
   * @param currentDevice - 当前设备
   * @returns 最终模板ID和来源
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
   * 加载模板
   * @param id - 模板ID
   * @param loadSource - 加载来源（覆盖默认 source）
   */
  async function load(id?: string, loadSource?: 'user' | 'auto' | 'cache' | 'default'): Promise<void> {
    const originalId = id || (typeof templateId === 'string' ? templateId : templateId.value)

    if (!originalId) {
      const err = new Error('模板ID不能为空')
      error.value = err
      onError?.(err)
      return
    }

    // 解析原始模板ID
    const { category, device } = parseTemplateId(originalId)
    const currentCategory = optCategory || category
    const currentDevice = optDevice || device

    // 检查是否被禁用
    if (isDeviceDisabled(currentCategory, currentDevice)) {
      disabled.value = true
      disabledMessage.value = getDisabledMessage(currentCategory, currentDevice)
      loading.value = false

      // 加载禁用提示组件
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
      // 等待管理器初始化
      const ready = await waitForManager()
      if (!ready) {
        throw new Error('模板管理器初始化超时。请确保已安装 TemplatePlugin')
      }

      // 解析最终模板ID（优先使用缓存）
      // 如果是用户手动选择（loadSource === 'user'），则直接使用传入的ID
      let targetId: string
      let actualSource: 'user' | 'auto' | 'cache' | 'default'

      if (loadSource === 'user') {
        // 用户手动选择，直接使用传入的ID
        targetId = originalId
        actualSource = 'user'
      }
      else {
        // 自动加载，优先使用缓存
        const resolved = resolveTemplateId(originalId, currentCategory, currentDevice)
        targetId = resolved.finalId
        actualSource = loadSource || resolved.resolvedSource
      }

      // 解析最终模板名称
      const { name: finalName } = parseTemplateId(targetId)

      // 获取管理器
      const manager = getTemplateManager()

      // 1. 从注册表获取元数据
      const meta = manager.resolveTemplate(targetId)
      if (!meta) {
        throw new Error(`模板未找到: ${targetId}`)
      }

      // 保存上一个模板
      previousTemplate = template.value

      template.value = meta

      // 2. 动态加载组件
      if (meta.loader) {
        const module = await meta.loader()
        component.value = markRaw(module.default)
        onLoad?.(meta)

        // 3. 缓存模板选择（仅用户手动选择时）
        if (actualSource === 'user') {
          cacheTemplateSelection(currentCategory, currentDevice, finalName)
        }

        // 4. 触发切换回调
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

        // 触发本地回调
        onChange?.(changeInfo)

        // 触发全局回调
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
    // 延迟到下一个 tick 执行，给插件安装时间
    nextTick(() => load(templateId))
  }

  return {
    template,
    component,
    loading,
    error,
    disabled,
    disabledMessage,
    load,
    unload,
  }
}