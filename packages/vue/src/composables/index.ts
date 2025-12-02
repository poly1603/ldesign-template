/**
 * Composables 模块导出
 */

export { useTemplate, type UseTemplateReturn, type UseTemplateOptions } from './useTemplate'
export { useTemplateList, type UseTemplateListReturn } from './useTemplateList'
export {
  useAutoDevice,
  getCurrentDeviceType,
  type UseAutoDeviceReturn,
  type UseAutoDeviceOptions,
} from './useAutoDevice'

// 布局相关 composables
export {
  useLayout,
  type LayoutMode,
  type LayoutState,
  type UseLayoutReturn,
  type UseLayoutOptions,
} from './useLayout'
export {
  useSider,
  type SiderState,
  type UseSiderReturn,
  type UseSiderOptions,
} from './useSider'

// 注意：useRouteTabs 已迁移到 @ldesign/bookmark-vue 包中