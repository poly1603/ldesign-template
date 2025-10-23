import type { ComputedRef } from 'vue'
import { inject } from 'vue'
import type { DeviceType } from '../types'

/**
 * 模板选择器注入的数据类型
 */
export interface TemplateSelectorInjection {
  props: ComputedRef<{
    category: string
    device: DeviceType
    currentTemplate: string
  }>
  onSelect: (templateName: string) => void
  enabled: boolean
}

/**
 * 使用模板选择器
 * 
 * 在模板组件中使用此 composable 来获取选择器控制
 * 
 * @example
 * ```vue
 * <script setup>
 * import { useTemplateSelector } from '@ldesign/template'
 * 
 * const selector = useTemplateSelector()
 * </script>
 * 
 * <template>
 *   <div>
 *     <!-- 在任何位置放置选择器 -->
 *     <TemplateSelector
 *       v-if="selector"
 *       v-bind="selector.props.value"
 *       @select="selector.onSelect"
 *     />
 *   </div>
 * </template>
 * ```
 */
export function useTemplateSelector() {
  const selector = inject<TemplateSelectorInjection | null>('templateSelector', null)

  return selector
}

