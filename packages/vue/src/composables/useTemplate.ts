import { ref, shallowRef, watch, type Ref, type Component } from 'vue'
import type { TemplateMetadata } from '@ldesign/template-core'
import { getTemplateManager } from '../plugin/context'

/**
 * useTemplate 返回值
 */
export interface UseTemplateReturn {
  /**
   * 模板元数据
   */
  template: Ref<TemplateMetadata | undefined>

  /**
   * 加载的组件
   */
  component: Ref<Component | undefined>

  /**
   * 加载状态
   */
  loading: Ref<boolean>

  /**
   * 错误信息
   */
  error: Ref<Error | undefined>

  /**
   * 加载模板
   */
  load: (id?: string) => Promise<void>

  /**
   * 卸载模板
   */
  unload: () => void
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
  options: {
    /**
     * 是否自动加载
     * @default false
     */
    immediate?: boolean
    /**
     * 加载成功回调
     */
    onLoad?: (template: TemplateMetadata) => void
    /**
     * 加载失败回调
     */
    onError?: (error: Error) => void
  } = {}
): UseTemplateReturn {
  const { immediate = false, onLoad, onError } = options

  const template = ref<TemplateMetadata>()
  const component = shallowRef<Component>()
  const loading = ref(false)
  const error = ref<Error>()

  /**
   * 加载模板
   */
  async function load(id?: string): Promise<void> {
    const targetId = id || (typeof templateId === 'string' ? templateId : templateId.value)

    if (!targetId) {
      const err = new Error('模板ID不能为空')
      error.value = err
      onError?.(err)
      return
    }

    loading.value = true
    error.value = undefined

    try {
      // 获取管理器
      const manager = getTemplateManager()

      // 1. 从注册表获取元数据
      const meta = manager.resolveTemplate(targetId)
      if (!meta) {
        throw new Error(`模板未找到: ${targetId}`)
      }
      template.value = meta

      // 2. 动态加载组件
      if (meta.loader) {
        const module = await meta.loader()
        component.value = module.default
        onLoad?.(meta)
      } else {
        throw new Error(`模板缺少加载器: ${targetId}`)
      }
    } catch (e) {
      const err = e as Error
      error.value = err
      console.error('加载模板失败:', err)
      onError?.(err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 卸载模板
   */
  function unload(): void {
    component.value = undefined
    template.value = undefined
    error.value = undefined
  }

  // 响应式ID变化
  if (typeof templateId !== 'string') {
    watch(
      templateId,
      (newId) => {
        if (newId) {
          load(newId)
        } else {
          unload()
        }
      },
      { immediate }
    )
  } else if (immediate) {
    load(templateId)
  }

  return {
    template,
    component,
    loading,
    error,
    load,
    unload,
  }
}