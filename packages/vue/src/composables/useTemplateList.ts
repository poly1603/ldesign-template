import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { TemplateMetadata, DeviceType } from '@ldesign/template-core'
import { getTemplateManager } from '../plugin/context'

/**
 * useTemplateList 返回值
 */
export interface UseTemplateListReturn {
  /**
   * 模板列表
   */
  templates: Ref<TemplateMetadata[]>

  /**
   * 加载状态
   */
  loading: Ref<boolean>

  /**
   * 模板数量
   */
  count: ComputedRef<number>

  /**
   * 刷新列表
   */
  refresh: () => void

  /**
   * 按标签过滤
   */
  filterByTag: (tag: string) => TemplateMetadata[]

  /**
   * 搜索模板
   */
  search: (keyword: string) => TemplateMetadata[]
}

/**
 * 使用模板列表 Composable
 * 
 * @param category - 功能分类
 * @param device - 设备类型(可选)
 * @returns 模板列表和操作方法
 * 
 * @example
 * ```ts
 * const { templates, count, refresh } = useTemplateList('login', 'desktop')
 * ```
 */
export function useTemplateList(
  category: string | Ref<string>,
  device?: DeviceType | Ref<DeviceType | undefined>
): UseTemplateListReturn {
  const templates = ref<TemplateMetadata[]>([])
  const loading = ref(false)

  const count = computed(() => templates.value.length)

  /**
   * 刷新列表
   */
  function refresh(): void {
    loading.value = true

    try {
      const manager = getTemplateManager()
      const cat = typeof category === 'string' ? category : category.value
      const dev = device
        ? typeof device === 'string'
          ? device
          : device.value
        : undefined

      if (dev) {
        // 同时指定分类和设备
        templates.value = manager.getTemplatesByCategoryAndDevice(cat, dev)
      } else {
        // 只指定分类
        templates.value = manager.getTemplatesByCategory(cat)
      }
    } catch (error) {
      console.error('获取模板列表失败:', error)
      templates.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * 按标签过滤
   */
  function filterByTag(tag: string): TemplateMetadata[] {
    return templates.value.filter((template: TemplateMetadata) =>
      template.tags?.includes(tag)
    )
  }

  /**
   * 搜索模板
   */
  function search(keyword: string): TemplateMetadata[] {
    const lowerKeyword = keyword.toLowerCase()
    return templates.value.filter(
      (template: TemplateMetadata) =>
        template.name.toLowerCase().includes(lowerKeyword) ||
        template.displayName?.toLowerCase().includes(lowerKeyword) ||
        template.description?.toLowerCase().includes(lowerKeyword) ||
        template.tags?.some((tag: string) => tag.toLowerCase().includes(lowerKeyword))
    )
  }

  // 初始加载
  refresh()

  return {
    templates,
    loading,
    count,
    refresh,
    filterByTag,
    search,
  }
}